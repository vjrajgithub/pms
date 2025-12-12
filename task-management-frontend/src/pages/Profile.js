import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile, updateProfileAPI } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    timezone: 'UTC',
    preferences: {}
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        timezone: user.timezone || 'UTC',
        preferences: user.preferences || {}
      });
      setTwoFactorEnabled(user.two_factor_enabled || false);
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      // Prepare data - only send fields that are not empty
      const updateData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone: profileData.phone,
        timezone: profileData.timezone || 'UTC',
        preferences: profileData.preferences || {}
      };

      await updateProfileAPI(updateData);
      setMessage('Profile updated successfully');
      setMessageType('success');
    } catch (error) {
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.message || 'Error updating profile';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('New passwords do not match');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setMessage('Password changed successfully');
      setMessageType('success');
    } catch (error) {
      setMessage('Error changing password');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = twoFactorEnabled ? '/api/auth/disable-2fa' : '/api/auth/enable-2fa';
      
      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTwoFactorEnabled(!twoFactorEnabled);
      setMessage(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully`);
      setMessageType('success');
    } catch (error) {
      setMessage('Error updating two-factor authentication');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setMessage('Please select a valid image file (JPEG, PNG, JPG, or GIF)');
        setMessageType('error');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        setMessageType('error');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setMessage('Please select an image first');
      setMessageType('error');
      return;
    }

    setUploadingAvatar(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await axios.post('/api/profile/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update the user in context with the new avatar
      if (response.data.user) {
        const updatedUser = response.data.user;
        updateProfile(updatedUser);
        setAvatarPreview(updatedUser.avatar);
      }

      setAvatarFile(null);
      setMessage('Profile picture updated successfully');
      setMessageType('success');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error uploading profile picture');
      setMessageType('error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Personal Information
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  />
                </Grid>
              </Grid>
              
              <Box mt={3}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleProfileUpdate}
                  disabled={loading}
                >
                  Update Profile
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Security Settings
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Change Password
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  />
                </Grid>
              </Grid>
              
              <Box mt={2}>
                <Button
                  variant="outlined"
                  onClick={handlePasswordChange}
                  disabled={loading}
                >
                  Change Password
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" gutterBottom>
                Two-Factor Authentication
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={handleTwoFactorToggle}
                    disabled={loading}
                  />
                }
                label="Enable two-factor authentication via email"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={avatarPreview}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mx: 'auto', 
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem'
                  }}
                >
                  {!avatarPreview && `${user?.first_name?.[0]}${user?.last_name?.[0]}`}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-input"
                  type="file"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                />
                <label htmlFor="avatar-input">
                  <Button
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      borderRadius: '50%',
                      minWidth: 'auto',
                      width: 36,
                      height: 36,
                      padding: 0,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark'
                      }
                    }}
                    disabled={uploadingAvatar}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 20 }} />
                  </Button>
                </label>
              </Box>

              {avatarFile && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    sx={{ mr: 1 }}
                  >
                    {uploadingAvatar ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Uploading...
                      </>
                    ) : (
                      'Upload Picture'
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(user?.avatar || null);
                    }}
                    disabled={uploadingAvatar}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
              
              <Typography variant="h6" gutterBottom>
                {user?.first_name} {user?.last_name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              
              <Typography variant="body2" color="primary" gutterBottom>
                {user?.role?.display_name || user?.role?.name}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box textAlign="left">
                <Typography variant="body2" gutterBottom>
                  <strong>Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Last login:</strong> {user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>2FA Status:</strong> {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      >
        <Alert
          onClose={() => setMessage('')}
          severity={messageType}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
