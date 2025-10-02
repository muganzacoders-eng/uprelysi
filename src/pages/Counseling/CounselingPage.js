import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import GoogleMeetButton from '../../components/meet/GoogleMeetButton';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`counseling-tabpanel-${index}`}
      aria-labelledby={`counseling-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

TabPanel.defaultProps = {
  children: null,
};

function SessionList({ sessions, user, onSessionAction, canTakeAction, onConfirmWithMeet }) {
  if (sessions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">No sessions found</Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  return (
    <List>
      {sessions.map((session) => (
        <ListItem key={session.session_id} divider>
          <ListItemAvatar>
            <Avatar src={user?.role === 'student' ? session.Expert?.profile_picture_url : session.Student?.profile_picture_url}>
              {user?.role === 'student' 
                ? session.Expert?.first_name?.[0]
                : session.Student?.first_name?.[0]
              }
            </Avatar>
          </ListItemAvatar>
          
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">
                  {user?.role === 'student' 
                    ? `Session with ${session.Expert?.first_name} ${session.Expert?.last_name}`
                    : `Session with ${session.Student?.first_name} ${session.Student?.last_name}`
                  }
                </Typography>
                <Chip
                  label={session.status}
                  color={getStatusColor(session.status)}
                  size="small"
                />
              </Box>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <ScheduleIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-bottom' }} />
                  {new Date(session.scheduled_time).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Duration: {session.duration_minutes} minutes
                </Typography>
                {session.notes && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Notes: {session.notes}
                  </Typography>
                )}
                {session.meeting_link && session.status === 'confirmed' && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VideoCallIcon />}
                    href={session.meeting_link}
                    target="_blank"
                    sx={{ mt: 1 }}
                  >
                    Join Meeting
                  </Button>
                )}
              </Box>
            }
          />

          {canTakeAction(session) && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {user?.role === 'expert' && session.status === 'requested' && (
                <>
                  <GoogleMeetButton
                    type="counseling"
                    entityId={session.session_id}
                    entityName={`Session with ${session.Student?.first_name}`}
                    onMeetingCreated={(meetingUrl) => {
                      onConfirmWithMeet(session.session_id, meetingUrl);
                    }}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => onSessionAction(session.session_id, 'confirm')}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => onSessionAction(session.session_id, 'cancel')}
                  >
                    Cancel
                  </Button>
                </>
              )}
              
              {user?.role === 'student' && session.status === 'confirmed' && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => onSessionAction(session.session_id, 'cancel')}
                >
                  Cancel
                </Button>
              )}

              {user?.role === 'expert' && session.status === 'confirmed' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onSessionAction(session.session_id, 'complete')}
                >
                  Complete
                </Button>
              )}
            </Box>
          )}
        </ListItem>
      ))}
    </List>
  );
}

SessionList.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      session_id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      scheduled_time: PropTypes.string.isRequired,
      duration_minutes: PropTypes.number.isRequired,
      notes: PropTypes.string,
      meeting_link: PropTypes.string,
      Expert: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        profile_picture_url: PropTypes.string,
      }),
      Student: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        profile_picture_url: PropTypes.string,
      }),
    })
  ).isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
    user_id: PropTypes.number,
  }).isRequired,
  onSessionAction: PropTypes.func.isRequired,
  onConfirmWithMeet: PropTypes.func.isRequired,
  canTakeAction: PropTypes.func.isRequired,
};

SessionList.defaultProps = {
  sessions: [],
};

function CounselingPage() {
  const [sessions, setSessions] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();


  const [formData, setFormData] = useState({
    expert_id: '',
    scheduled_time: '',
    duration_minutes: 60,
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [sessionsData, expertsData] = await Promise.all([
        ApiService.getCounselingSessions(),
        ApiService.getExperts()
      ]);

    console.log("Experts data:", expertsData);
    console.log("Sessions data:", sessionsData);
      
      setSessions(sessionsData);
      setExperts(expertsData);
    } catch (err) {
      console.error('Error fetching counseling data:', err);
      setError('Failed to load counseling data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      expert_id: '',
      scheduled_time: '',
      duration_minutes: 60,
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSession = async (e) => {
    e.preventDefault();
    try {
      await ApiService.requestCounselingSession(formData);
      setSuccess('Session requested successfully!');
      setOpenDialog(false);
      fetchData(); // Refresh the list
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error requesting session:', err);
      setError('Failed to request session. Please try again.');
    }
  };

  const handleSessionAction = async (sessionId, action, meetingLink = null) => {
    try {
      if (action === 'confirm') {
        // If we have a meeting link, use the confirm with meet endpoint
        if (meetingLink) {
          await ApiService.confirmCounselingSessionWithMeet(sessionId, { meeting_link: meetingLink });
        } else {
          await ApiService.confirmCounselingSession(sessionId);
        }
      } else if (action === 'cancel') {
        await ApiService.cancelCounselingSession(sessionId);
      } else if (action === 'complete') {
        await ApiService.completeCounselingSession(sessionId);
      }
      setSuccess(`Session ${action}ed successfully!`);
      fetchData(); // Refresh the list
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating session:', err);
      setError(`Failed to ${action} session. Please try again.`);
    }
  };

  // New function to handle confirmation with Google Meet
  const handleConfirmWithMeet = async (sessionId, meetingUrl) => {
    await handleSessionAction(sessionId, 'confirm', meetingUrl);
  };

  const canTakeAction = (session) => {
    if (user?.role === 'student') {
      return session.status === 'requested' || session.status === 'confirmed';
    } else if (user?.role === 'expert') {
      return session.status === 'requested' || session.status === 'confirmed';
    }
    return false;
  };

  const filteredSessions = sessions.filter(session => {
    if (tabValue === 0) return true; // All sessions
    if (tabValue === 1) return session.status === 'requested';
    if (tabValue === 2) return session.status === 'confirmed';
    if (tabValue === 3) return session.status === 'completed';
    return false;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Counseling Sessions</Typography>
        {user?.role === 'student' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Request Session
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Sessions" />
          <Tab label="Requested" />
          <Tab label="Confirmed" />
          <Tab label="Completed" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <SessionList
            sessions={filteredSessions}
            user={user}
            onSessionAction={handleSessionAction}
            onConfirmWithMeet={handleConfirmWithMeet}
            canTakeAction={canTakeAction}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <SessionList
            sessions={filteredSessions}
            user={user}
            onSessionAction={handleSessionAction}
            onConfirmWithMeet={handleConfirmWithMeet}
            canTakeAction={canTakeAction}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <SessionList
            sessions={filteredSessions}
            user={user}
            onSessionAction={handleSessionAction}
            onConfirmWithMeet={handleConfirmWithMeet}
            canTakeAction={canTakeAction}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <SessionList
            sessions={filteredSessions}
            user={user}
            onSessionAction={handleSessionAction}
            onConfirmWithMeet={handleConfirmWithMeet}
            canTakeAction={canTakeAction}
          />
        </TabPanel>
      </Paper>

      {/* Request Session Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Request Counseling Session</DialogTitle>
        <form onSubmit={handleSubmitSession}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
  <InputLabel>Expert</InputLabel>
  <Select
    name="expert_id"
    value={formData.expert_id}
    label="Expert"
    onChange={handleInputChange}
  >
    {experts.length > 0 ? (
      experts.map((expert) => (
        <MenuItem key={expert.user_id} value={expert.user_id}>
          {expert.first_name} {expert.last_name} - {expert.expertProfile?.specialization || 'General Counseling'}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No experts available</MenuItem>
    )}
  </Select>
</FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="datetime-local"
                  name="scheduled_time"
                  label="Scheduled Time"
                  InputLabelProps={{ shrink: true }}
                  value={formData.scheduled_time}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    label="Duration"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>60 minutes</MenuItem>
                    <MenuItem value={90}>90 minutes</MenuItem>
                    <MenuItem value={120}>120 minutes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="notes"
                  label="Notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Please share any specific concerns or topics you'd like to discuss..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Request Session
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default CounselingPage;