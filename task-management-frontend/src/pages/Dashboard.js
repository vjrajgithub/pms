import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  Button,
} from '@mui/material';
import {
  Assignment,
  Group,
  Task,
  TrendingUp,
  Person,
  Schedule,
  CheckCircle,
  Warning,
  MoreVert,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    totalTeams: 0,
    totalUsers: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportCharts, setReportCharts] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get primary dashboard stats
      const statsResp = await axios.get('/api/dashboard/stats');
      const d = statsResp.data || {};
      const overview = d.overview || {};
      const charts = d.charts || {};

      // Map overview
      const mapped = {
        totalProjects: overview.total_projects || 0,
        totalTasks: overview.total_tasks || 0,
        totalTeams: overview.total_teams || 0,
        totalUsers: 0, // filled below
        completedTasks: overview.completed_tasks || 0,
        pendingTasks: overview.pending_tasks || 0,
        inProgressTasks: overview.in_progress_tasks || 0,
      };

      // Optionally, compute from status distribution if provided
      if (charts.status_distribution) {
        mapped.completedTasks = (charts.status_distribution.completed ?? mapped.completedTasks);
        mapped.pendingTasks = (charts.status_distribution.pending ?? mapped.pendingTasks);
        mapped.inProgressTasks = (charts.status_distribution.in_progress ?? mapped.inProgressTasks);
      }

      // Load total users from paginated endpoint count
      try {
        const usersResp = await axios.get('/api/users', { params: { per_page: 1 } });
        const usersJson = usersResp.data;
        if (typeof usersJson?.total === 'number') {
          mapped.totalUsers = usersJson.total;
        }
      } catch (e) {
        // ignore user count errors; keep 0
      }

      setStats(mapped);

      // Recent tasks (map to UI shape)
      const recent = Array.isArray(d.recent_tasks) ? d.recent_tasks : [];
      const recentMapped = recent.map((t) => ({
        id: t.id,
        title: t.title || t.name || `Task #${t.id}`,
        status: t.status || 'pending',
        priority: t.priority || 'low',
        assignee: t.assigned_user?.full_name ?? (t.assigned_user?.first_name ? `${t.assigned_user.first_name} ${t.assigned_user?.last_name || ''}`.trim() : (t.assigned_user?.email ?? 'Unknown')),
      }));
      setRecentTasks(recentMapped);

      // Map upcoming deadlines (task-centric)
      const upcoming = Array.isArray(d.upcoming_deadlines) ? d.upcoming_deadlines : [];
      const upcomingMapped = upcoming.map((t) => ({
        id: t.id,
        title: t.title || `Task #${t.id}`,
        projectName: t.project?.name || '—',
        priority: t.priority || 'medium',
        deadline: t.deadline || null,
      }));
      setRecentProjects(upcomingMapped);

      // Load dashboard charts (task completion, task status, priority distribution)
      try {
        const chartsResp = await axios.get('/api/reports/charts');
        setReportCharts(chartsResp.data || null);
      } catch (e) {
        // ignore charts load errors; charts section will show empty state
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'error';
      case 'manager': return 'warning';
      case 'team_lead': return 'info';
      case 'team_member': return 'success';
      default: return 'primary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const roleName = user?.role?.name;

  const scopeLabels = (() => {
    switch (roleName) {
      case 'super_admin':
      case 'admin':
        return {
          subtitle: "Here's what's happening across all projects in the system.",
          projects: 'Total Projects',
          tasks: 'Total Tasks',
          teams: 'Total Teams',
          users: 'Total Users',
        };
      case 'manager':
        return {
          subtitle: "Here's what's happening in the projects you manage.",
          projects: 'My Projects',
          tasks: 'My Tasks',
          teams: 'My Teams',
          users: 'Team Members',
        };
      case 'team_lead':
        return {
          subtitle: "Here's what's happening with your team\'s projects.",
          projects: 'My Projects',
          tasks: 'My Tasks',
          teams: 'Teams I Lead',
          users: 'Team Members',
        };
      case 'team_member':
        return {
          subtitle: "Here's what's happening with your assigned tasks and teams.",
          projects: 'My Projects',
          tasks: 'My Tasks',
          teams: 'My Teams',
          users: 'Team Members',
        };
      default:
        return {
          subtitle: "Here's what's happening with your projects today.",
          projects: 'Projects',
          tasks: 'Tasks',
          teams: 'Teams',
          users: 'Users',
        };
    }
  })();

  const showUsersCard = roleName === 'super_admin' || roleName === 'admin' || roleName === 'manager';

  const taskStatusData = [
    { name: 'Completed', value: stats.completedTasks, color: '#4caf50' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#2196f3' },
    { name: 'Pending', value: stats.pendingTasks, color: '#ff9800' },
  ];

  const taskCompletionData = (() => {
    const raw = Array.isArray(reportCharts?.task_completion) ? reportCharts.task_completion : [];
    // Build a date->count map from backend data (YYYY-MM-DD -> count)
    const map = new Map();
    raw.forEach((d) => {
      if (d?.date) {
        map.set(String(d.date), Number(d.count ?? 0));
      }
    });
    // Generate last 30 days inclusive
    const out = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - i);
      const key = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())).toISOString().slice(0, 10);
      const label = dt.toLocaleDateString();
      out.push({ name: label, completed: map.get(key) ?? 0 });
    }
    return out;
  })();
  const hasCompletion = taskCompletionData.some((d) => (d.completed ?? 0) > 0);

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.first_name}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {scopeLabels.subtitle}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalProjects}
                  </Typography>
                  <Typography color="text.secondary">
                    {scopeLabels.projects}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Task />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalTasks}
                  </Typography>
                  <Typography color="text.secondary">
                    {scopeLabels.tasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Group />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalTeams}
                  </Typography>
                  <Typography color="text.secondary">
                    {scopeLabels.teams}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {showUsersCard && (
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalUsers}
                    </Typography>
                    <Typography color="text.secondary">
                      {scopeLabels.users}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Task Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Task Completion (last 30 days)
              </Typography>
              {hasCompletion ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} domain={[0, (dataMax) => Math.max(1, Math.ceil((dataMax || 0) * 1.2))]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="completed" stroke="#4caf50" name="Completed" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                  <Typography variant="body2" color="text.secondary">
                    No completion data in the last 30 days
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Tasks
                </Typography>
                <Button size="small" onClick={() => navigate('/tasks')}>
                  View All
                </Button>
              </Box>
              <List>
                {recentTasks.map((task, index) => (
                  <ListItem key={`${task.id}-${index}`} divider={index < recentTasks.length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getStatusColor(task.status) }}>
                          {task.status === 'completed' ? <CheckCircle /> : 
                           task.priority === 'urgent' ? <Warning /> : <Schedule />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <Chip
                              label={task.status.replace('_', ' ')}
                              size="small"
                              color={getStatusColor(task.status)}
                            />
                            <Chip
                              label={task.priority}
                              size="small"
                              color={getPriorityColor(task.priority)}
                            />
                            <Typography variant="caption">
                              Assigned to: {task.assignee}
                            </Typography>
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                    </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Deadlines
                </Typography>
                <Button size="small" onClick={() => navigate('/tasks')}>
                  View All
                </Button>
              </Box>
              <List>
                {recentProjects.map((item, index) => (
                  <ListItem key={`${item.id}-${index}`} divider={index < recentProjects.length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: item.priority === 'urgent' ? 'error.main' : 'warning.main' }}>
                          <Schedule />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.title}
                        secondary={
                          <Box mt={1}>
                            <Typography variant="caption" color="text.secondary">
                              {item.projectName} • Due: {item.deadline ? new Date(item.deadline).toLocaleDateString() : '—'}
                            </Typography>
                            <Box mt={0.5}>
                              <Chip label={item.priority} size="small" color={item.priority === 'urgent' ? 'error' : 'warning'} />
                            </Box>
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                    </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
