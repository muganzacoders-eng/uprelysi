// frontend/src/App.js - Fixed version without Router wrapper
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/Layout/AppLayout';
import PublicLayout from './components/Layout/PublicLayout';
import PrivateRoute from './components/Auth/PrivateRoute';
import PublicRoute from './components/Auth/PublicRoute';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';

// Main Pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import ClassroomsPage from './pages/Classrooms/ClassroomsPage';
import ExamsPage from './pages/Exams/ExamsPage';
import LibraryPage from './pages/Library/LibraryPage';
import MyContentPage from './pages/MyContent/MyContentPage';
import CounselingPage from './pages/Counseling/CounselingPage';
import UserProfilePage from './pages/Profile/UserProfilePage';
import PaymentsPage from './pages/Payments/PaymentsPage';
import MeetingsPage from './pages/Meetings/MeetingsPage';

// Admin Pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';

// Parent Pages
import ParentDashboardPage from './pages/Parent/ParentDashboardPage';

// Analytics Pages
import AnalyticsPage from './pages/Analytics/AnalyticsPage';

// Legal Pages
import PrivacyPolicyPage from './pages/Legal/PrivacyPolicyPage';
import TermsOfServicePage from './pages/Legal/TermsOfServicePage';

// Other Pages
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Enhanced Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<PublicRoute><HomePage /></PublicRoute>} />
              <Route path="about" element={<PublicRoute><AboutPage /></PublicRoute>} />
              <Route path="contact" element={<PublicRoute><ContactPage /></PublicRoute>} />
              <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
              <Route path="reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="terms-of-service" element={<TermsOfServicePage />} />
            </Route>

            {/* Protected Routes */}
            <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="classrooms" element={<ClassroomsPage />} />
              <Route path="exams" element={<ExamsPage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="my-content" element={<MyContentPage />} />
              <Route path="counseling" element={<CounselingPage />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="meetings" element={<MeetingsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              
              {/* Admin Routes */}
              <Route path="admin" element={<AdminDashboardPage />} />
              
              {/* Parent Routes */}
              <Route path="parent" element={<ParentDashboardPage />} />
            </Route>

            {/* Legacy redirect for dashboard */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;