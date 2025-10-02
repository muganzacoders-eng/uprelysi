import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';

function ExamCard({ exam, onClick }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {exam.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {exam.date}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Duration: {exam.duration}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClick}>View Exam</Button>
      </CardActions>
    </Card>
  );
}

// Prop types validation
ExamCard.propTypes = {
  exam: PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ExamCard;
