import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Group,
  Person,
  Settings,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMembersDialog, setOpenMembersDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_id: '',
    max_members: 10,
    status: 'active',
  });

  useEffect(() => {
    fetchTeams();
    fetchProjects();
    fetchTeamMembers();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/teams');
      setTeams(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load teams');
      console.error('Teams error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get('/api/users?role=team_member');
      setTeamMembers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    }
  };

  const handleOpenDialog = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        description: team.description,
        project_id: team.project_id,
        max_members: team.max_members,
        status: team.status,
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        description: '',
        project_id: '',
        max_members: 10,
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTeam(null);
  };

  const handleOpenMembersDialog = (team) => {
    setSelectedTeam(team);
    setOpenMembersDialog(true);
  };

  const handleCloseMembersDialog = () => {
    setOpenMembersDialog(false);
    setSelectedTeam(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };
      if (!payload.project_id) {
        delete payload.project_id;
      }

      if (editingTeam) {
        await axios.put(`/api/teams/${editingTeam.id}`, payload);
      } else {
        await axios.post('/api/teams', payload);
      }
      fetchTeams();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save team:', err);
    }
  };

  const handleDelete = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await axios.delete(`/api/teams/${teamId}`);
        fetchTeams();
      } catch (err) {
        console.error('Failed to delete team:', err);
      }
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await axios.post(`/api/teams/${selectedTeam.id}/add-member`, {
        user_id: userId,
        role: 'member'
      });
      fetchTeams();
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await axios.delete(`/api/teams/${selectedTeam.id}/remove-member/${userId}`);
      fetchTeams();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'disbanded': return 'error';
      default: return 'default';
    }
  };

  const canManageTeam = (team) => {
    return user?.role?.name === 'manager' || 
           (user?.role?.name === 'team_lead' && team.team_lead_id === user.id);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Loading teams...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Teams
        </Typography>
        {(user?.role?.name === 'manager' || user?.role?.name === 'team_lead') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            New Team
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} lg={4} key={team.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(`/teams/${team.id}`)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {team.name}
                  </Typography>
                  {canManageTeam(team) && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(team);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMembersDialog(team);
                        }}
                      >
                        <Settings fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {team.description}
                </Typography>

                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={team.status}
                    color={getStatusColor(team.status)}
                    size="small"
                  />
                  <Chip
                    label={`${team.members?.length || 0}/${team.max_members} members`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {team.project && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Project: {team.project.name}
                  </Typography>
                )}

                {team.team_lead && (
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {team.team_lead.first_name[0]}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      Lead: {team.team_lead.first_name} {team.team_lead.last_name}
                    </Typography>
                  </Box>
                )}

                {team.members && team.members.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Members:
                    </Typography>
                    <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                      {team.members.map((member) => (
                        <Avatar
                          key={member.id}
                          sx={{ width: 32, height: 32, fontSize: '0.75rem' }}
                          title={`${member.first_name} ${member.last_name}`}
                        >
                          {member.first_name[0]}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Team Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTeam ? 'Edit Team' : 'Create New Team'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Team Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Members"
                name="max_members"
                type="number"
                value={formData.max_members}
                onChange={handleInputChange}
                inputProps={{ min: 1, max: 50 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="disbanded">Disbanded</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTeam ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Members Dialog */}
      <Dialog 
        open={openMembersDialog} 
        onClose={handleCloseMembersDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Manage Team Members - {selectedTeam?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Current Members ({selectedTeam?.members?.length || 0}/{selectedTeam?.max_members})
          </Typography>
          
          <List>
            {selectedTeam?.members?.map((member) => (
              <ListItem key={member.id}>
                <ListItemAvatar>
                  <Avatar>
                    {member.first_name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${member.first_name} ${member.last_name}`}
                  secondary={member.email}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveMember(member.id)}
                    color="error"
                  >
                    <PersonRemove />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Available Members
          </Typography>
          
          <List>
            {teamMembers
              .filter(member => !selectedTeam?.members?.some(m => m.id === member.id))
              .map((member) => (
                <ListItem key={member.id}>
                  <ListItemAvatar>
                    <Avatar>
                      {member.first_name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${member.first_name} ${member.last_name}`}
                    secondary={member.email}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleAddMember(member.id)}
                      color="primary"
                      disabled={(selectedTeam?.members?.length || 0) >= selectedTeam?.max_members}
                    >
                      <PersonAdd />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMembersDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teams;
