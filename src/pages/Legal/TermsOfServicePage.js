// frontend/src/pages/Legal/TermsOfServicePage.js
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

function TermsOfServicePage() {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTermsOfService();
  }, []);

  const fetchTermsOfService = async () => {
    try {
      const data = await ApiService.getTermsOfService();
      setTerms(data);
    } catch (err) {
      setError('Failed to load terms of service');
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
          Terms of Service
        </Typography>
        
        {terms && (
          <>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Version {terms.version} - Last updated: {new Date(terms.updated_at).toLocaleDateString()}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <div dangerouslySetInnerHTML={{ __html: terms.content }} />
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default TermsOfServicePage;