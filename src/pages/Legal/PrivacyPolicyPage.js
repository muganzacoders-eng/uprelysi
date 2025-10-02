// frontend/src/pages/Legal/PrivacyPolicyPage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import ApiService from '../../api';

function PrivacyPolicyPage() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const data = await ApiService.getPrivacyPolicy();
      setPolicy(data);
    } catch (err) {
      setError('Failed to load privacy policy');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          Privacy Policy
        </Typography>
        
        {policy && (
          <>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Version {policy.version} - Last updated: {new Date(policy.updated_at).toLocaleDateString()}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <div dangerouslySetInnerHTML={{ __html: policy.content }} />
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default PrivacyPolicyPage;
