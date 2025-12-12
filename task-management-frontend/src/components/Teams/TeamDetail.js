import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  MoreVert,
  Person,
  Assignment,
  CheckCircle,
  Group,
  Add,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: '',
  });

  const [memberForm, setMemberForm] = useState({
    user_id: '',
    role: 'member',
  });

  useEffect(() => {
    fetchTeam();
    fetchAvailableUsers();
    fetchStats();
  }, [id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/teams/${id}`);
      setTeam(response.data);
      setEditForm({
        name: response.data.name,
        description: response.data.description || '',
        status: response.data.status,
      });
      setError(null);
    } catch (err) {
      setError('Failed to load team details');
      console.error('Team detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`/api/teams/${id}/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Team stats error:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setAvailableUsers(response.data.data || []);
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`/api/teams/${id}`, editForm);
      setEditDialog(false);
      fetchTeam();
    } catch (err) {
      console.error('Edit team error:', err);
    }
  };

  const handleAddMember = async () => {
    try {
      await axios.post(`/api/teams/${id}/add-member`, memberForm);
      setAddMemberDialog(false);
      setMemberForm({ user_id: '', role: 'member' });
      fetchTeam();
      fetchStats();
    } catch (err) {
      console.error('Add member error:', err);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await axios.delete(`/api/teams/${id}/remove-member/${userId}`);
      fetchTeam();
      fetchStats();
    } catch (err) {
      console.error('Remove member error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'inactive': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  if (error || !team) {
    return (
      <Box p={3}>
        <Typography color="error">{error || 'Team not found'}</Typography>
      </Box>
    );
  }

  let completionRate = team.tasks?.length > 0 
    ? Math.round((team.tasks.filter(task => task.status === 'completed').length / team.tasks.length) * 100)
    : 0;

  if (stats?.summary?.tasks) {
    const total = stats.summary.tasks.total || 0;
    const completed = stats.summary.tasks.completed || 0;
    completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  const isManagerUser = !!(user && (typeof user.isManager === 'function'
    ? user.isManager()
    : user.role?.name === 'manager'));

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/teams')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {team.name}
        </Typography>
        {(isManagerUser || user?.id === team.team_lead_id) && (
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Team Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Team Details & Members ({team.members?.length || 0})
                </Typography>
                <Chip 
                  label={team.status.toUpperCase()} 
                  color={getStatusColor(team.status)}
                  size="small"
                />
              </Box>
              
              <Typography variant="body1" color="text.secondary" mb={2}>
                {team.description || 'No description available'}
              </Typography>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Team Lead
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      <Person />
                    </Avatar>
                    <Typography variant="body2">
                      {team.team_lead?.first_name && team.team_lead?.last_name
                        ? `${team.team_lead.first_name} ${team.team_lead.last_name}`
                        : team.team_lead?.email || 'Not assigned'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box mt={3} mb={2}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Task Progress ({completionRate}%)
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={completionRate} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  Members
                </Typography>
                {(isManagerUser || user?.id === team.team_lead_id) && (
                  <Button
                    startIcon={<Add />}
                    variant="outlined"
                    size="small"
                    onClick={() => setAddMemberDialog(true)}
                  >
                    Add Member
                  </Button>
                )}
              </Box>
              <List>
                {team.members?.map((member) => {
                  const memberStats = stats?.members?.find(m => m.id === member.user?.id);
                  return (
                    <ListItem key={member.id} divider>
                      <ListItemAvatar>
                        <Avatar 
                          src={member.user?.avatar}
                          sx={{ width: 40, height: 40 }}
                        >
                          {!member.user?.avatar && `${member.user?.first_name?.[0]}${member.user?.last_name?.[0]}`}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${member.user?.first_name} ${member.user?.last_name}`}
                        secondary={
                          memberStats
                            ? `Tasks: ${memberStats.tasks.total || 0} · Completed: ${memberStats.tasks.completed || 0} · Pending: ${memberStats.tasks.pending || 0} · In Progress: ${memberStats.tasks.in_progress || 0} · ${member.role} • Joined ${new Date(member.joined_at).toLocaleDateString()}`
                            : `${member.role} • Joined ${new Date(member.joined_at).toLocaleDateString()}`
                        }
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        {memberStats && (
                          <Typography variant="body2" color="primary">
                            {memberStats.progress_percentage || 0}%
                          </Typography>
                        )}
                        <Chip 
                          label={member.status} 
                          color={getStatusColor(member.status)}
                          size="small"
                        />
                        {(isManagerUser || user?.id === team.team_lead_id) && member.user?.id !== team.team_lead_id && (
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleRemoveMember(member.user?.id)}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Statistics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Group color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">{team.members?.length || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Members
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Assignment color="info" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">{stats?.summary?.tasks?.total ?? (team.tasks?.length || 0)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tasks
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <CheckCircle color="success" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">
                      {stats?.summary?.tasks?.completed ?? (team.tasks?.filter(task => task.status === 'completed').length || 0)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary">
                      {completionRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Progress
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {stats && stats.projects && stats.projects.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" mb={2}>Projects Overview</Typography>
                {stats.projects.map((project) => (
                  <Box key={project.id} mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1">{project.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.tasks.total || 0} tasks
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Completed: {project.tasks.completed || 0} · Pending: {project.tasks.pending || 0} · In Progress: {project.tasks.in_progress || 0}
                      </Typography>
                      <Typography variant="caption" color="primary">
                        {project.progress_percentage || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress_percentage || 0}
                      sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Tasks */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Recent Tasks</Typography>
              <List sx={{ p: 0 }}>
                {(stats?.recent_tasks && stats.recent_tasks.length > 0)
                  ? stats.recent_tasks.map((task) => {
                      const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
                      return (
                        <ListItem
                          key={task.id}
                          divider
                          sx={{
                            borderLeft: isOverdue ? '4px solid' : 'none',
                            borderLeftColor: isOverdue ? 'error.main' : 'transparent',
                            bgcolor: isOverdue ? 'error.lighter' : 'transparent',
                            pl: isOverdue ? 1.5 : 2,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {task.title}
                                </Typography>
                                {isOverdue && (
                                  <Chip
                                    label="Overdue"
                                    size="small"
                                    color="error"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box mt={0.5}>
                                <Typography
                                  variant="body2"
                                  color="primary"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {task.assigned_user?.full_name || 'Unassigned'}
                                </Typography>
                                {task.due_date && (
                                  <Typography variant="caption" color="text.secondary">
                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <Chip 
                            label={task.status} 
                            color={getStatusColor(task.status)}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </ListItem>
                      );
                    })
                  : (team.tasks && team.tasks.length > 0)
                    ? team.tasks.slice(0, 5).map((task) => {
                        const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
                        return (
                          <ListItem
                            key={task.id}
                            divider
                            sx={{
                              borderLeft: isOverdue ? '4px solid' : 'none',
                              borderLeftColor: isOverdue ? 'error.main' : 'transparent',
                              bgcolor: isOverdue ? 'error.lighter' : 'transparent',
                              pl: isOverdue ? 1.5 : 2,
                            }}
                          >
                            <ListItemText
                              primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {task.title}
                                  </Typography>
                                  {isOverdue && (
                                    <Chip
                                      label="Overdue"
                                      size="small"
                                      color="error"
                                      sx={{ fontSize: '0.7rem', height: 20 }}
                                    />
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box mt={0.5}>
                                  <Typography
                                    variant="body2"
                                    color="primary"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {task.assigned_user?.full_name || 'Unassigned'}
                                  </Typography>
                                  {task.due_date && (
                                    <Typography variant="caption" color="text.secondary">
                                      Due: {new Date(task.due_date).toLocaleDateString()}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                            <Chip 
                              label={task.status} 
                              color={getStatusColor(task.status)}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </ListItem>
                        );
                      })
                    : (
                      <ListItem>
                        <ListItemText
                          primary="No tasks found"
                          secondary="This team has no tasks assigned yet."
                        />
                      </ListItem>
                    )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setEditDialog(true); setAnchorEl(null); }}>
          <Edit sx={{ mr: 1 }} /> Edit Team
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Team</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Team Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addMemberDialog} onClose={() => setAddMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>User</InputLabel>
            <Select
              value={memberForm.user_id}
              onChange={(e) => setMemberForm({ ...memberForm, user_id: e.target.value })}
            >
              {availableUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.full_name} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={memberForm.role}
              onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="lead">Lead</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMemberDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMember} variant="contained">Add Member</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamDetail;
