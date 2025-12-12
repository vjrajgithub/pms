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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Fab,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Group,
  Assignment,
  CalendarToday,
  MoreVert,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [teamLeads, setTeamLeads] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planning',
    priority: 'medium',
    budget: '',
    team_lead_id: '',
  });

  useEffect(() => {
    fetchProjects();
    if (user?.role?.name === 'manager') {
      fetchTeamLeads();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      setProjects(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamLeads = async () => {
    try {
      const response = await axios.get('/api/users?role=team_lead');
      setTeamLeads(response.data.data);
    } catch (err) {
      console.error('Failed to fetch team leads:', err);
    }
  };

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        start_date: project.start_date?.split('T')[0] || '',
        end_date: project.end_date?.split('T')[0] || '',
        status: project.status,
        priority: project.priority,
        budget: project.budget || '',
        team_lead_id: project.team_lead_id || '',
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'planning',
        priority: 'medium',
        budget: '',
        team_lead_id: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
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
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject.id}`, formData);
      } else {
        await axios.post('/api/projects', formData);
      }
      fetchProjects();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${projectId}`);
        fetchProjects();
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'info';
      case 'active': return 'success';
      case 'on_hold': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const calculateProgress = (project) => {
    if (!project.tasks_count) return 0;
    return Math.round((project.completed_tasks_count / project.tasks_count) * 100);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Loading projects...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Projects
        </Typography>
        {user?.role?.name === 'manager' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            New Project
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} lg={4} key={project.id}>
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
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {project.name}
                  </Typography>
                  {user?.role?.name === 'manager' && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(project);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
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
                  {project.description}
                </Typography>

                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                  <Chip
                    label={project.priority}
                    color={getPriorityColor(project.priority)}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {calculateProgress(project)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(project)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Group fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {project.teams_count || 0} teams
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Assignment fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {project.tasks_count || 0} tasks
                    </Typography>
                  </Box>
                </Box>

                {project.team_lead && (
                  <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {project.team_lead.first_name[0]}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {project.team_lead.first_name} {project.team_lead.last_name}
                    </Typography>
                  </Box>
                )}

                {project.end_date && (
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Due: {new Date(project.end_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Project Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProject ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Team Lead"
                name="team_lead_id"
                value={formData.team_lead_id}
                onChange={handleInputChange}
              >
                <MenuItem value="">None</MenuItem>
                {teamLeads.map((lead) => (
                  <MenuItem key={lead.id} value={lead.id}>
                    {lead.first_name} {lead.last_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProject ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;
