// frontend/src/pages/Meetings/MeetingsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';
import AdBanner from '../../components/Ads/AdBanner';

function MeetingsPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    duration: 60
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const data = await ApiService.getMeetings();
      setMeetings(data || []);
    } catch (err) {
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  // const handleCreateMeeting = async () => {
  //   try {
  //     await ApiService.createMeeting(formData);
  //     setSuccess('Meeting created successfully!');
  //     setDialogOpen(false);
  //     setFormData({
  //       title: '',
  //       description: '',
  //       start_time: '',
  //       duration: 60
  //     });
  //     fetchMeetings();
  //     setTimeout(() => setSuccess(''), 3000);
  //   } catch (err) {
  //     setError('Failed to create meeting');
  //   }
  // };

  const handleCreateMeeting = async () => {
  try {
    const payload = {
      ...formData,
      start_time: new Date(formData.start_time).toISOString(), // ensure proper ISO format
    };

    await ApiService.createMeeting(payload);

    setSuccess('Meeting created successfully!');
    setDialogOpen(false);
    setFormData({
      title: '',
      description: '',
      start_time: '',
      duration: 60
    });
    fetchMeetings();
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    console.error('Create meeting failed:', err);
    setError(err.response?.data?.message || 'Failed to create meeting');
  }
};


  const handleJoinMeeting = (meetingUrl) => {
    window.open(meetingUrl, '_blank');
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await ApiService.deleteMeeting(meetingId);
        setSuccess('Meeting deleted successfully');
        fetchMeetings();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete meeting');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AdBanner position="content_top" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Meetings</Typography>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Schedule Meeting
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {meetings.length > 0 ? meetings.map((meeting) => (
          <Grid item xs={12} md={6} lg={4} key={meeting.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {meeting.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {meeting.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Date:</strong> {new Date(meeting.start_time).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Time:</strong> {new Date(meeting.start_time).toLocaleTimeString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Duration:</strong> {meeting.duration} minutes
                </Typography>
                <Chip
                  label={meeting.status || 'Scheduled'}
                  size="small"
                  color="primary"
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<VideoCallIcon />}
                  onClick={() => handleJoinMeeting(meeting.meeting_url)}
                >
                  Join
                </Button>
                {user?.userId === meeting.created_by && (
                  <>
                    <Button size="small" startIcon={<EditIcon />}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteMeeting(meeting.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        )) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary" align="center">
              No meetings scheduled
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Create Meeting Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New Meeting</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            required
            label="Meeting Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            type="datetime-local"
            label="Start Time"
            value={formData.start_time}
            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="number"
            label="Duration (minutes)"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
            inputProps={{ min: 15, max: 480 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateMeeting} variant="contained">
            Schedule Meeting
          </Button>
        </DialogActions>
      </Dialog>

      <AdBanner position="content_bottom" />
    </Box>
  );
}

export default MeetingsPage;