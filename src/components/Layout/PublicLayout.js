// frontend/src/components/Layout/PublicLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AdBanner from '../Ads/AdBanner';

function PublicLayout() {
  const location = useLocation();
  const showAds = !location.pathname.includes('/privacy') && !location.pathname.includes('/terms');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Public Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Education Support System
            </Link>
          </Typography>
          
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button 
            variant="outlined" 
            sx={{ ml: 1, color: 'white', borderColor: 'white' }}
            component={Link} 
            to="/register"
          >
            Sign Up
          </Button>
        </Toolbar>

        {/* Header Advertisement for non-auth pages */}
        {showAds && (
          <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
            <AdBanner position="header" />
          </Box>
        )}
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {/* Side Advertisements */}
        {showAds && (
          <>
            <Box
              sx={{
                position: 'fixed',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                display: { xs: 'none', lg: 'block' }
              }}
            >
              <AdBanner position="sidebar_left" maxAds={2} />
            </Box>
            
            <Box
              sx={{
                position: 'fixed',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                display: { xs: 'none', lg: 'block' }
              }}
            >
              <AdBanner position="sidebar_right" maxAds={2} />
            </Box>
          </>
        )}
        
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: 'grey.100',
          borderTop: 1,
          borderColor: 'divider',
          mt: 'auto'
        }}
      >
        {/* Footer Advertisement */}
        {showAds && <AdBanner position="footer" />}
        
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Typography variant="body2" color="textSecondary" align="center">
            © 2025 Education Support System. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
            <Link to="/privacy-policy" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" color="primary">
                Privacy Policy
              </Typography>
            </Link>
            <Link to="/terms-of-service" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" color="primary">
                Terms of Service
              </Typography>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default PublicLayout;