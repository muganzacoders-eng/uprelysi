import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Paper
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon
} from '@mui/icons-material';
import AdBanner from '../components/Ads/AdBanner';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email Us',
      content: 'patrickmbwana@gmail.com',
      description: 'Send us an email and we\'ll respond within 24 hours'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Call Us',
      content: '+255 627 944 806',
      description: 'Monday to Friday, 9 AM to 6 PM EST'
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Visit Us',
      content: '123 Education St, Learning City, LC 12345',
      description: 'Our headquarters are open for scheduled visits'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setError('');
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <Box>
      <AdBanner position="content_top" />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Contact Us
          </Typography>
          <Typography variant="h5" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Have questions or need support? We&apos;re here to help! Reach out to us 
            through any of the methods below.
          </Typography>
        </Box>

        {/* Contact Info Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {info.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {info.title}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {info.content}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {info.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form and Map */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Send us a Message
              </Typography>
              
              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Your message has been sent successfully! We&apos;ll get back to you soon.
                </Alert>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={6}
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendIcon />}
                      sx={{ px: 4 }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Find Us
              </Typography>
              
              {/* Placeholder for map */}
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  [Interactive Map]
                </Typography>
              </Box>

              <Typography variant="body1" paragraph>
                <strong>Office Hours:</strong><br />
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </Typography>

              <Typography variant="body1">
                <strong>Public Transportation:</strong><br />
                Our office is easily accessible by bus and subway. 
                The nearest subway station is Learning Station, just a 5-minute walk away.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Paper sx={{ p: 6, mt: 8, bgcolor: 'grey.50' }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                How do I create an account?
              </Typography>
              <Typography variant="body1" paragraph>
                Click on the &quot;Sign Up&quot; button in the top navigation, fill out the registration form, 
                and verify your email address.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Is the platform free to use?
              </Typography>
              <Typography variant="body1" paragraph>
                We offer both free and premium content. Basic access is free, while some advanced 
                courses and features require a subscription.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Can I access courses on mobile devices?
              </Typography>
              <Typography variant="body1" paragraph>
                Yes! Our platform is fully responsive and works great on smartphones and tablets. 
                We also have mobile apps available.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                How do I get technical support?
              </Typography>
              <Typography variant="body1" paragraph>
                You can reach our technical support team through the contact form above, 
                email us directly, or use the live chat feature when logged in.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <AdBanner position="content_bottom" />
    </Box>
  );
}

export default ContactPage;