// frontend/src/pages/HomePage.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AdBanner from '../components/Ads/AdBanner';

function HomePage() {
  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Virtual Classrooms',
      description: 'Join interactive online classrooms and connect with teachers and students worldwide.',
    },
    {
      icon: <VideoIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Educational Content',
      description: 'Access a vast library of educational videos, documents, and interactive materials.',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Online Exams',
      description: 'Take secure online exams with instant results and detailed performance analytics.',
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Counseling Support',
      description: 'Get professional counseling and academic guidance from certified experts.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Transform Your Learning Experience
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students and teachers in our comprehensive online education platform
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4,
                py: 1.5
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/about"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Advertisement */}
      <AdBanner position="content_top" />

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Everything You Need to Learn and Teach
        </Typography>
        <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mb: 6 }}>
          Our platform provides comprehensive tools for modern education
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Advertisement */}
      <AdBanner position="content_bottom" />

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
            Join our community today and unlock your potential
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            sx={{ px: 4, py: 1.5 }}
          >
            Sign Up Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;