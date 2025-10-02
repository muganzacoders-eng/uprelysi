import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  EmojiEvents as AwardIcon
} from '@mui/icons-material';
import AdBanner from '../components/Ads/AdBanner';

function AboutPage() {
  const stats = [
    { icon: <PeopleIcon />, number: '50,000+', label: 'Active Users' },
    { icon: <SchoolIcon />, number: '1,000+', label: 'Courses' },
    { icon: <AwardIcon />, number: '95%', label: 'Success Rate' }
  ];

  const team = [
    { name: 'Dr. Sarah Johnson', role: 'CEO & Founder', avatar: '/images/team1.webp' },
    { name: 'Prof. Michael Chen', role: 'Head of Education', avatar: '/images/team3.webp' },
    { name: 'Lisa Rodriguez', role: 'CTO', avatar: '/images/team2.webp' }
  ];

  return (
    <Box>
      <AdBanner position="content_top" />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            About Education Support System
          </Typography>
          <Typography variant="h5" color="textSecondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            We&apos;re revolutionizing education by making quality learning accessible to everyone, 
            everywhere, through innovative technology and dedicated support.
          </Typography>
        </Box>

        {/* Mission Section */}
        <Paper sx={{ p: 6, mb: 6, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h3" component="h2" gutterBottom textAlign="center">
            Our Mission
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ maxWidth: 800, mx: 'auto' }}>
            To democratize education by providing comprehensive, accessible, and engaging 
            learning experiences that empower students, support teachers, and strengthen 
            educational communities worldwide.
          </Typography>
        </Paper>

        {/* Stats Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 60 } })}
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" gutterBottom>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Story Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom textAlign="center">
            Our Story
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                Founded in 2020, Education Support System emerged from a simple yet powerful idea: 
                that every student deserves access to quality education, regardless of their location 
                or circumstances.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                Our platform was born during the global pandemic when traditional education faced 
                unprecedented challenges. We saw the need for a comprehensive solution that could 
                bridge the gap between students and teachers in the digital age.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                Today, we serve thousands of students and educators worldwide, providing not just 
                technology, but a complete ecosystem for learning, teaching, and growing together.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  [Company Story Image]
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom textAlign="center">
            Meet Our Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <CardContent>
                    <Avatar
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                      src={member.avatar}
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Values Section */}
        <Paper sx={{ p: 6, bgcolor: 'grey.50' }}>
          <Typography variant="h3" component="h2" gutterBottom textAlign="center">
            Our Values
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom color="primary">
                Accessibility
              </Typography>
              <Typography variant="body1">
                We believe education should be available to everyone, regardless of background, 
                location, or circumstances.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom color="primary">
                Innovation
              </Typography>
              <Typography variant="body1">
                We continuously evolve our platform with cutting-edge technology to enhance 
                the learning experience.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom color="primary">
                Community
              </Typography>
              <Typography variant="body1">
                We foster a supportive community where students, teachers, and parents can 
                connect and grow together.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <AdBanner position="content_bottom" />
    </Box>
  );
}

export default AboutPage;