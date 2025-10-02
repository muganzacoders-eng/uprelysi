// frontend/src/pages/Profile/UserProfilePage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api';

function UserProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const data = await ApiService.getUser(user.userId);
      setProfile(data);
      setEditData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || '',
        bio: data.bio || '',
        date_of_birth: data.date_of_birth || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
        notification_preferences: data.notification_preferences || {
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true
        }
      });
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    if (editing) {
      // Reset data when cancelling
      setEditData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone || '',
        bio: profile.bio || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || ''
      });
      setProfileImage(null);
    }
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      setProfileImage(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(editData).forEach(key => {
        if (typeof editData[key] === 'object') {
          formData.append(key, JSON.stringify(editData[key]));
        } else {
          formData.append(key, editData[key]);
        }
      });

      // Add image if selected
      if (profileImage) {
        formData.append('profile_picture', profileImage);
      }

      const updatedUser = await ApiService.updateUser(user.userId, formData);
      
      setProfile(updatedUser);
      updateUser(updatedUser);
      setEditing(false);
      setSuccess('Profile updated successfully');
      setProfileImage(null);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await ApiService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Password changed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await ApiService.deleteUser(user.userId);
      await logout();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account');
      setDeleteDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', mr: 3 }}>
            <Avatar
              src={profile.profile_picture_url}
              sx={{ width: 100, height: 100 }}
            >
              {profile.first_name[0]}{profile.last_name[0]}
            </Avatar>
            {editing && (
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </IconButton>
            )}
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              {profile.first_name} {profile.last_name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </Typography>
          </Box>

          <Box>
            {!editing ? (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={handleEditToggle}
              >
                Edit Profile
              </Button>
            ) : (
              <Box>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={handleSaveProfile}
                  disabled={loading}
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  variant="outlined"
                  onClick={handleEditToggle}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Profile Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={editData.first_name}
                      onChange={handleInputChange('first_name')}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={editData.last_name}
                      onChange={handleInputChange('last_name')}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={editData.email}
                      onChange={handleInputChange('email')}
                      disabled={!editing}
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={editData.phone}
                      onChange={handleInputChange('phone')}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={editData.date_of_birth}
                      onChange={handleInputChange('date_of_birth')}
                      disabled={!editing}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={3}
                      value={editData.bio}
                      onChange={handleInputChange('bio')}
                      disabled={!editing}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Address Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={editData.address}
                      onChange={handleInputChange('address')}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={editData.city}
                      onChange={handleInputChange('city')}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={editData.country}
                      onChange={handleInputChange('country')}
                      disabled={!editing}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.notification_preferences?.email_notifications || false}
                      onChange={handleInputChange('notification_preferences.email_notifications')}
                      disabled={!editing}
                    />
                  }
                  label="Email Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.notification_preferences?.sms_notifications || false}
                      onChange={handleInputChange('notification_preferences.sms_notifications')}
                      disabled={!editing}
                    />
                  }
                  label="SMS Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.notification_preferences?.push_notifications || false}
                      onChange={handleInputChange('notification_preferences.push_notifications')}
                      disabled={!editing}
                    />
                  }
                  label="Push Notifications"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security
                </Typography>
                
                <Button
                  variant="outlined"
                  onClick={() => setPasswordDialogOpen(true)}
                  sx={{ mb: 2, width: '100%' }}
                >
                  Change Password
                </Button>
                
                <Divider sx={{ my: 2 }} />
                
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ width: '100%' }}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" disabled={loading}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
            All your data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={loading}>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UserProfilePage;