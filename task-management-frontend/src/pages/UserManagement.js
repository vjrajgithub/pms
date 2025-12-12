import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  FormHelperText,
  Chip,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
  Pagination,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  PersonAdd,
  Search,
  FilterList,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    switch (name) {
      case 'first_name':
      case 'last_name':
        return !value ? `${name.replace('_', ' ')} is required` : '';
      case 'email':
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Enter a valid email';
        return '';
      case 'password':
        if (dialogType === 'create') {
          if (!value) return 'Password is required';
          if (value.length < 8) return 'Password must be at least 8 characters';
        } else {
          if (value && value.length < 8) return 'Password must be at least 8 characters';
        }
        return '';
      case 'role_id':
        return !value ? 'Role is required' : '';
      case 'status':
        return !['active', 'inactive', 'suspended'].includes(value) ? 'Invalid status' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {};
    const toValidate = ['first_name', 'last_name', 'email', 'password', 'role_id', 'status'];
    toValidate.forEach((field) => {
      const message = validateField(field, formData[field]);
      if (message) errors[field] = [message];
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('create'); // 'create' or 'edit'
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    role_id: '',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: 10,
        search: searchTerm,
        role_id: roleFilter,
        status: statusFilter
      };
      
      const response = await axios.get('/api/users', { params });
      setUsers(response.data.data);
      setTotalPages(response.data.last_page);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles');
      // Handle both response formats: { data: [...] } or { success: true, data: [...] }
      let allRoles = response.data.data || response.data || [];
      
      // Ensure allRoles is an array
      if (!Array.isArray(allRoles)) {
        allRoles = [];
      }
      
      let availableRoles = allRoles;
      
      if (user?.role?.name === 'super_admin') {
        // Super Admin can see all roles
        // No filtering needed
      } else if (user?.role?.name === 'admin') {
        // Admin can see: Admin, Manager, Team Lead, Team Member (NOT Super Admin)
        availableRoles = allRoles.filter(role => 
          role.name !== 'super_admin'
        );
      } else if (user?.role?.name === 'manager') {
        // Manager can see: Team Lead, Team Member
        availableRoles = allRoles.filter(role => 
          ['team_lead', 'team_member'].includes(role.name)
        );
      } else if (user?.role?.name === 'team_lead') {
        // Team Lead can see: Team Member
        availableRoles = allRoles.filter(role => 
          role.name === 'team_member'
        );
      } else {
        // Team Member cannot create users
        availableRoles = [];
      }
      
      setRoles(availableRoles);
    } catch (err) {
      console.error('Roles fetch error:', err);
      // Set default roles if API fails
      setRoles([
        { id: 1, name: 'team_member', display_name: 'Team Member' },
        { id: 2, name: 'team_lead', display_name: 'Team Lead' }
      ]);
    }
  };

  const handleMenuOpen = (event, userData) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(userData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateUser = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      role_id: '',
      status: 'active'
    });
    setFieldErrors({});
    setDialogType('create');
    setOpenDialog(true);
  };

  const handleEditUser = () => {
    const resolvedRoleId = selectedUser.role_id || selectedUser?.role?.id || '';

    // Ensure the current user's role exists in the dropdown options
    if (resolvedRoleId && Array.isArray(roles)) {
      const hasRole = roles.some(r => String(r.id) === String(resolvedRoleId));
      if (!hasRole && selectedUser?.role) {
        setRoles([selectedUser.role, ...roles]);
      }
    }

    setFormData({
      first_name: selectedUser.first_name,
      last_name: selectedUser.last_name,
      email: selectedUser.email,
      password: '',
      phone: selectedUser.phone || '',
      role_id: resolvedRoleId,
      status: selectedUser.status
    });
    setFieldErrors({});
    setDialogType('edit');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.patch(`/api/users/${userId}/status`, { status: newStatus });
      fetchUsers();
      handleMenuClose();
    } catch (err) {
      setError('Failed to update user status');
      console.error('Status update error:', err);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      role_id: '',
      status: 'active'
    });
    setFieldErrors({});
  };

  const handleFormSubmit = async () => {
    // Frontend validation first
    if (!validateForm()) {
      setError('Please fix the highlighted errors');
      return;
    }
    try {
      const submitData = { ...formData };
      // Normalize payload
      if (submitData.role_id !== undefined && submitData.role_id !== null && submitData.role_id !== '') {
        submitData.role_id = Number(submitData.role_id);
      }
      if (dialogType === 'edit' && !submitData.password) {
        delete submitData.password; // Don't update password if not provided
      }

      if (dialogType === 'create') {
        await axios.post('/api/users', submitData);
      } else {
        const resp = await axios.put(`/api/users/${selectedUser.id}`, submitData);
        // Optimistically update local list to reflect changes immediately
        const updatedUser = resp?.data?.user;
        if (updatedUser) {
          setUsers(prev => prev.map(u => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)));
        }
      }

      // Refresh list to ensure server truth (keeps pagination correct)
      fetchUsers();
      handleDialogClose();
      setError(null);
      setFieldErrors({});
    } catch (err) {
      const apiError = err.response?.data;
      // Map backend validation errors to field errors
      if (apiError?.errors && typeof apiError.errors === 'object') {
        setFieldErrors(apiError.errors);
      }
      const message = apiError?.message || apiError?.error || (apiError?.errors ? 'Validation failed' : 'Failed to save user');
      setError(message);
      console.error('Form submit error:', err);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/users/${selectedUser.id}`);
      fetchUsers();
      setDeleteConfirmOpen(false);
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      console.error('Delete error:', err);
    }
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'super_admin': return 'error';
      case 'manager': return 'warning';
      case 'team_lead': return 'info';
      case 'team_member': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const canManageUser = (targetUser) => {
    if (user.role.name === 'super_admin') {
      // Super Admin can manage any user
      return true;
    }
    if (user.role.name === 'admin') {
      // Admin can manage: Admin, Manager, Team Lead, Team Member (NOT Super Admin)
      return ['admin', 'manager', 'team_lead', 'team_member'].includes(targetUser.role.name);
    }
    if (user.role.name === 'manager') {
      // Manager can manage: Team Lead, Team Member
      return ['team_lead', 'team_member'].includes(targetUser.role.name);
    }
    if (user.role.name === 'team_lead') {
      // Team Lead can manage: Team Member
      return targetUser.role.name === 'team_member';
    }
    // Team Member cannot manage any users
    return false;
  };

  const canCreateUsers = () => {
    return ['super_admin', 'admin', 'manager', 'team_lead'].includes(user.role.name);
  };

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          User Management
        </Typography>
        {canCreateUsers() && (
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleCreateUser}
          >
            Add User
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Role"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {Array.isArray(roles) && roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('');
                  setStatusFilter('');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((userData) => (
                <TableRow key={userData.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={userData.avatar}
                        sx={{
                          bgcolor: getRoleColor(userData.role.name),
                          mr: 2,
                          width: 40,
                          height: 40
                        }}
                      >
                        {!userData.avatar && `${userData.first_name[0]}${userData.last_name[0]}`}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {userData.first_name} {userData.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {userData.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{userData.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={userData.role.display_name}
                      color={getRoleColor(userData.role.name)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={userData.status}
                      color={getStatusColor(userData.status)}
                      size="small"
                      icon={userData.status === 'active' ? <CheckCircle /> : <Block />}
                    />
                  </TableCell>
                  <TableCell>{userData.phone || 'N/A'}</TableCell>
                  <TableCell align="right">
                    {canManageUser(userData) && (
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, userData)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" p={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditUser}>
          <Edit sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusToggle(selectedUser?.id, selectedUser?.status)}
        >
          {selectedUser?.status === 'active' ? <Block sx={{ mr: 1 }} /> : <CheckCircle sx={{ mr: 1 }} />}
          {selectedUser?.status === 'active' ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* User Form Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'create' ? 'Create New User' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                error={Boolean(fieldErrors.first_name)}
                helperText={fieldErrors.first_name?.[0]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
                error={Boolean(fieldErrors.last_name)}
                helperText={fieldErrors.last_name?.[0]}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email?.[0]}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={dialogType === 'create' ? 'Password' : 'New Password (leave blank to keep current)'}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={dialogType === 'create'}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password?.[0]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={Boolean(fieldErrors.phone)}
                helperText={fieldErrors.phone?.[0]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={Boolean(fieldErrors.role_id)}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  label="Role"
                >
                  {Array.isArray(roles) && roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.display_name}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(fieldErrors.role_id) && (
                  <FormHelperText>{fieldErrors.role_id?.[0]}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(fieldErrors.status)}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
                {Boolean(fieldErrors.status) && (
                  <FormHelperText>{fieldErrors.status?.[0]}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {dialogType === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.first_name} {selectedUser?.last_name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
