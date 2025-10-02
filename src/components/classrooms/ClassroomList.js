import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText, Divider, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function ClassroomList({ classrooms }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Classrooms
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {classrooms.map((classroom, index) => (
          <React.Fragment key={classroom.id}>
            <ListItem alignItems="flex-start" component={Link} to={`/classrooms/${classroom.id}`}>
              <ListItemText
                primary={classroom.title}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {classroom.description}
                    </Typography>
                    <br />
                    {classroom.schedule?.days} at {classroom.schedule?.time}
                  </>
                }
              />
            </ListItem>
            {index < classrooms.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}


ClassroomList.propTypes = {
  classrooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      schedule: PropTypes.string,
    })
  ).isRequired,
};

ClassroomList.defaultProps = {
  classrooms: [],
};


export default ClassroomList;
