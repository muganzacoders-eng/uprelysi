import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  ContentCopy as CopyIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import ApiService from '../../api';
import PropTypes from 'prop-types';


function GoogleMeetButton({ type, entityId, entityName, onMeetingCreated }) {
  const [open, setOpen] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    duration_minutes: 60,
    description: ''
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateScheduledMeeting = () => {
    handleMenuClose();
    setOpen(true);
    setMeetingInfo(null);
  };

  const handleCreateInstantMeeting = async () => {
    handleMenuClose();
    setLoading(true);
    try {
      let response;
      if (type === 'classroom') {
        response = await ApiService.generateInstantClassroomMeeting(entityId);
      } else if (type === 'counseling') {
        response = await ApiService.generateInstantCounselingMeeting();
      }
      
      setMeetingInfo({
        meetingUrl: response.meeting_link,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60000).toISOString(),
        isInstant: true
      });
      
      if (onMeetingCreated) {
        onMeetingCreated(response.meeting_link);
      }
      setOpen(true);
    } catch (error) {
      console.error('Error creating instant meeting:', error);
      alert('Failed to create instant meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    try {
      setLoading(true);
      let response;
      
      const meetingData = {
        ...formData,
        [type === 'classroom' ? 'classroom_id' : 'session_id']: entityId
      };

      if (type === 'classroom') {
        response = await ApiService.createClassroomMeeting(meetingData);
      } else if (type === 'counseling') {
        response = await ApiService.createCounselingMeeting(meetingData);
      }
      
      setMeetingInfo(response.meeting);
      if (onMeetingCreated) {
        onMeetingCreated(response.meeting);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingInfo.meetingUrl);
    alert('Meeting link copied to clipboard!');
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<VideoCallIcon />}
        onClick={handleMenuOpen}
        color="primary"
        disabled={loading}
      >
        Google Meet
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleCreateInstantMeeting}>
          <ListItemIcon>
            <VideoCallIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Instant Meeting</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCreateScheduledMeeting}>
          <ListItemIcon>
            <CalendarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Scheduled Meeting</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {meetingInfo ? 'Meeting Created' : `Create Google Meet for ${entityName}`}
        </DialogTitle>
        
        <DialogContent>
          {!meetingInfo ? (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Meeting Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                margin="normal"
                placeholder={`e.g., ${entityName} Session`}
              />
              
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                margin="normal"
              />
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Meeting Created Successfully!
              </Typography>
              
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Meeting Link:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
                    {meetingInfo.meetingUrl}
                  </Typography>
                  <IconButton onClick={copyMeetingLink} size="small">
                    <CopyIcon />
                  </IconButton>
                </Box>
              </Box>
              
              {!meetingInfo.isInstant && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Starts:</strong> {formatDateTime(meetingInfo.startTime)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Ends:</strong> {formatDateTime(meetingInfo.endTime)}
                    </Typography>
                  </Box>
                </>
              )}
              
              <Button
                variant="contained"
                color="primary"
                href={meetingInfo.meetingUrl}
                target="_blank"
                fullWidth
                startIcon={<VideoCallIcon />}
              >
                Join Meeting Now
              </Button>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          {!meetingInfo ? (
            <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateMeeting} 
                variant="contained" 
                disabled={loading || !formData.title || !formData.startTime}
              >
                {loading ? 'Creating...' : 'Create Meeting'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setOpen(false)}>Close</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

GoogleMeetButton.propTypes = {
  type: PropTypes.oneOf(['classroom', 'counseling']).isRequired,
  entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  entityName: PropTypes.string.isRequired,
  onMeetingCreated: PropTypes.func
};


export default GoogleMeetButton;