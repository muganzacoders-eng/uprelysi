import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  People as PeopleIcon, 
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';
import GoogleMeetButton from '../../components/meet/GoogleMeetButton';


// Add PropTypes validation for TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`classroom-tabpanel-${index}`}
      aria-labelledby={`classroom-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

TabPanel.defaultProps = {
  children: null,
};

function ClassroomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchClassroomData();
  }, [id]);


  const fetchClassroomData = async () => {
  try {
    setLoading(true);
    setError('');
    
    const classroomData = await ApiService.getClassroom(id);
    setClassroom(classroomData);
    
    // Get students from classroom data
    const studentsData = classroomData.Enrollments || [];
    setStudents(studentsData.map(enrollment => enrollment.Student));
    
    // Get exams for this classroom
    const allExams = await ApiService.getExams();
    const classroomExams = allExams.filter(exam => exam.classroom_id == id);
    setExams(classroomExams);
  } catch (err) {
    console.error('Error fetching classroom data:', err);
    setError('Failed to load classroom data. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/classrooms')}>
          Back to Classrooms
        </Button>
      </Box>
    );
  }

  if (!classroom) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Classroom not found</Alert>
        <Button variant="contained" onClick={() => navigate('/classrooms')} sx={{ mt: 2 }}>
          Back to Classrooms
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{classroom.title}</Typography>
        <Button variant="outlined" onClick={() => navigate('/classrooms')}>
          Back to Classrooms
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Classroom Information</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {classroom.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip 
                icon={<PeopleIcon />} 
                label={`${classroom.current_students} students`} 
                variant="outlined" 
                sx={{ mr: 1, mb: 1 }}
              />
              {classroom.is_active && (
                <Chip label="Active" color="success" sx={{ mb: 1 }} />
              )}
            </Box>
            {classroom.schedule && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Schedule:</Typography>
                <Typography variant="body2">
                  {typeof classroom.schedule === 'string' 
                    ? classroom.schedule 
                    : JSON.stringify(classroom.schedule)}
                </Typography>
              </Box>
            )}

              {/* ✅ Google Meet Button for Teachers/Admins */}
              {user && (user.role === 'teacher' || user.role === 'admin') && (
  <GoogleMeetButton
    type="classroom"
    entityId={classroom.classroom_id}
    entityName={classroom.title}
    onMeetingCreated={(meetingUrl) => {
      // Handle meeting creation (e.g., show notification)
      console.log('Meeting created:', meetingUrl);
    }}
  />
)}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Students" />
              <Tab label="Exams" />
              <Tab label="Details" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>Enrolled Students</Typography>
              {students.length === 0 ? (
                <Typography color="textSecondary">No students enrolled yet</Typography>
              ) : (
                <List>
                  {students.map((student) => (
                    <ListItem key={student.user_id} divider>
                      <ListItemAvatar>
                        <Avatar src={student.profile_picture_url}>
                          {student.first_name?.[0]}{student.last_name?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${student.first_name} ${student.last_name}`}
                        secondary={student.email}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>Exams</Typography>
              {exams.length === 0 ? (
                <Typography color="textSecondary">No exams scheduled yet</Typography>
              ) : (
                <Grid container spacing={2}>
                  {exams.map((exam) => (
                    <Grid item xs={12} sm={6} key={exam.exam_id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{exam.title}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {exam.description}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Duration: {exam.duration_minutes} minutes
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ mt: 1 }}
                            onClick={() => navigate(`/exams/${exam.exam_id}`)}
                          >
                            View Exam
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>Classroom Details</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Teacher:</strong> {classroom.Teacher?.first_name} {classroom.Teacher?.last_name}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Created:</strong> {new Date(classroom.created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Max Students:</strong> {classroom.max_students || 'Unlimited'}
                </Typography>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ClassroomDetailPage;