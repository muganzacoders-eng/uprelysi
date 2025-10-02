import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <Box>
      <Typography variant="h4">Profile</Typography>
      <Avatar 
        alt={user?.first_name} 
        src={user?.profile_picture_url} 
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <Typography>Name: {user?.first_name} {user?.last_name}</Typography>
      <Typography>Email: {user?.email}</Typography>
      <Typography>Role: {user?.role}</Typography>
    </Box>
  );
}

export default ProfilePage;