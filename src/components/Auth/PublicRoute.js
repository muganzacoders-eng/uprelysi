// frontend/src/components/Auth/PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import PropTypes from 'prop-types';

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default PublicRoute;