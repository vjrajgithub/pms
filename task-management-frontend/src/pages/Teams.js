import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Fab,
  Avatar,
  AvatarGroup
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Teams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_id: '',
    team_lead_id: '',
    max_members: 10,
    status: 'active'
  });

  useEffect(() => {
    fetchTeams();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/teams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateTeam = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      description: '',
      project_id: '',
      team_lead_id: '',
      max_members: 10,
      status: 'active'
    });
    setOpenDialog(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name || '',
      description: team.description || '',
      project_id: team.project_id || '',
      team_lead_id: team.team_lead_id || '',
      max_members: team.max_members || 10,
      status: team.status || 'active'
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const openMembersDialog = async (team) => {
    try {
      setSelectedTeam(team);
      const token = localStorage.getItem('token');
      const resp = await axios.get(`/api/teams/${team.id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const raw = resp.data || [];
      // Normalize to plain users for UI
      const normalized = raw.map((m) => m.user ?? m);
      setTeamMembers(normalized);
      setMembersDialogOpen(true);
    } catch (error) {
      console.error('Error loading members:', error);
    }
    setAnchorEl(null);
  };

  const addMember = async () => {
    if (!memberToAdd || !selectedTeam) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/teams/${selectedTeam.id}/add-member`, { user_id: Number(memberToAdd), role: 'member' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // refresh list
      const resp = await axios.get(`/api/teams/${selectedTeam.id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const raw = resp.data || [];
      const normalized = raw.map((m) => m.user ?? m);
      setTeamMembers(normalized);
      setMemberToAdd('');
      fetchTeams();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const removeMember = async (userId) => {
    if (!selectedTeam) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/teams/${selectedTeam.id}/remove-member/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamMembers(prev => prev.filter(m => m.id !== userId));
      fetchTeams();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingTeam ? `/api/teams/${editingTeam.id}` : '/api/teams';
      const method = editingTeam ? 'put' : 'post';
      const payload = { ...formData };
      if (!payload.project_id) {
        delete payload.project_id;
      }

      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOpenDialog(false);
      fetchTeams();
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'archived': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Box p={3}>Loading...</Box>;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Teams
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTeam}
        >
          Create Team
        </Button>
      </Box>

      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Card
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/teams/${team.id}`)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" component="h3" gutterBottom>
                    {team.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnchorEl(e.currentTarget);
                      setSelectedTeam(team);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {team.description}
                </Typography>
                
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={team.status}
                    color={getStatusColor(team.status)}
                    size="small"
                  />
                </Box>
                
                {team.project && (
                  <Typography variant="body2" color="primary" gutterBottom>
                    Project: {team.project.name}
                  </Typography>
                )}
                
                {team.team_lead && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Lead: {team.team_lead.first_name} {team.team_lead.last_name}
                  </Typography>
                )}
                
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                  <Box display="flex" alignItems="center">
                    <PeopleIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {team.members_count || 0}/{team.max_members} members
                    </Typography>
                  </Box>
                  
                  {team.members && team.members.length > 0 && (
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
                      {team.members.map((member) => (
                        <Avatar 
                          key={member.id}
                          src={member.avatar}
                        >
                          {!member.avatar && `${member.first_name?.[0]}${member.last_name?.[0]}`}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  )}
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      openMembersDialog(team);
                    }}
                  >
                    Manage Members
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreateTeam}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEditTeam(selectedTeam)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteTeam(selectedTeam?.id)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
        <MenuItem onClick={() => openMembersDialog(selectedTeam)}>
          <PeopleIcon sx={{ mr: 1 }} />
          Members
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTeam ? 'Edit Team' : 'Create New Team'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Team Lead</InputLabel>
            <Select
              value={formData.team_lead_id}
              label="Team Lead"
              onChange={(e) => setFormData({ ...formData, team_lead_id: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {users.filter(u => u.role?.name === 'team_lead' || u.role?.name === 'manager').map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Max Members"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.max_members}
            onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTeam ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Team Members Dialog */}
      <Dialog open={membersDialogOpen} onClose={() => setMembersDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Members - {selectedTeam?.name}</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} alignItems="center" sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Add Member</InputLabel>
              <Select
                value={memberToAdd}
                label="Add Member"
                onChange={(e) => setMemberToAdd(e.target.value)}
              >
                {users
                  .filter(u => !teamMembers.some(m => m.id === u.id))
                  .map(u => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.first_name} {u.last_name} ({u.role?.display_name || u.role?.name})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={addMember} disabled={!memberToAdd}>Add</Button>
          </Box>
          <Card variant="outlined">
            <CardContent>
              {teamMembers.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No members in this team.</Typography>
              ) : (
                teamMembers.map((m) => (
                  <Box key={m.id} display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {m.first_name?.[0]}{m.last_name?.[0]}
                      </Avatar>
                      <Typography variant="body2">{m.first_name} {m.last_name}</Typography>
                    </Box>
                    <Button size="small" color="error" onClick={() => removeMember(m.id)}>Remove</Button>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMembersDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teams;
