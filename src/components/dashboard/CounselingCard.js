import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';

function CounselingCard({ session, onClick }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Session with {session.expert}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {session.date}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Time: {session.time}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClick}>View Details</Button>
      </CardActions>
    </Card>
  );
}

// Prop types validation
CounselingCard.propTypes = {
  session: PropTypes.shape({
    expert: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CounselingCard;
