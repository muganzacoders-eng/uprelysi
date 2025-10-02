import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  VideoLibrary as LibraryIcon,
  Assignment as ExamIcon,
  Psychology as CounselingIcon,
  CloudUpload as MyContentIcon,
  Payment as PaymentIcon,
  VideoCall as MeetingIcon,
  Analytics as AnalyticsIcon,
  AdminPanelSettings as AdminIcon,
  FamilyRestroom as ParentIcon,
  BusinessCenter as ExpertIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdBanner from '../Ads/AdBanner';

function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/app/dashboard',
      roles: ['student', 'teacher', 'parent', 'admin', 'expert'] // Added expert
    },
    {
      text: 'Classrooms',
      icon: <SchoolIcon />,
      path: '/app/classrooms',
      roles: ['student', 'teacher'], // Expert doesn't need classrooms
      badge: user?.role === 'teacher' ? 'New' : null
    },
    {
      text: 'Library',
      icon: <LibraryIcon />,
      path: '/app/library',
      roles: ['student', 'teacher', 'parent', 'expert'] // Added expert
    },
    {
      text: 'My Content',
      icon: <MyContentIcon />,
      path: '/app/my-content',
      roles: ['teacher', 'expert'] // Added expert
    },
    {
      text: 'Exams',
      icon: <ExamIcon />,
      path: '/app/exams',
      roles: ['student', 'teacher'] // Expert doesn't need exams
    },
    {
      text: 'Counseling',
      icon: <CounselingIcon />,
      path: '/app/counseling',
      roles: ['student', 'parent', 'expert'] // Added expert
    },
    {
      text: 'Meetings',
      icon: <MeetingIcon />,
      path: '/app/meetings',
      roles: ['student', 'teacher', 'parent', 'expert'] // Added expert
    },
    {
      text: 'Payments',
      icon: <PaymentIcon />,
      path: '/app/payments',
      roles: ['student', 'parent', 'expert'] // Added expert
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/app/analytics',
      roles: ['teacher', 'admin', 'expert'] // Added expert
    }
  ];

  const specialMenuItems = [
    {
      text: 'Admin Panel',
      icon: <AdminIcon />,
      path: '/app/admin',
      roles: ['admin'],
      color: 'error'
    },
    {
      text: 'Parent Dashboard',
      icon: <ParentIcon />,
      path: '/app/parent',
      roles: ['parent'],
      color: 'secondary'
    },
    {
      text: 'Expert Dashboard', // Add expert-specific dashboard
      icon: <ExpertIcon />,
      path: '/app/expert',
      roles: ['expert'],
      color: 'primary'
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role)
  );

  const filteredSpecialItems = specialMenuItems.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Info */}
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap>
          {user?.first_name} {user?.last_name}
        </Typography>
        <Chip
          label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          size="small"
          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
        />
      </Box>

      <Divider />

      {/* Main Menu Items */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {filteredMenuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? 'primary.contrastText' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.badge && (
                  <Chip label={item.badge} size="small" color="error" />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}

        {filteredSpecialItems.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            {filteredSpecialItems.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: `${item.color}.light`,
                        color: `${item.color}.contrastText`,
                        '&:hover': {
                          bgcolor: `${item.color}.main`,
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: isSelected ? `${item.color}.contrastText` : `${item.color}.main` }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </>
        )}
      </List>

      {/* Advertisement Section */}
      <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
        <AdBanner position="sidebar_left" maxAds={1} />
      </Box>
    </Box>
  );
}

Sidebar.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

export default Sidebar;