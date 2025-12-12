/**
 * Reusable Task Form Dialog Component
 * Used in both Tasks list view and Kanban board
 * Single column layout with rich text editor
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TaskFormDialog = ({
  open,
  onClose,
  onSubmit,
  editingTask,
  formData,
  onFormChange,
  projects = [],
  teamMembers = [],
  loading = false,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    onFormChange({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    onFormChange({ ...formData, description: value });
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Task Title */}
          <TextField
            fullWidth
            placeholder="Task Title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '1rem',
              },
            }}
          />

          {/* Description with Rich Text Editor */}
          <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
            <ReactQuill
              theme="snow"
              value={formData.description || ''}
              onChange={handleDescriptionChange}
              modules={quillModules}
              formats={quillFormats}
              style={{ height: '120px' }}
            />
          </Box>

          {/* Priority */}
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ backgroundColor: 'white', px: 0.5 }}>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority || 'medium'}
              onChange={(e) => handleSelectChange('priority', e.target.value)}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>

          {/* Status */}
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ backgroundColor: 'white', px: 0.5 }}>Status</InputLabel>
            <Select
              name="status"
              value={formData.status || 'pending'}
              onChange={(e) => handleSelectChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          {/* Project */}
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ backgroundColor: 'white', px: 0.5 }}>Project</InputLabel>
            <Select
              name="project_id"
              value={formData.project_id || ''}
              onChange={(e) => handleSelectChange('project_id', e.target.value)}
              label="Project"
            >
              <MenuItem value="">Select Project</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Assign To */}
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ backgroundColor: 'white', px: 0.5 }}>Assign To</InputLabel>
            <Select
              name="assigned_to"
              value={formData.assigned_to || ''}
              onChange={(e) => handleSelectChange('assigned_to', e.target.value)}
              label="Assign To"
            >
              <MenuItem value="">Unassigned</MenuItem>
              {teamMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.first_name} {member.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Deadline */}
          <TextField
            fullWidth
            label="Deadline"
            name="deadline"
            type="date"
            value={formData.deadline || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true, sx: { backgroundColor: 'white', px: 0.5 } }}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#2196F3', borderColor: '#2196F3' }}>
          CANCEL
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading} sx={{ backgroundColor: '#2196F3' }}>
          {editingTask ? 'UPDATE' : 'CREATE'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormDialog;
