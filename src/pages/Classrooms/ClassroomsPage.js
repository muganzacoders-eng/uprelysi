// frontend/src/pages/Classrooms/ClassroomsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Fab,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExitToApp as LeaveIcon,
  Login as JoinIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';
import AdBanner from '../../components/Ads/AdBanner';

function ClassroomsPage() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade_level: '',
    max_students: 30,
    meeting_schedule: '',
    is_public: true
  });

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const data = await ApiService.getClassrooms();
      setClassrooms(data);
    } catch (err) {
      setError('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async () => {
    try {
      await ApiService.createClassroom(formData);
      setSuccess('Classroom created successfully!');
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        subject: '',
        grade_level: '',
        max_students: 30,
        meeting_schedule: '',
        is_public: true
      });
      fetchClassrooms();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create classroom');
    }
  };

  const handleJoinClassroom = async (classroomId) => {
    try {
      await ApiService.joinClassroom(classroomId);
      setSuccess('Successfully joined classroom!');
      fetchClassrooms();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to join classroom');
    }
  };

  const handleLeaveClassroom = async (classroomId) => {
    if (window.confirm('Are you sure you want to leave this classroom?')) {
      try {
        await ApiService.leaveClassroom(classroomId);
        setSuccess('Successfully left classroom');
        fetchClassrooms();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to leave classroom');
      }
    }
  };

  const handleDeleteClassroom = async (classroomId) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await ApiService.deleteClassroom(classroomId);
        setSuccess('Classroom deleted successfully');
        fetchClassrooms();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete classroom');
      }
    }
  };

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Top Advertisement */}
      <AdBanner position="content_top" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Classrooms</Typography>
        {user?.role === 'teacher' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Create Classroom
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search classrooms..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {/* Sidebar with ads */}
        <Grid item xs={12} md={3}>
          <AdBanner position="sidebar_left" />
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {filteredClassrooms.map((classroom) => (
              <Grid item xs={12} key={classroom.classroom_id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {classroom.title}
                      </Typography>
                      {classroom.subject && (
                        <Chip label={classroom.subject} size="small" color="primary" />
                      )}
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {classroom.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {classroom.teacher?.first_name?.[0]}
                      </Avatar>
                      <Typography variant="body2">
                        {classroom.teacher?.first_name} {classroom.teacher?.last_name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GroupIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        <Typography variant="caption">
                          {classroom.enrolled_count || 0}/{classroom.max_students} students
                        </Typography>
                      </Box>
                      {classroom.grade_level && (
                        <Chip label={`Grade ${classroom.grade_level}`} size="small" variant="outlined" />
                      )}
                      <Chip
                        label={classroom.is_public ? 'Public' : 'Private'}
                        size="small"
                        color={classroom.is_public ? 'success' : 'warning'}
                      />
                    </Box>

                    {classroom.meeting_schedule && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ScheduleIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        <Typography variant="caption">
                          {classroom.meeting_schedule}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions>
                    {classroom.is_enrolled ? (
                      <>
                        <Button size="small" variant="contained">
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<LeaveIcon />}
                          onClick={() => handleLeaveClassroom(classroom.classroom_id)}
                        >
                          Leave
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<JoinIcon />}
                        onClick={() => handleJoinClassroom(classroom.classroom_id)}
                        disabled={classroom.enrolled_count >= classroom.max_students}
                      >
                        {classroom.enrolled_count >= classroom.max_students ? 'Full' : 'Join'}
                      </Button>
                    )}

                    {user?.userId === classroom.teacher_id && (
                      <>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClassroom(classroom.classroom_id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right sidebar with ads */}
        <Grid item xs={12} md={3}>
          <AdBanner position="sidebar_right" />
        </Grid>
      </Grid>

      {/* Create Classroom Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Classroom</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Classroom Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Grade Level</InputLabel>
                <Select
                  value={formData.grade_level}
                  label="Grade Level"
                  onChange={(e) => setFormData({...formData, grade_level: e.target.value})}
                >
                  <MenuItem value="K">Kindergarten</MenuItem>
                  <MenuItem value="1">Grade 1</MenuItem>
                  <MenuItem value="2">Grade 2</MenuItem>
                  <MenuItem value="3">Grade 3</MenuItem>
                  <MenuItem value="4">Grade 4</MenuItem>
                  <MenuItem value="5">Grade 5</MenuItem>
                  <MenuItem value="6">Grade 6</MenuItem>
                  <MenuItem value="7">Grade 7</MenuItem>
                  <MenuItem value="8">Grade 8</MenuItem>
                  <MenuItem value="9">Grade 9</MenuItem>
                  <MenuItem value="10">Grade 10</MenuItem>
                  <MenuItem value="11">Grade 11</MenuItem>
                  <MenuItem value="12">Grade 12</MenuItem>
                  <MenuItem value="college">College</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Students"
                value={formData.max_students}
                onChange={(e) => setFormData({...formData, max_students: parseInt(e.target.value)})}
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Visibility</InputLabel>
                <Select
                  value={formData.is_public}
                  label="Visibility"
                  onChange={(e) => setFormData({...formData, is_public: e.target.value})}
                >
                  <MenuItem value={true}>Public</MenuItem>
                  <MenuItem value={false}>Private</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meeting Schedule (optional)"
                value={formData.meeting_schedule}
                onChange={(e) => setFormData({...formData, meeting_schedule: e.target.value})}
                placeholder="e.g., Mondays and Wednesdays at 3:00 PM"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateClassroom} variant="contained">
            Create Classroom
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bottom Advertisement */}
      <AdBanner position="content_bottom" />
    </Box>
  );
}

export default ClassroomsPage;