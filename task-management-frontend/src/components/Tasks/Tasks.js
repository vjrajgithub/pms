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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Assignment,
  Person,
  CalendarToday,
  Flag,
  ViewKanban,
  ViewList,
  FilterList,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import KanbanBoard from './KanbanBoard';
import TaskFormDialog from './TaskFormDialog';

const Tasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState(0); // 0: List, 1: Kanban
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project_id: '',
    assigned_to: '',
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    deadline: '',
    project_id: '',
    assigned_to: '',
    estimated_hours: '',
    tags: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchTeamMembers();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const response = await axios.get('/api/tasks', { params });
      setTasks(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Tasks error:', err);
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
      const response = await axios.get('/api/users');
      setTeamMembers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    }
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        project_id: task.project_id,
        assigned_to: task.assigned_to || '',
        estimated_hours: task.estimated_hours || '',
        tags: task.tags ? task.tags.join(', ') : '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        deadline: '',
        project_id: '',
        assigned_to: '',
        estimated_hours: '',
        tags: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const taskData = {
        ...formData,
        deadline: formData.deadline || null,
        estimated_hours: formData.estimated_hours ? parseInt(formData.estimated_hours) : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      };

      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask.id}`, taskData);
      } else {
        await axios.post('/api/tasks', taskData);
      }
      fetchTasks();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        fetchTasks();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'review': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const canEditTask = (task) => {
    return user?.role?.name === 'manager' || 
           user?.role?.name === 'team_lead' || 
           task.assigned_to === user?.id;
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      project_id: '',
      assigned_to: '',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Loading tasks...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Tasks
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ViewKanban />}
            onClick={() => navigate('/kanban')}
          >
            Kanban View
          </Button>
          {(user?.role?.name === 'manager' || user?.role?.name === 'team_lead') && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              New Task
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  label="Priority"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Project</InputLabel>
                <Select
                  name="project_id"
                  value={filters.project_id}
                  onChange={handleFilterChange}
                  label="Project"
                >
                  <MenuItem value="">All</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
                size="small"
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {task.description.length > 50 
                          ? `${task.description.substring(0, 50)}...` 
                          : task.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                    icon={<Flag />}
                  />
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={task.status}
                      onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                      disabled={!canEditTask(task)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="review">Review</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  {task.assigned_user ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar 
                        src={task.assigned_user.avatar}
                        sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                      >
                        {!task.assigned_user.avatar && task.assigned_user.first_name[0]}
                      </Avatar>
                      <Typography variant="body2">
                        {task.assigned_user.first_name} {task.assigned_user.last_name}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Unassigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {task.project?.name || 'No Project'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {task.deadline ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">
                        {new Date(task.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No deadline
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ width: 100 }}>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress || 0}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {task.progress || 0}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    {canEditTask(task) && (
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(task)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                    {(user?.role?.name === 'manager' || user?.role?.name === 'team_lead') && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(task.id)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Task Dialog */}
      <TaskFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editingTask={editingTask}
        formData={formData}
        onFormChange={setFormData}
        projects={projects}
        teamMembers={teamMembers}
        loading={loading}
      />
    </Box>
  );
};

export default Tasks;
