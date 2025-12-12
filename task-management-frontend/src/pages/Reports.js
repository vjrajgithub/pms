import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Reports = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('tasks');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    generateReport();
  }, [reportType, dateRange]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        type: reportType,
        range: dateRange,
        start_date: startDate,
        end_date: endDate
      };

      const response = await axios.get('/api/reports', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const params = {
        type: reportType,
        range: dateRange,
        start_date: startDate,
        end_date: endDate,
        format
      };

      const response = await axios.get('/api/reports/export', {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportType}_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const renderTasksReport = () => {
    if (!reportData?.tasks) return null;

    const statusData = Object.entries(reportData.tasks.by_status || {}).map(([status, count]) => ({
      name: status,
      value: count
    }));

    const priorityData = Object.entries(reportData.tasks.by_priority || {}).map(([priority, count]) => ({
      name: priority,
      value: count
    }));

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasks by Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
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
              <Typography variant="h6" gutterBottom>
                Tasks by Priority
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Summary
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Tasks</TableCell>
                      <TableCell align="right">{reportData.tasks.total || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Completed Tasks</TableCell>
                      <TableCell align="right">{reportData.tasks.completed || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pending Tasks</TableCell>
                      <TableCell align="right">{reportData.tasks.pending || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Overdue Tasks</TableCell>
                      <TableCell align="right">{reportData.tasks.overdue || 0}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderProjectsReport = () => {
    if (!reportData?.projects) return null;

    const statusData = Object.entries(reportData.projects.by_status || {}).map(([status, count]) => ({
      name: status,
      value: count
    }));

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Projects by Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
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
              <Typography variant="h6" gutterBottom>
                Project Summary
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Projects</TableCell>
                      <TableCell align="right">{reportData.projects.total || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Active Projects</TableCell>
                      <TableCell align="right">{reportData.projects.active || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Completed Projects</TableCell>
                      <TableCell align="right">{reportData.projects.completed || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>On Hold Projects</TableCell>
                      <TableCell align="right">{reportData.projects.on_hold || 0}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderTeamsReport = () => {
    if (!reportData?.teams) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Team Summary
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Teams</TableCell>
                      <TableCell align="right">{reportData.teams.total || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Active Teams</TableCell>
                      <TableCell align="right">{reportData.teams.active || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Members</TableCell>
                      <TableCell align="right">{reportData.teams.total_members || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Team Size</TableCell>
                      <TableCell align="right">{reportData.teams.avg_size || 0}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Reports
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PdfIcon />}
            onClick={() => exportReport('pdf')}
            sx={{ mr: 1 }}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExcelIcon />}
            onClick={() => exportReport('excel')}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Report Configuration
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="tasks">Tasks Report</MenuItem>
                  <MenuItem value="projects">Projects Report</MenuItem>
                  <MenuItem value="teams">Teams Report</MenuItem>
                  <MenuItem value="performance">Performance Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {dateRange === 'custom' && (
              <>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="End Date"
                    type="date"
                    fullWidth
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={generateReport}
                disabled={loading}
                fullWidth
              >
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <Typography>Loading report...</Typography>
        </Box>
      ) : (
        <>
          {reportType === 'tasks' && renderTasksReport()}
          {reportType === 'projects' && renderProjectsReport()}
          {reportType === 'teams' && renderTeamsReport()}
          {reportType === 'performance' && (
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Performance Report
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Performance reports will be available in the next update.
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default Reports;
