import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Add this import
import { Box, useTheme, useMediaQuery } from '@mui/material';
import AppBar from '../components/common/AppBar';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {user && (
        <>
          <AppBar onDrawerToggle={handleDrawerToggle} />
          <Sidebar 
            isOpen={sidebarOpen} 
            onToggle={handleDrawerToggle}
            isMobile={isMobile}
          />
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: user ? { sm: `calc(100% - ${sidebarOpen ? 240 : 80}px)` } : '100%',
          ml: user ? { sm: `${sidebarOpen ? 240 : 80}px` } : 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {user && <Box sx={{ mt: 8 }} />} {/* Space for app bar */}
        {children}
      </Box>
    </Box>
  );
}

// Add PropTypes validation
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;