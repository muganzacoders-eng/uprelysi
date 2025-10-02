import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h2" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        The page you are looking for doesn&apos;t exist
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        component={Link} 
        to="/"
      >
        Go to Home
      </Button>
    </Box>
  );
}

export default NotFoundPage;