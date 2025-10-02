// frontend/src/components/Legal/LegalAgreementDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Link,
  Alert
} from '@mui/material';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

function LegalAgreementDialog({ open, onClose, onAccept, required = true }) {
  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false
  });
  const [error, setError] = useState('');

  const handleAgreementChange = (type) => (event) => {
    setAgreements(prev => ({
      ...prev,
      [type]: event.target.checked
    }));
    setError('');
  };

  const handleAccept = () => {
    if (required && (!agreements.privacy || !agreements.terms)) {
      setError('You must agree to both Privacy Policy and Terms of Service to continue');
      return;
    }
    onAccept(agreements);
  };

  const allAgreed = agreements.privacy && agreements.terms;

  return (
    <Dialog open={open} onClose={!required ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Legal Agreements</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Please review and accept our legal agreements to continue:
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreements.privacy}
                onChange={handleAgreementChange('privacy')}
              />
            }
            label={
              <Typography>
                I agree to the{' '}
                <Link
                  component={RouterLink}
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener"
                >
                  Privacy Policy
                </Link>
              </Typography>
            }
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreements.terms}
                onChange={handleAgreementChange('terms')}
              />
            }
            label={
              <Typography>
                I agree to the{' '}
                <Link
                  component={RouterLink}
                  to="/terms-of-service"
                  target="_blank"
                  rel="noopener"
                >
                  Terms of Service
                </Link>
              </Typography>
            }
          />
        </Box>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
          By accepting these agreements, you acknowledge that you have read, understood, and agree to be bound by these terms.
        </Typography>
      </DialogContent>
      <DialogActions>
        {!required && (
          <Button onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleAccept}
          variant="contained"
          disabled={required && !allAgreed}
        >
          Accept and Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

LegalAgreementDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  required: PropTypes.bool
};

export default LegalAgreementDialog;