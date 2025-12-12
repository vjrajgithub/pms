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
  Divider,
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
  Group,
  Assignment,
  CheckCircle,
  Schedule,
  Person,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: '',
    deadline: '',
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data);
      setEditForm({
        name: response.data.name,
        description: response.data.description || '',
        status: response.data.status,
        deadline: response.data.deadline ? response.data.deadline.split('T')[0] : '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to load project details');
      console.error('Project detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`/api/projects/${id}`, editForm);
      setEditDialog(false);
      fetchProject();
    } catch (err) {
      console.error('Edit project error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/projects/${id}`);
      navigate('/projects');
    } catch (err) {
      console.error('Delete project error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'on_hold': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
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

  if (error || !project) {
    return (
      <Box p={3}>
        <Typography color="error">{error || 'Project not found'}</Typography>
      </Box>
    );
  }

  const completionRate = project.tasks?.length > 0 
    ? Math.round((project.tasks.filter(task => task.status === 'completed').length / project.tasks.length) * 100)
    : 0;

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/projects')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {project.name}
        </Typography>
        {(user.isManager() || user.id === project.manager_id) && (
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Project Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Project Details
                </Typography>
                <Chip 
                  label={project.status.replace('_', ' ').toUpperCase()} 
                  color={getStatusColor(project.status)}
                  size="small"
                />
              </Box>
              
              <Typography variant="body1" color="text.secondary" mb={2}>
                {project.description || 'No description available'}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Manager
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      <Person />
                    </Avatar>
                    <Typography variant="body2">
                      {project.manager?.full_name || 'Not assigned'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Deadline
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Progress ({completionRate}%)
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={completionRate} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Teams */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Teams ({project.teams?.length || 0})
              </Typography>
              <List>
                {project.teams?.map((team) => (
                  <ListItem key={team.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <Group />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={team.name}
                      secondary={`${team.members_count || 0} members`}
                    />
                    <Chip 
                      label={team.status} 
                      color={getStatusColor(team.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
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
                    <Assignment color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">{project.tasks?.length || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Tasks
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <CheckCircle color="success" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">
                      {project.tasks?.filter(task => task.status === 'completed').length || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Group color="info" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">{project.teams?.length || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Teams
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Schedule color="warning" sx={{ fontSize: 32 }} />
                    <Typography variant="h6">
                      {project.tasks?.filter(task => 
                        task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed'
                      ).length || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Overdue
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Recent Tasks</Typography>
              <List>
                {project.tasks?.slice(0, 5).map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemText
                      primary={task.title}
                      secondary={`Assigned to: ${task.assigned_user?.full_name || 'Unassigned'}`}
                    />
                    <Chip 
                      label={task.status} 
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
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
          <Edit sx={{ mr: 1 }} /> Edit Project
        </MenuItem>
        <MenuItem onClick={() => { setDeleteDialog(true); setAnchorEl(null); }}>
          <Delete sx={{ mr: 1 }} /> Delete Project
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Project Name"
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
              <MenuItem value="planning">Planning</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="on_hold">On Hold</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Deadline"
            type="date"
            value={editForm.deadline}
            onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetail;
