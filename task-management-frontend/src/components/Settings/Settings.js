import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Notifications,
  DarkMode,
  Language,
  Security,
  Storage,
  Add,
  Delete,
  Edit,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      task_updates: true,
      deadline_reminders: true,
      team_mentions: true,
    },
    privacy: {
      profile_visibility: 'team',
      activity_visibility: 'team',
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiKeyDialog, setApiKeyDialog] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [newApiKey, setNewApiKey] = useState({ name: '', permissions: [] });

  useEffect(() => {
    fetchSettings();
    fetchApiKeys();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data);
    } catch (err) {
      console.error('Fetch settings error:', err);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get('/api/settings/api-keys');
      setApiKeys(response.data);
    } catch (err) {
      console.error('Fetch API keys error:', err);
    }
  };

  const handleSettingsUpdate = async (section, key, value) => {
    try {
      setLoading(true);
      const updatedSettings = {
        ...settings,
        [section]: {
          ...settings[section],
          [key]: value,
        },
      };
      setSettings(updatedSettings);
      
      await axios.put('/api/settings', updatedSettings);
      setMessage({ type: 'success', text: 'Settings updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update settings' });
      console.error('Settings update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    try {
      const response = await axios.post('/api/settings/api-keys', newApiKey);
      setApiKeys([...apiKeys, response.data]);
      setApiKeyDialog(false);
      setNewApiKey({ name: '', permissions: [] });
      setMessage({ type: 'success', text: 'API key created successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create API key' });
      console.error('Create API key error:', err);
    }
  };

  const handleDeleteApiKey = async (keyId) => {
    try {
      await axios.delete(`/api/settings/api-keys/${keyId}`);
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      setMessage({ type: 'success', text: 'API key deleted successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete API key' });
      console.error('Delete API key error:', err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Settings</Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Appearance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DarkMode sx={{ mr: 1 }} />
                <Typography variant="h6">Appearance</Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.theme}
                  onChange={(e) => handleSettingsUpdate('theme', '', e.target.value)}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.language}
                  onChange={(e) => handleSettingsUpdate('language', '', e.target.value)}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications?.email || false}
                    onChange={(e) => handleSettingsUpdate('notifications', 'email', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications?.push || false}
                    onChange={(e) => handleSettingsUpdate('notifications', 'push', e.target.checked)}
                  />
                }
                label="Push Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications?.task_updates || false}
                    onChange={(e) => handleSettingsUpdate('notifications', 'task_updates', e.target.checked)}
                  />
                }
                label="Task Updates"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications?.deadline_reminders || false}
                    onChange={(e) => handleSettingsUpdate('notifications', 'deadline_reminders', e.target.checked)}
                  />
                }
                label="Deadline Reminders"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications?.team_mentions || false}
                    onChange={(e) => handleSettingsUpdate('notifications', 'team_mentions', e.target.checked)}
                  />
                }
                label="Team Mentions"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Security sx={{ mr: 1 }} />
                <Typography variant="h6">Privacy</Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Profile Visibility</InputLabel>
                <Select
                  value={settings.privacy?.profile_visibility || 'team'}
                  onChange={(e) => handleSettingsUpdate('privacy', 'profile_visibility', e.target.value)}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="team">Team Only</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Activity Visibility</InputLabel>
                <Select
                  value={settings.privacy?.activity_visibility || 'team'}
                  onChange={(e) => handleSettingsUpdate('privacy', 'activity_visibility', e.target.value)}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="team">Team Only</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* API Keys */}
        {user?.isManager() && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Storage sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>API Keys</Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={() => setApiKeyDialog(true)}
                    variant="outlined"
                    size="small"
                  >
                    Create Key
                  </Button>
                </Box>
                
                <List>
                  {apiKeys.map((key) => (
                    <ListItem key={key.id} divider>
                      <ListItemText
                        primary={key.name}
                        secondary={`Created: ${new Date(key.created_at).toLocaleDateString()}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteApiKey(key.id)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Data & Storage */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Storage sx={{ mr: 1 }} />
                <Typography variant="h6">Data & Storage</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" fullWidth>
                    Export Data
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" fullWidth>
                    Clear Cache
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" color="error" fullWidth>
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create API Key Dialog */}
      <Dialog open={apiKeyDialog} onClose={() => setApiKeyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create API Key</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Key Name"
            value={newApiKey.name}
            onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
            margin="normal"
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Permissions
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={newApiKey.permissions.includes('read')}
                onChange={(e) => {
                  const permissions = e.target.checked
                    ? [...newApiKey.permissions, 'read']
                    : newApiKey.permissions.filter(p => p !== 'read');
                  setNewApiKey({ ...newApiKey, permissions });
                }}
              />
            }
            label="Read Access"
          />
          <FormControlLabel
            control={
              <Switch
                checked={newApiKey.permissions.includes('write')}
                onChange={(e) => {
                  const permissions = e.target.checked
                    ? [...newApiKey.permissions, 'write']
                    : newApiKey.permissions.filter(p => p !== 'write');
                  setNewApiKey({ ...newApiKey, permissions });
                }}
              />
            }
            label="Write Access"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApiKeyDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateApiKey} variant="contained">
            Create Key
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
