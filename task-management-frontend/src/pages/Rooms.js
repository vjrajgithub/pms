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
  MeetingRoom as RoomIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Rooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team_id: '',
    type: 'meeting',
    capacity: 10,
    status: 'active'
  });

  useEffect(() => {
    fetchRooms();
    fetchTeams();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/teams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleCreateRoom = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      description: '',
      team_id: '',
      type: 'meeting',
      capacity: 10,
      status: 'active'
    });
    setOpenDialog(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || '',
      description: room.description || '',
      team_id: room.team_id || '',
      type: room.type || 'meeting',
      capacity: room.capacity || 10,
      status: room.status || 'active'
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingRoom ? `/api/rooms/${editingRoom.id}` : '/api/rooms';
      const method = editingRoom ? 'put' : 'post';
      
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOpenDialog(false);
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'primary';
      case 'conference': return 'secondary';
      case 'workspace': return 'info';
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
          Rooms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateRoom}
        >
          Create Room
        </Button>
      </Box>

      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" component="h3" gutterBottom>
                    {room.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedRoom(room);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {room.description}
                </Typography>
                
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={room.type}
                    color={getTypeColor(room.type)}
                    size="small"
                  />
                  <Chip
                    label={room.status}
                    color={getStatusColor(room.status)}
                    size="small"
                  />
                </Box>
                
                {room.team && (
                  <Typography variant="body2" color="primary" gutterBottom>
                    Team: {room.team.name}
                  </Typography>
                )}
                
                <Box display="flex" alignItems="center" mt={2}>
                  <RoomIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    Capacity: {room.capacity} people
                  </Typography>
                </Box>
                
                {room.created_by && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Created by: {room.created_by.first_name} {room.created_by.last_name}
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
        onClick={handleCreateRoom}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEditRoom(selectedRoom)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteRoom(selectedRoom?.id)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRoom ? 'Edit Room' : 'Create New Room'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
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
            <InputLabel>Team</InputLabel>
            <Select
              value={formData.team_id}
              label="Team"
              onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="meeting">Meeting Room</MenuItem>
              <MenuItem value="conference">Conference Room</MenuItem>
              <MenuItem value="workspace">Workspace</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Capacity"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
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
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRoom ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rooms;
