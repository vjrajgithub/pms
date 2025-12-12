import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      task_assignments: true,
      project_updates: true,
      deadline_reminders: true,
      team_invitations: true
    },
    privacy: {
      profile_visibility: 'team',
      activity_visibility: 'team'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.settings) {
        setSettings({ ...settings, ...response.data.settings });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/settings', { settings }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Settings saved successfully');
      setMessageType('success');
    } catch (error) {
      setMessage('Error saving settings');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key) => (event) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: event.target.checked
      }
    });
  };

  const handlePrivacyChange = (key) => (event) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: event.target.value
      }
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <SettingsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  General Settings
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={settings.theme}
                      label="Theme"
                      onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={settings.language}
                      label="Language"
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.timezone}
                      label="Timezone"
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    >
                      <MenuItem value="UTC">UTC</MenuItem>
                      <MenuItem value="America/New_York">Eastern Time</MenuItem>
                      <MenuItem value="America/Chicago">Central Time</MenuItem>
                      <MenuItem value="America/Denver">Mountain Time</MenuItem>
                      <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                      <MenuItem value="Europe/London">London</MenuItem>
                      <MenuItem value="Europe/Paris">Paris</MenuItem>
                      <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                      <MenuItem value="Asia/Kolkata">India</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Notification Preferences
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Delivery Methods
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.email}
                    onChange={handleNotificationChange('email')}
                  />
                }
                label="Email notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.push}
                    onChange={handleNotificationChange('push')}
                  />
                }
                label="Push notifications"
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Notification Types
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.task_assignments}
                    onChange={handleNotificationChange('task_assignments')}
                  />
                }
                label="Task assignments"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.project_updates}
                    onChange={handleNotificationChange('project_updates')}
                  />
                }
                label="Project updates"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.deadline_reminders}
                    onChange={handleNotificationChange('deadline_reminders')}
                  />
                }
                label="Deadline reminders"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.team_invitations}
                    onChange={handleNotificationChange('team_invitations')}
                  />
                }
                label="Team invitations"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Privacy Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Profile Visibility</InputLabel>
                    <Select
                      value={settings.privacy.profile_visibility}
                      label="Profile Visibility"
                      onChange={handlePrivacyChange('profile_visibility')}
                    >
                      <MenuItem value="public">Public</MenuItem>
                      <MenuItem value="team">Team Only</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Activity Visibility</InputLabel>
                    <Select
                      value={settings.privacy.activity_visibility}
                      label="Activity Visibility"
                      onChange={handlePrivacyChange('activity_visibility')}
                    >
                      <MenuItem value="public">Public</MenuItem>
                      <MenuItem value="team">Team Only</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Role:</strong> {user?.role?.display_name || user?.role?.name}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Last login:</strong> {user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'N/A'}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Email verified:</strong> {user?.email_verified_at ? 'Yes' : 'No'}
              </Typography>
              
              <Typography variant="body2">
                <strong>Two-factor auth:</strong> {user?.two_factor_enabled ? 'Enabled' : 'Disabled'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          disabled={loading}
          size="large"
        >
          Save Settings
        </Button>
      </Box>

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

export default Settings;
