import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  Security,
  Save,
  Cancel,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);

  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    timezone: 'UTC',
    two_factor_enabled: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        timezone: user.timezone || 'UTC',
        two_factor_enabled: user.two_factor_enabled || false,
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.put('/api/profile', profileForm);
      updateProfile(response.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      await axios.post('/api/change-password', passwordForm);
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setChangePasswordDialog(false);
      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to change password' });
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setLoading(true);
      if (profileForm.two_factor_enabled) {
        await axios.post('/api/disable-2fa');
        setMessage({ type: 'success', text: '2FA disabled successfully' });
      } else {
        await axios.post('/api/enable-2fa');
        setMessage({ type: 'success', text: '2FA enabled successfully' });
      }
      setProfileForm({
        ...profileForm,
        two_factor_enabled: !profileForm.two_factor_enabled,
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update 2FA settings' });
      console.error('2FA toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const response = await axios.post('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateProfile(response.data.user);
      setMessage({ type: 'success', text: 'Avatar updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update avatar' });
      console.error('Avatar upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Profile Settings</Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Personal Information
                </Typography>
                {!editing ? (
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                ) : (
                  <Box>
                    <Button
                      startIcon={<Save />}
                      onClick={handleProfileUpdate}
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={loading}
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<Cancel />}
                      onClick={() => setEditing(false)}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileForm.first_name}
                    onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileForm.last_name}
                    onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Timezone"
                    value={profileForm.timezone}
                    onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={user.role?.display_name || ''}
                    disabled
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Avatar and Security */}
        <Grid item xs={12} md={4}>
          {/* Avatar */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Profile Picture</Typography>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src={user.avatar}
                  sx={{ width: 120, height: 120, mb: 2 }}
                >
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarUpload}
                />
                <label htmlFor="avatar-upload">
                  <IconButton color="primary" component="span" disabled={loading}>
                    <PhotoCamera />
                  </IconButton>
                </label>
                <Typography variant="caption" color="text.secondary">
                  Click to change avatar
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Security Settings</Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={profileForm.two_factor_enabled}
                    onChange={handleToggle2FA}
                    disabled={loading}
                  />
                }
                label="Two-Factor Authentication"
              />
              
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Add an extra layer of security to your account
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Button
                startIcon={<Security />}
                onClick={() => setChangePasswordDialog(true)}
                variant="outlined"
                fullWidth
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialog} onClose={() => setChangePasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={passwordForm.current_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={passwordForm.new_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={passwordForm.new_password_confirmation}
            onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" disabled={loading}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
