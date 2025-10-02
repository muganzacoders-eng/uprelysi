// frontend/src/pages/Auth/EnhancedRegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import LegalAgreementDialog from '../../components/Legal/LegalAgreementDialog';
import AdBanner from '../../components/Ads/AdBanner';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import ApiService from '../../api';

function EnhancedRegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState(null);
  const [showLegalDialog, setShowLegalDialog] = useState(false);
  const [legalAgreements, setLegalAgreements] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('First name and last name are required');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    // Show legal agreement dialog
    setShowLegalDialog(true);
  };

  const handleLegalAccept = async (agreements) => {
    setLegalAgreements(agreements);
    setShowLegalDialog(false);
    setLoading(true);

    try {
      const registrationData = { ...formData };
      delete registrationData.confirmPassword;

      const result = await register(registrationData);
      
      if (!result.success) {
        setError(result.message || 'Registration failed');
        return;
      }

      // Accept legal documents if user agreed
      if (agreements.privacy || agreements.terms) {
        try {
          const legalDocs = await ApiService.getLegalDocuments();
          for (const doc of legalDocs) {
            if ((doc.document_type === 'privacy_policy' && agreements.privacy) ||
                (doc.document_type === 'terms_of_service' && agreements.terms)) {
              await ApiService.acceptLegalDocument(doc.document_id);
            }
          }
        } catch (legalError) {
          console.warn('Failed to record legal agreements:', legalError);
        }
      }

      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setPendingGoogleCredential(credentialResponse.credential);
      setShowRoleSelector(true);
    } catch (error) {
      setError('Google registration failed');
    }
  };

  const handleGoogleRoleConfirmation = async () => {
    setShowLegalDialog(true);
  };

  const handleGoogleLegalAccept = async (agreements) => {
    setLegalAgreements(agreements);
    setShowLegalDialog(false);
    setLoading(true);

    try {
      const result = await login({
        tokenId: { credential: pendingGoogleCredential },
        role: selectedRole
      }, true);

      if (result.success) {
        // Accept legal documents
        if (agreements.privacy || agreements.terms) {
          try {
            const legalDocs = await ApiService.getLegalDocuments();
            for (const doc of legalDocs) {
              if ((doc.document_type === 'privacy_policy' && agreements.privacy) ||
                  (doc.document_type === 'terms_of_service' && agreements.terms)) {
                await ApiService.acceptLegalDocument(doc.document_id);
              }
            }
          } catch (legalError) {
            console.warn('Failed to record legal agreements:', legalError);
          }
        }

        setSuccess('Google registration successful!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setError(result.message || 'Google registration failed');
      }
    } catch (err) {
      setError('Google registration failed');
    } finally {
      setLoading(false);
      setShowRoleSelector(false);
      setPendingGoogleCredential(null);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      {/* Advertisement Banner */}
      <AdBanner position="content_top" />

      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 500 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  required
                  fullWidth
                  label="First Name"
                  autoFocus
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="parent">Parent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign Up
            </Button>

            <Divider sx={{ my: 2 }}>OR</Divider>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google sign up failed')}
                  useOneTap={false}
                />
              </GoogleOAuthProvider>
            </Box>

            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    Already have an account? Sign in
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Side Advertisement */}
        <Box sx={{ mt: 3, width: '100%' }}>
          <AdBanner position="content_bottom" />
        </Box>
      </Box>

      {/* Legal Agreement Dialog */}
      <LegalAgreementDialog
        open={showLegalDialog}
        onClose={() => setShowLegalDialog(false)}
        onAccept={pendingGoogleCredential ? handleGoogleLegalAccept : handleLegalAccept}
        required={true}
      />

      {/* Google Role Selector Dialog */}
      {showRoleSelector && (
        <Box>
          {/* Role selector implementation */}
        </Box>
      )}
    </Container>
  );
}

export default EnhancedRegisterPage;