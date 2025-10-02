import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';

function ClassroomCard({ classroom, onClick }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {classroom.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {classroom.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Schedule: {classroom.schedule?.days} at {classroom.schedule?.time}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClick}>View Classroom</Button>
      </CardActions>
    </Card>
  );
}

// Prop types validation
ClassroomCard.propTypes = {
  classroom: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    schedule: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ClassroomCard;
