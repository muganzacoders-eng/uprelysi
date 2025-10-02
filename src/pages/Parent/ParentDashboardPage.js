// frontend/src/pages/Parent/ParentDashboardPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';
import AdBanner from '../../components/Ads/AdBanner';

function ParentDashboardPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const data = await ApiService.getParentChildren();
      setChildren(data || []);
    } catch (err) {
      setError('Failed to load children data');
    } finally {
      setLoading(false);
    }
  };

  const getOverallStats = () => {
    if (children.length === 0) return { totalChildren: 0, avgGrades: 0, activeClasses: 0, completedExams: 0 };
    
    return {
      totalChildren: children.length,
      avgGrades: children.reduce((acc, child) => acc + (child.averageGrade || 0), 0) / children.length,
      activeClasses: children.reduce((acc, child) => acc + (child.activeClasses || 0), 0),
      completedExams: children.reduce((acc, child) => acc + (child.completedExams || 0), 0)
    };
  };

  if (user?.role !== 'parent') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          This dashboard is only available for parent accounts.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = getOverallStats();

  return (
    <Box sx={{ p: 3 }}>
      <AdBanner position="content_top" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Parent Dashboard</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            // This would open a dialog to add/link a child account
            alert('Add child functionality would be implemented here');
          }}
        >
          Add Child
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Overall Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.totalChildren}</Typography>
              <Typography color="textSecondary">Children</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.avgGrades.toFixed(1)}%</Typography>
              <Typography color="textSecondary">Average Grade</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SchoolIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.activeClasses}</Typography>
              <Typography color="textSecondary">Active Classes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssessmentIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.completedExams}</Typography>
              <Typography color="textSecondary">Completed Exams</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Children Overview */}
      {children.length > 0 ? (
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Children Academic Progress</Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Grade Level</TableCell>
                  <TableCell>Active Classes</TableCell>
                  <TableCell>Average Grade</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {children.map((child) => (
                  <TableRow key={child.user_id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }} src={child.profile_picture_url}>
                          {child.first_name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {child.first_name} {child.last_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {child.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`Grade ${child.gradeLevel || 'N/A'}`} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>{child.activeClasses || 0}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {child.averageGrade ? `${child.averageGrade}%` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: 150 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={child.progress || 0} 
                            color={child.progress >= 80 ? 'success' : child.progress >= 60 ? 'warning' : 'error'}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {child.progress || 0}%
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={child.status || 'Active'}
                        color={child.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', mb: 3 }}>
          <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Children Linked
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Link your child&apos;s account to monitor their academic progress and stay involved in their education.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              alert('Add child functionality would be implemented here');
            }}
          >
            Link Child Account
          </Button>
        </Paper>
      )}

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="textSecondary">
                Recent activity will be displayed here when children are linked to your account.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="textSecondary">
                Upcoming exams, assignments, and school events will be shown here.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <AdBanner position="content_bottom" />
    </Box>
  );
}

export default ParentDashboardPage;