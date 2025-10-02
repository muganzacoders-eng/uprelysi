import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const onboardingSteps = {
  student: [
    {
      label: 'Welcome to Education Support Platform',
      description: 'As a student, you can join classrooms, take exams, access learning materials, and request counseling sessions.',
      action: 'Get Started'
    },
    {
      label: 'Join Your First Classroom',
      description: 'Browse available classrooms and join ones that match your interests and learning goals.',
      action: 'Browse Classrooms',
      path: '/classrooms'
    },
    {
      label: 'Explore Learning Materials',
      description: 'Access our library of educational content to supplement your learning.',
      action: 'Visit Library',
      path: '/library'
    }
  ],
  teacher: [
    {
      label: 'Welcome to Education Support Platform',
      description: 'As a teacher, you can create classrooms, schedule exams, upload content, and conduct online sessions.',
      action: 'Get Started'
    },
    {
      label: 'Create Your First Classroom',
      description: 'Set up a classroom for your students to join and participate in your courses.',
      action: 'Create Classroom',
      path: '/classrooms'
    },
    {
      label: 'Upload Learning Materials',
      description: 'Share educational content with your students through our library.',
      action: 'Upload Content',
      path: '/library'
    }
  ],
  expert: [
    {
      label: 'Welcome to Education Support Platform',
      description: 'As an expert, you can provide counseling sessions to students, set your availability, and help students with their challenges.',
      action: 'Get Started'
    },
    {
      label: 'Set Your Availability',
      description: 'Define when you\'re available for counseling sessions so students can book appointments.',
      action: 'Set Availability',
      path: '/expert/availability'
    },
    {
      label: 'Review Session Requests',
      description: 'Check and accept counseling session requests from students.',
      action: 'View Sessions',
      path: '/counseling'
    }
  ],
  parent: [
    {
      label: 'Welcome to Education Support Platform',
      description: 'As a parent, you can monitor your children\'s progress, view their grades, and stay informed about their education.',
      action: 'Get Started'
    },
    {
      label: 'Add Your Children',
      description: 'Connect your children\'s accounts to your parent account to monitor their progress.',
      action: 'Manage Children',
      path: '/parent/children'
    },
    {
      label: 'View Progress Reports',
      description: 'Check your children\'s academic performance and progress over time.',
      action: 'View Progress',
      path: '/parent/progress'
    }
  ],
  admin: [
    {
      label: 'Welcome to Education Support Platform',
      description: 'As an administrator, you can manage users, monitor system performance, and ensure the platform runs smoothly.',
      action: 'Get Started'
    },
    {
      label: 'Review User Accounts',
      description: 'Manage user accounts, verify new users, and handle account issues.',
      action: 'Manage Users',
      path: '/admin/users'
    },
    {
      label: 'Monitor System Analytics',
      description: 'Check platform usage statistics and performance metrics.',
      action: 'View Analytics',
      path: '/admin/analytics'
    }
  ]
};

function OnboardingModal({ user, onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const steps = onboardingSteps[user?.role] || [];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      onComplete();
    }
  };

  const handleAction = () => {
    if (steps[activeStep].path) {
      navigate(steps[activeStep].path);
    }
    handleNext();
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Modal open={true} onClose={handleSkip}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Paper sx={{ 
          maxWidth: 600, 
          width: '90%', 
          p: 3 
        }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleAction}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {step.action}
                    </Button>
                    <Button
                      onClick={handleSkip}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Skip
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - you&apos;re ready to use the platform!</Typography>
              <Button onClick={onComplete} sx={{ mt: 1, mr: 1 }}>
                Finish
              </Button>
            </Paper>
          )}
        </Paper>
      </Box>
    </Modal>
  );
}

OnboardingModal.propTypes = {
  user: PropTypes.object,
  onComplete: PropTypes.func.isRequired,
};

export default OnboardingModal;