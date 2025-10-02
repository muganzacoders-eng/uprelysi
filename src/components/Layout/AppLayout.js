// frontend/src/components/Layout/AppLayout.js - Fixed version
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Sidebar from '../common/Sidebar';
import TopNavigation from '../common/TopNavigation';
import AdBanner from '../Ads/AdBanner';

const DRAWER_WIDTH = 280;

function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isAdminPage = location.pathname.includes('/admin');
  const showAds = !isAdminPage; // Don't show ads on admin pages

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Education Support System
          </Typography>
          
          <TopNavigation />
        </Toolbar>

        {/* Header Advertisement */}
        {showAds && (
          <Box sx={{ 
            borderTop: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            py: 0.5
          }}>
            <AdBanner position="header" />
          </Box>
        )}
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              position: 'fixed',
              height: '100%',
              zIndex: theme.zIndex.drawer,
            },
          }}
          open
        >
          <Toolbar /> {/* Spacer for AppBar */}
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        {/* Spacer for AppBar */}
        <Toolbar />
        {showAds && <Box sx={{ height: '60px' }} />} {/* Extra space for header ad */}
        
        <Box sx={{ flexGrow: 1, position: 'relative', p: 0 }}>
          {/* Side Advertisements - Only on very large screens */}
          {showAds && (
            <>
              <Box
                sx={{
                  position: 'fixed',
                  left: { xl: `${DRAWER_WIDTH + 20}px` },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1000,
                  display: { xs: 'none', xl: 'block' }
                }}
              >
                <AdBanner position="sidebar_left" maxAds={2} />
              </Box>
              
              <Box
                sx={{
                  position: 'fixed',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1000,
                  display: { xs: 'none', xl: 'block' }
                }}
              >
                <AdBanner position="sidebar_right" maxAds={2} />
              </Box>
            </>
          )}
          
          <Outlet />
        </Box>

        {/* Footer Advertisement */}
        {showAds && (
          <Box sx={{ 
            borderTop: 1, 
            borderColor: 'divider', 
            mt: 'auto',
            bgcolor: 'background.paper',
            py: 1
          }}>
            <AdBanner position="footer" />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AppLayout;