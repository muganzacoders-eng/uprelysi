import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Education Support Platform
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        Learn, Teach, and Grow Together
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        component={Link} 
        to="/login"
        sx={{ mr: 2 }}
      >
        Login
      </Button>
      <Button 
        variant="outlined" 
        size="large" 
        component={Link} 
        to="/register"
      >
        Register
      </Button>
    </Box>
  );
}

export default HomePage;