/**
 * RBAC Management Page - Super Admin Only
 * Manage roles, permissions, and user assignments
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Security,
  Lock,
} from '@mui/icons-material';
import useRBACManagement from '../hooks/useRBACManagement';
import { useRBAC } from '../hooks/useRBAC';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rbac-tabpanel-${index}`}
      aria-labelledby={`rbac-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function RBACManagement() {
  const { isSuperAdmin } = useRBAC();
  const {
    loading,
    error,
    roles,
    permissions,
    statistics,
    fetchRoles,
    fetchPermissions,
    fetchStatistics,
    createRole,
    updateRole,
    deleteRole,
    assignPermissionsToRole,
    getRolePermissions,
  } = useRBACManagement();

  const [tabValue, setTabValue] = useState(0);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [openPermissionAssignDialog, setOpenPermissionAssignDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleFormData, setRoleFormData] = useState({ name: '', display_name: '', description: '' });
  const [permissionFormData, setPermissionFormData] = useState({ name: '', display_name: '', description: '' });
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);

  useEffect(() => {
    if (!isSuperAdmin()) {
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchRoles(),
        fetchPermissions(),
        fetchStatistics(),
      ]);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Role Management
  const handleOpenRoleDialog = (role = null) => {
    if (role) {
      setRoleFormData(role);
      setSelectedRole(role);
    } else {
      setRoleFormData({ name: '', display_name: '', description: '' });
      setSelectedRole(null);
    }
    setOpenRoleDialog(true);
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
    setRoleFormData({ name: '', display_name: '', description: '' });
    setSelectedRole(null);
  };

  const handleSaveRole = async () => {
    try {
      if (selectedRole) {
        await updateRole(selectedRole.id, roleFormData);
      } else {
        await createRole(roleFormData);
      }
      handleCloseRoleDialog();
      await fetchRoles();
    } catch (err) {
      console.error('Failed to save role:', err);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId);
        await fetchRoles();
      } catch (err) {
        console.error('Failed to delete role:', err);
      }
    }
  };

  // Permission Assignment
  const handleOpenPermissionAssignDialog = async (role) => {
    try {
      setSelectedRole(role);
      const data = await getRolePermissions(role.id);
      setRolePermissions(data.permissions || []);
      setSelectedPermissions(data.permissionIds || []);
      setOpenPermissionAssignDialog(true);
    } catch (err) {
      console.error('Failed to load role permissions:', err);
    }
  };

  const handleClosePermissionAssignDialog = () => {
    setOpenPermissionAssignDialog(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
    setRolePermissions([]);
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissionAssignment = async () => {
    try {
      await assignPermissionsToRole(selectedRole.id, selectedPermissions);
      handleClosePermissionAssignDialog();
      await fetchRoles();
    } catch (err) {
      console.error('Failed to assign permissions:', err);
    }
  };

  if (!isSuperAdmin()) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" icon={<Security />}>
          Only Super Admins can access RBAC Management
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Lock sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            RBAC Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage roles, permissions, and user access control
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Roles
                </Typography>
                <Typography variant="h5">
                  {statistics.total_roles}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Permissions
                </Typography>
                <Typography variant="h5">
                  {statistics.total_permissions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Roles
                </Typography>
                <Typography variant="h5">
                  {statistics.roles_with_users}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Categories
                </Typography>
                <Typography variant="h5">
                  {Object.keys(statistics.permissions_by_category || {}).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="RBAC management tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Roles" id="rbac-tab-0" aria-controls="rbac-tabpanel-0" />
          <Tab label="Permissions" id="rbac-tab-1" aria-controls="rbac-tabpanel-1" />
          <Tab label="Permission Matrix" id="rbac-tab-2" aria-controls="rbac-tabpanel-2" />
        </Tabs>

        {/* Roles Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenRoleDialog()}
            >
              Create Role
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Display Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.map(role => (
                    <TableRow key={role.id} hover>
                      <TableCell>
                        <Chip label={role.name} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>{role.display_name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Security />}
                          onClick={() => handleOpenPermissionAssignDialog(role)}
                          sx={{ mr: 1 }}
                        >
                          Permissions
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleOpenRoleDialog(role)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Permissions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="textSecondary">
              Total Permissions: {permissions.length}
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Display Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissions.map(permission => (
                    <TableRow key={permission.id} hover>
                      <TableCell>
                        <Chip label={permission.name} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>{permission.display_name}</TableCell>
                      <TableCell>{permission.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Permission Matrix Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Permission assignment matrix for all roles
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Typography variant="caption" color="textSecondary">
                Matrix view coming soon - Use Permissions tab to manage role permissions
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Role Dialog */}
      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRole ? 'Edit Role' : 'Create New Role'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Role Name"
            value={roleFormData.name}
            onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
            margin="normal"
            disabled={!!selectedRole}
          />
          <TextField
            fullWidth
            label="Display Name"
            value={roleFormData.display_name}
            onChange={(e) => setRoleFormData({ ...roleFormData, display_name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={roleFormData.description}
            onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained">
            {selectedRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permission Assignment Dialog */}
      <Dialog
        open={openPermissionAssignDialog}
        onClose={handleClosePermissionAssignDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Assign Permissions to {selectedRole?.display_name}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {permissions.map(permission => (
              <FormControlLabel
                key={permission.id}
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">{permission.display_name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {permission.name}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermissionAssignDialog}>Cancel</Button>
          <Button onClick={handleSavePermissionAssignment} variant="contained">
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
