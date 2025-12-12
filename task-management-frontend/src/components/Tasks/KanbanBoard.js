import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Person,
  CalendarToday,
  Flag,
  Add,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import TaskFormDialog from './TaskFormDialog';

const KanbanBoard = ({ projectId }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState({
    pending: [],
    in_progress: [],
    review: [],
    completed: []
  });
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('create'); // 'create' or 'edit'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    deadline: '',
    project_id: '',
    assigned_to: '',
    estimated_hours: '',
    progress: 0,
    actual_hours: '',
    tags: ''
  });

  useEffect(() => {
    fetchKanbanData();
    fetchProjects();
    fetchTeamMembers();
  }, [projectId]);

  const fetchKanbanData = async () => {
    try {
      setLoading(true);
      const params = projectId ? { project_id: projectId } : {};
      const response = await axios.get('/api/tasks/kanban/board', { params });
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load kanban board');
      console.error('Kanban error:', err);
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    // Update local state immediately for better UX
    const newTasks = { ...tasks };
    const [movedTask] = newTasks[source.droppableId].splice(source.index, 1);
    newTasks[destination.droppableId].splice(destination.index, 0, {
      ...movedTask,
      status: destination.droppableId
    });
    setTasks(newTasks);

    // Update backend
    try {
      await axios.patch(`/api/tasks/${draggableId}/move`, {
        status: destination.droppableId,
        position: destination.index
      });
    } catch (err) {
      console.error('Move task error:', err);
      // Revert on error
      fetchKanbanData();
    }
  };

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleEditTask = () => {
    if (!selectedTask) {
      console.error('No task selected for editing');
      return;
    }

    setFormData({
      title: selectedTask.title,
      description: selectedTask.description || '',
      priority: selectedTask.priority,
      status: selectedTask.status,
      deadline: selectedTask.deadline ? selectedTask.deadline.split('T')[0] : '',
      project_id: selectedTask.project_id || '',
      assigned_to: selectedTask.assigned_to || '',
      estimated_hours: selectedTask.estimated_hours || '',
      progress: selectedTask.progress || 0,
      actual_hours: selectedTask.actual_hours || '',
      tags: selectedTask.tags ? selectedTask.tags.join(', ') : ''
    });
    setDialogType('edit');
    setOpenDialog(true);
    // Don't close menu yet - keep selectedTask for form submission
    setAnchorEl(null);
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`/api/tasks/${selectedTask.id}`);
      fetchKanbanData();
      handleMenuClose();
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const handleCreateTask = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      deadline: '',
      assigned_to: '',
      estimated_hours: ''
    });
    setDialogType('create');
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleFormSubmit = async () => {
    try {
      // Validate that selectedTask exists for edit operations
      if (dialogType === 'edit' && !selectedTask) {
        console.error('No task selected for editing');
        return;
      }

      const taskData = {
        ...formData,
        project_id: projectId,
        deadline: formData.deadline || null,
        estimated_hours: formData.estimated_hours ? parseInt(formData.estimated_hours) : null
      };

      if (dialogType === 'create') {
        await axios.post('/api/tasks', taskData);
      } else if (dialogType === 'edit' && selectedTask) {
        await axios.put(`/api/tasks/${selectedTask.id}`, taskData);
      }

      fetchKanbanData();
      handleDialogClose();
    } catch (err) {
      console.error('Task form error:', err);
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
      case 'pending': return '#f44336';
      case 'in_progress': return '#ff9800';
      case 'review': return '#2196f3';
      case 'completed': return '#4caf50';
      default: return '#9e9e9e';
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

  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => { if (!snapshot.isDragging) window.location.assign(`/tasks/${task.id}`); }}
          sx={{
            mb: 2,
            cursor: 'grab',
            transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
            boxShadow: snapshot.isDragging ? 4 : 1,
            '&:hover': { boxShadow: 2 }
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ flex: 1, mr: 1 }}>
                {task.title}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, task); }}
                sx={{ ml: 1 }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>

            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {stripHtml(task.description).length > 100
                  ? `${stripHtml(task.description).substring(0, 100)}...`
                  : stripHtml(task.description)}
              </Typography>
            )}

            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip
                label={task.priority}
                size="small"
                color={getPriorityColor(task.priority)}
                icon={<Flag />}
              />
              {task.deadline && (
                <Chip
                  label={new Date(task.deadline).toLocaleDateString()}
                  size="small"
                  variant="outlined"
                  icon={<CalendarToday />}
                />
              )}
            </Box>

            {task.assigned_user && (
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar 
                  src={task.assigned_user.avatar}
                  sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                >
                  {!task.assigned_user.avatar && task.assigned_user.first_name[0]}
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  {task.assigned_user.first_name} {task.assigned_user.last_name}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  const Column = ({ title, status, tasks: columnTasks }) => (
    <Card sx={{ minHeight: 500, bgcolor: 'grey.50' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: getStatusColor(status)
              }}
            />
            <Typography variant="h6" fontWeight="600">
              {title}
            </Typography>
            <Chip label={columnTasks.length} size="small" />
          </Box>
          {status === 'pending' && (
            <IconButton size="small" onClick={handleCreateTask}>
              <Add />
            </IconButton>
          )}
        </Box>

        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minHeight: 400,
                bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                borderRadius: 1,
                p: 1
              }}
            >
              {columnTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box className="fade-in">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Kanban Board
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Column title="To Do" status="pending" tasks={tasks.pending} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Column title="In Progress" status="in_progress" tasks={tasks.in_progress} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Column title="Review" status="review" tasks={tasks.review} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Column title="Done" status="completed" tasks={tasks.completed} />
          </Grid>
        </Grid>
      </DragDropContext>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditTask}>
          <Edit sx={{ mr: 1 }} />
          Edit Task
        </MenuItem>
        <MenuItem onClick={handleDeleteTask} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete Task
        </MenuItem>
      </Menu>

      {/* Task Dialog */}
      <TaskFormDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
        editingTask={dialogType === 'edit' ? selectedTask : null}
        formData={formData}
        onFormChange={setFormData}
        projects={projects}
        teamMembers={teamMembers}
        loading={loading}
      />
    </Box>
  );
};

export default KanbanBoard;
