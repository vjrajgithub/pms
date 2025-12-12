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
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewKanban as KanbanIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import KanbanBoard from '../components/Tasks/KanbanBoard';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignUsers, setAssignUsers] = useState([]);
  const [assignSelectedUser, setAssignSelectedUser] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    project_id: '',
    deadline: '',
    assigned_to: ''
  });
  const [assignableUsers, setAssignableUsers] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      project_id: '',
      deadline: '',
      assigned_to: ''
    });
    setOpenDialog(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      project_id: task.project_id || '',
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      assigned_to: task.assigned_to || ''
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const openAssignDialog = async (task) => {
    try {
      setSelectedTask(task);
      setAssignSelectedUser(task.assigned_to || '');
      // Load assignable users for the task's project
      if (!task.project_id) { setAssignUsers([]); }
      else {
        const token = localStorage.getItem('token');
        const teamsResp = await axios.get('/api/teams', {
          params: { project_id: task.project_id, per_page: 100 },
          headers: { Authorization: `Bearer ${token}` }
        });
        const teams = teamsResp.data?.data || [];
        const members = [];
        teams.forEach(team => {
          if (Array.isArray(team.members)) team.members.forEach(u => members.push(u));
          if (team.team_lead) members.push(team.team_lead);
        });
        const uniq = Object.values(members.reduce((acc, u) => { if (u?.id) acc[u.id] = u; return acc; }, {}));
        setAssignUsers(uniq);
      }
      setAssignDialogOpen(true);
    } catch (e) {
      setAssignUsers([]);
      setAssignDialogOpen(true);
    }
    setAnchorEl(null);
  };

  const handleAssignSubmit = async () => {
    if (!selectedTask) return;
    try {
      const token = localStorage.getItem('token');
      const payload = assignSelectedUser ? { assigned_to: Number(assignSelectedUser) } : { assigned_to: null };
      await axios.put(`/api/tasks/${selectedTask.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignDialogOpen(false);
      setAssignSelectedUser('');
      fetchTasks();
    } catch (e) {
      console.error('Error assigning task:', e);
    }
  };

  useEffect(() => {
    const loadAssignable = async () => {
      if (!formData.project_id) { setAssignableUsers([]); return; }
      try {
        const token = localStorage.getItem('token');
        // Strategy: fetch teams for this project, collect members, plus team lead
        const teamsResp = await axios.get('/api/teams', {
          params: { project_id: formData.project_id, per_page: 100 },
          headers: { Authorization: `Bearer ${token}` }
        });
        const teams = teamsResp.data?.data || [];
        const members = [];
        teams.forEach(team => {
          if (Array.isArray(team.members)) {
            team.members.forEach(u => members.push(u));
          }
          if (team.team_lead) members.push(team.team_lead);
        });
        // Deduplicate by id
        const uniq = Object.values(members.reduce((acc, u) => { if (u?.id) acc[u.id] = u; return acc; }, {}));
        setAssignableUsers(uniq);
      } catch (e) {
        setAssignableUsers([]);
      }
    };
    loadAssignable();
  }, [formData.project_id]);

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
      const method = editingTask ? 'put' : 'post';
      const payload = { ...formData };
      if (payload.assigned_to === '') delete payload.assigned_to;
      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOpenDialog(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link'
  ];

  const stripHtml = (html) => html ? html.replace(/<[^>]*>/g, '') : '';

  if (loading) {
    return <Box p={3}>Loading...</Box>;
  }

  if (viewMode === 'kanban') {
    return <KanbanBoard />;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Box>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('list')}
            sx={{ mr: 1 }}
          >
            List View
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('kanban')}
            startIcon={<KanbanIcon />}
          >
            Kanban Board
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => window.location.assign(`/tasks/${task.id}`)}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" component="h3" gutterBottom>
                    {task.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setAnchorEl(e.currentTarget);
                      setSelectedTask(task);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stripHtml(task.description)}
                </Typography>
                
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </Box>
                
                {task.deadline && (
                  <Typography variant="body2" color="text.secondary">
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </Typography>
                )}
                
                {task.project && (
                  <Typography variant="body2" color="primary">
                    Project: {task.project.name}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreateTask}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => openAssignDialog(selectedTask)}>
          Assign
        </MenuItem>
        <MenuItem onClick={() => handleEditTask(selectedTask)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteTask(selectedTask?.id)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              modules={quillModules}
              formats={quillFormats}
            />
          </Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Project</InputLabel>
            <Select
              value={formData.project_id}
              label="Project"
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }} disabled={!formData.project_id}>
            <InputLabel>Assign To</InputLabel>
            <Select
              value={formData.assigned_to}
              label="Assign To"
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {assignableUsers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.first_name} {u.last_name} ({u.role?.display_name || u.role?.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Deadline"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTask ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Task</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Assign To</InputLabel>
            <Select
              value={assignSelectedUser}
              label="Assign To"
              onChange={(e) => setAssignSelectedUser(e.target.value)}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {assignUsers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.first_name} {u.last_name} ({u.role?.display_name || u.role?.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
