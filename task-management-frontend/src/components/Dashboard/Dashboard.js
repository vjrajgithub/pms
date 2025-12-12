import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Assignment,
  Group,
  CheckCircle,
  Schedule,
  TrendingUp,
  Warning,
  Person,
  CalendarToday,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

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
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Welcome back, {user?.first_name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your projects and tasks today.
      </Typography>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={stats?.overview?.active_projects || 0}
            icon={<Assignment />}
            color="#1976d2"
            subtitle={`${stats?.overview?.total_projects || 0} total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tasks"
            value={stats?.overview?.pending_tasks || 0}
            icon={<Schedule />}
            color="#ed6c02"
            subtitle={`${stats?.overview?.total_tasks || 0} total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Tasks"
            value={stats?.overview?.completed_tasks || 0}
            icon={<CheckCircle />}
            color="#2e7d32"
            subtitle={`${stats?.metrics?.completion_rate || 0}% completion rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Teams"
            value={stats?.overview?.active_teams || 0}
            icon={<Group />}
            color="#9c27b0"
            subtitle={`${stats?.overview?.total_teams || 0} total`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Task Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(stats?.charts?.status_distribution || {}).map(([key, value]) => ({
                      name: key.replace('_', ' ').toUpperCase(),
                      value,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(stats?.charts?.status_distribution || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Priority Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(stats?.charts?.priority_distribution || {}).map(([key, value]) => ({
                  name: key.toUpperCase(),
                  value,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Deadlines
              </Typography>
              {stats?.upcoming_deadlines?.length > 0 ? (
                <List>
                  {stats.upcoming_deadlines.map((task, index) => (
                    <ListItem key={`${task.id}-${index}`} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: task.priority === 'urgent' ? 'error.main' : 'warning.main' }}>
                          <CalendarToday />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {task.project?.name} • Due: {new Date(task.deadline).toLocaleDateString()}
                            </Typography>
                            <Chip
                              label={task.priority}
                              size="small"
                              color={task.priority === 'urgent' ? 'error' : 'warning'}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No upcoming deadlines
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              {stats?.recent_tasks?.length > 0 ? (
                <List>
                  {stats.recent_tasks.map((task, index) => (
                    <ListItem key={`${task.id}-${index}`} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {task.project?.name}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                              <Chip
                                label={task.status.replace('_', ' ')}
                                size="small"
                                color={task.status === 'completed' ? 'success' : 'default'}
                              />
                              {task.assigned_user && (
                                <Typography variant="caption" color="text.secondary">
                                  Assigned to: {task.assigned_user.first_name}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No recent tasks
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        {stats?.overview?.overdue_tasks > 0 && (
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Warning />
                <Typography>
                  You have {stats.overview.overdue_tasks} overdue tasks that need attention.
                </Typography>
              </Box>
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Task Completion Rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats?.metrics?.completion_rate || 0}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {stats?.metrics?.completion_rate || 0}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Overdue Rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats?.metrics?.overdue_rate || 0}
                      color="error"
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {stats?.metrics?.overdue_rate || 0}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
