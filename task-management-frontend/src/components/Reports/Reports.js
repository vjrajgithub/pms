import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  TableChart,
  Refresh,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('projects');
  const [reportData, setReportData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    status: '',
    priority: '',
    project_id: '',
    assigned_to: '',
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchReportData();
    fetchChartData();
  }, [reportType, filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      const response = await axios.get(`/api/reports/${reportType}`, { params });
      setReportData(response.data);
    } catch (err) {
      console.error('Fetch report data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/reports/charts');
      setChartData(response.data);
    } catch (err) {
      console.error('Fetch chart data error:', err);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.post(`/api/reports/export/${format}`, {
        type: reportType,
        ...filters,
      }, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'pending': return 'warning';
      case 'on_hold': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const renderProjectsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Total Tasks</TableCell>
            <TableCell align="right">Completed</TableCell>
            <TableCell align="right">Completion Rate</TableCell>
            <TableCell align="right">Teams</TableCell>
            <TableCell>Deadline</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>
                <Chip label={project.status} color={getStatusColor(project.status)} size="small" />
              </TableCell>
              <TableCell align="right">{project.total_tasks}</TableCell>
              <TableCell align="right">{project.completed_tasks}</TableCell>
              <TableCell align="right">{project.completion_rate}%</TableCell>
              <TableCell align="right">{project.team_count}</TableCell>
              <TableCell>
                {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTeamsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team Name</TableCell>
            <TableCell>Project</TableCell>
            <TableCell align="right">Members</TableCell>
            <TableCell align="right">Total Tasks</TableCell>
            <TableCell align="right">Completed</TableCell>
            <TableCell align="right">Completion Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((team) => (
            <TableRow key={team.id}>
              <TableCell>{team.name}</TableCell>
              <TableCell>{team.project_name}</TableCell>
              <TableCell align="right">{team.member_count}</TableCell>
              <TableCell align="right">{team.total_tasks}</TableCell>
              <TableCell align="right">{team.completed_tasks}</TableCell>
              <TableCell align="right">{team.completion_rate}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTasksTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>
                <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
              </TableCell>
              <TableCell>
                <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
              </TableCell>
              <TableCell>{task.assigned_to}</TableCell>
              <TableCell>{task.project_name}</TableCell>
              <TableCell>
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                {task.is_overdue && <Chip label="Overdue" color="error" size="small" sx={{ ml: 1 }} />}
              </TableCell>
              <TableCell>{task.progress}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderUsersTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Assigned Tasks</TableCell>
            <TableCell align="right">Completed</TableCell>
            <TableCell align="right">Completion Rate</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align="right">{user.total_assigned_tasks}</TableCell>
              <TableCell align="right">{user.completed_tasks}</TableCell>
              <TableCell align="right">{user.completion_rate}%</TableCell>
              <TableCell>
                <Chip label={user.status} color={user.status === 'active' ? 'success' : 'default'} size="small" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTable = () => {
    switch (reportType) {
      case 'projects': return renderProjectsTable();
      case 'teams': return renderTeamsTable();
      case 'tasks': return renderTasksTable();
      case 'users': return renderUsersTable();
      default: return null;
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Reports & Analytics</Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="projects">Projects</MenuItem>
                  <MenuItem value="teams">Teams</MenuItem>
                  <MenuItem value="tasks">Tasks</MenuItem>
                  {user.isManager() && <MenuItem value="users">Users</MenuItem>}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box display="flex" gap={1}>
                <IconButton onClick={fetchReportData} color="primary">
                  <Refresh />
                </IconButton>
                <Button
                  startIcon={<PictureAsPdf />}
                  onClick={() => handleExport('pdf')}
                  variant="outlined"
                  size="small"
                >
                  PDF
                </Button>
                <Button
                  startIcon={<TableChart />}
                  onClick={() => handleExport('excel')}
                  variant="outlined"
                  size="small"
                >
                  Excel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Charts */}
      {chartData && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Task Status Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.task_status}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {chartData.task_status?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <Typography variant="h6" mb={2}>Priority Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.priority_distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Task Completion Over Time</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.task_completion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Data Table */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </Typography>
            {loading && <CircularProgress size={24} />}
          </Box>
          {renderTable()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
