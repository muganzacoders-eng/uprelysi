
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';
import {
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`exam-tabpanel-${index}`}
      aria-labelledby={`exam-tab-${index}`}
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

function ExamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

   const fetchExamData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [examData, questionsData, attemptsData] = await Promise.all([
        ApiService.getExam(id),
        ApiService.getExamQuestions(id),
        ApiService.getExamAttempts(id)
      ]);
      
      setExam(examData);
      setQuestions(questionsData);
      setAttempts(attemptsData);
    } catch (err) {
      console.error('Error fetching exam data:', err);
      setError('Failed to load exam data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!id || isNaN(id)) {
    setError('Invalid exam ID');
    return;
  }
  fetchExamData();
}, [id]);


useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const examData = await ApiService.getExam(id);
      setExam(examData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (id && !isNaN(id)) {
    fetchData();
  }
}, [id]);


if (loading) return <CircularProgress />;
if (!exam) return <div>Exam not found</div>;

 

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStartExam = async () => {
    try {
      const attempt = await ApiService.startExam(id);
      navigate(`/exams/${id}/attempt/${attempt.attempt_id}`);
    } catch (err) {
      console.error('Error starting exam:', err);
      setError('Failed to start exam. Please try again.');
    }
  };

  const canTakeExam = () => {
    if (user?.role !== 'student') return false;
    if (!exam?.is_published) return false;
    
    const now = new Date();
    const startTime = new Date(exam.start_time);
    const endTime = new Date(exam.end_time);
    
    return now >= startTime && now <= endTime;
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
        <Button variant="contained" onClick={() => navigate('/exams')}>
          Back to Exams
        </Button>
      </Box>
    );
  }

  if (!exam) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Exam not found</Alert>
        <Button variant="contained" onClick={() => navigate('/exams')} sx={{ mt: 2 }}>
          Back to Exams
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{exam.title}</Typography>
        <Button variant="outlined" onClick={() => navigate('/exams')}>
          Back to Exams
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Exam Information</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip
                label={exam.is_published ? 'Published' : 'Draft'}
                color={exam.is_published ? 'success' : 'default'}
                sx={{ mb: 1 }}
              />
              {exam.status && (
                <Chip
                  label={exam.status}
                  color={
                    exam.status === 'completed' ? 'success' :
                    exam.status === 'ongoing' ? 'warning' : 'info'
                  }
                  sx={{ ml: 1, mb: 1 }}
                />
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Duration: {exam.duration_minutes} minutes
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Total Marks: {exam.total_marks}
                </Typography>
              </Box>

              {exam.passing_marks && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Passing: {exam.passing_marks} marks
                  </Typography>
                </Box>
              )}

              {exam.start_time && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Starts: {new Date(exam.start_time).toLocaleString()}
                  </Typography>
                </Box>
              )}

              {exam.end_time && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Ends: {new Date(exam.end_time).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>

            {canTakeExam() && (
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleStartExam}
              >
                Start Exam
              </Button>
            )}

            {user?.role === 'teacher' && exam.created_by === user.user_id && (
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => navigate(`/exams/${id}/edit`)}
              >
                Edit Exam
              </Button>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Overview" />
              <Tab label="Questions" />
              <Tab label="Attempts" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>Exam Overview</Typography>
              <Typography variant="body2" paragraph>
                {exam.description}
              </Typography>

              {exam.instructions && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Instructions
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {exam.instructions}
                  </Typography>
                </>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Exam Details
              </Typography>
              <Typography variant="body2">
                • Number of questions: {questions.length}
              </Typography>
              <Typography variant="body2">
                • Total marks: {exam.total_marks}
              </Typography>
              {exam.passing_marks && (
                <Typography variant="body2">
                  • Passing marks: {exam.passing_marks}
                </Typography>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>Questions ({questions.length})</Typography>
              {questions.length === 0 ? (
                <Typography color="textSecondary">No questions added yet</Typography>
              ) : (
                <List>
                  {questions.map((question, index) => (
                    <React.Fragment key={question.question_id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="subtitle1">
                                Q{index + 1}: {question.question_text}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Marks: {question.marks} • Type: {question.question_type}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < questions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>Attempt History</Typography>
              {attempts.length === 0 ? (
                <Typography color="textSecondary">No attempts yet</Typography>
              ) : (
                <List>
                  {attempts.map((attempt) => (
                    <ListItem key={attempt.attempt_id} divider>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="subtitle1">
                              Attempt on {new Date(attempt.start_time).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Status: {attempt.status} • Score: {attempt.score || 0}/{exam.total_marks}
                              {attempt.percentage && ` (${attempt.percentage}%)`}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}


export default ExamDetailPage;