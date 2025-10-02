import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Preview as PreviewIcon,
  Send as SendIcon,
  QuestionAnswer as QuestionIcon,
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  AutoMode as AutoGradeIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';

function ExamCreationPage() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    classroom_id: '',
    duration_minutes: 60,
    total_marks: 100,
    passing_marks: 60,
    instructions: '',
    is_scheduled: false,
    start_time: null,
    end_time: null,
    auto_grade: true,
    randomize_questions: false,
    allow_review: true,
    show_results_immediately: false,
    late_submission_penalty: 0,
    max_attempts: 1,
    notification_settings: {
      notify_students: true,
      notify_parents: false,
      reminder_before: 24 // hours
    },
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    marks: 5,
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    difficulty: 'medium',
    tags: []
  });

  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const data = await ApiService.getClassrooms();
      const teacherClassrooms = data.filter(classroom => 
        classroom.teacher_id === user.user_id
      );
      setClassrooms(teacherClassrooms);
    } catch (err) {
      setError('Failed to load classrooms');
    }
  };

  const handleInputChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate end time when start time or duration changes
    if (field === 'start_time' || field === 'duration_minutes') {
      if (examData.start_time && examData.duration_minutes) {
        const startTime = field === 'start_time' ? new Date(value) : new Date(examData.start_time);
        const duration = field === 'duration_minutes' ? value : examData.duration_minutes;
        const endTime = new Date(startTime.getTime() + (duration + 10) * 60000); // Add 10 min buffer
        
        setExamData(prev => ({
          ...prev,
          end_time: endTime
        }));
      }
    }
  };

  const handleNotificationChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      notification_settings: {
        ...prev.notification_settings,
        [field]: value
      }
    }));
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question_text || !currentQuestion.correct_answer) {
      setError('Please fill in question text and correct answer');
      return;
    }

    // Validate options for multiple choice
    if (currentQuestion.question_type === 'multiple_choice') {
      const filledOptions = currentQuestion.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) {
        setError('Multiple choice questions need at least 2 options');
        return;
      }
      
      const correctAnswerIndex = parseInt(currentQuestion.correct_answer);
      if (isNaN(correctAnswerIndex) || correctAnswerIndex < 1 || correctAnswerIndex > filledOptions.length) {
        setError('Correct answer must be a valid option number');
        return;
      }
    }

    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion, id: Date.now() }]
    }));

    // Reset form
    setCurrentQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      marks: 5,
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      difficulty: 'medium',
      tags: []
    });

    setError('');
  };

  const removeQuestion = (questionId) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!examData.title || !examData.classroom_id) {
        setError('Please fill in exam title and select a classroom');
        return;
      }
    } else if (activeStep === 1) {
      if (examData.questions.length === 0) {
        setError('Please add at least one question');
        return;
      }
    } else if (activeStep === 2) {
      if (examData.is_scheduled && !examData.start_time) {
        setError('Please set a start time for scheduled exam');
        return;
      }
    }
    
    setError('');
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleCreateExam = async () => {
    try {
      setLoading(true);
      
      const totalMarks = examData.questions.reduce((sum, q) => sum + q.marks, 0);
      
      const finalExamData = {
        ...examData,
        total_marks: totalMarks,
        questions: examData.questions.map(q => {
          // Remove the temporary ID we added
          const { id, ...questionData } = q;
          return questionData;
        })
      };

      const createdExam = await ApiService.createExam(finalExamData);
      
      setSuccess('Exam created successfully! Students will be notified automatically.');
      
      setTimeout(() => {
        window.location.href = `/exams/${createdExam.exam_id}`;
      }, 2000);
      
    } catch (err) {
      setError('Failed to create exam: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: 'Basic Information',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Exam Title"
              value={examData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              placeholder="e.g., Mid-term Mathematics Exam"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={examData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of what this exam covers..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Classroom</InputLabel>
              <Select
                value={examData.classroom_id}
                label="Classroom"
                onChange={(e) => handleInputChange('classroom_id', e.target.value)}
              >
                {classrooms.map((classroom) => (
                  <MenuItem key={classroom.classroom_id} value={classroom.classroom_id}>
                    {classroom.title} ({classroom.current_students} students)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Duration (minutes)"
              value={examData.duration_minutes}
              onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
              inputProps={{ min: 15, max: 300 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Passing Marks"
              value={examData.passing_marks}
              onChange={(e) => handleInputChange('passing_marks', parseInt(e.target.value))}
              inputProps={{ min: 0 }}
              helperText="Students need this score to pass"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Maximum Attempts"
              value={examData.max_attempts}
              onChange={(e) => handleInputChange('max_attempts', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 5 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Instructions for Students"
              value={examData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              placeholder="Enter any special instructions for the exam..."
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Add Questions',
      content: (
        <Box>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Add New Question</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Question Text"
                    value={currentQuestion.question_text}
                    onChange={(e) => handleQuestionChange('question_text', e.target.value)}
                    placeholder="Enter your question here..."
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Question Type</InputLabel>
                    <Select
                      value={currentQuestion.question_type}
                      label="Question Type"
                      onChange={(e) => handleQuestionChange('question_type', e.target.value)}
                    >
                      <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                      <MenuItem value="true_false">True/False</MenuItem>
                      <MenuItem value="short_answer">Short Answer</MenuItem>
                      <MenuItem value="essay">Essay</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Marks"
                    value={currentQuestion.marks}
                    onChange={(e) => handleQuestionChange('marks', parseInt(e.target.value))}
                    inputProps={{ min: 1, max: 50 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={currentQuestion.difficulty}
                      label="Difficulty"
                      onChange={(e) => handleQuestionChange('difficulty', e.target.value)}
                    >
                      <MenuItem value="easy">Easy</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="hard">Hard</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {currentQuestion.question_type === 'multiple_choice' && (
                  <>
                    {currentQuestion.options.map((option, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <TextField
                          fullWidth
                          label={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Enter option ${index + 1}`}
                        />
                      </Grid>
                    ))}
                  </>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correct Answer"
                    value={currentQuestion.correct_answer}
                    onChange={(e) => handleQuestionChange('correct_answer', e.target.value)}
                    helperText={currentQuestion.question_type === 'multiple_choice' ? 
                      'Enter the option number (1, 2, 3, or 4)' : 
                      'Enter the correct answer'
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Explanation (Optional)"
                    value={currentQuestion.explanation}
                    onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                    placeholder="Explain why this is the correct answer..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addQuestion}
                    sx={{ mr: 2 }}
                  >
                    Add Question
                  </Button>
                  <Typography variant="body2" color="textSecondary" component="span">
                    Questions added: {examData.questions.length}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Questions Added ({examData.questions.length})
            </Typography>
            
            {examData.questions.length === 0 ? (
              <Alert severity="info">
                No questions added yet. Add at least one question to continue.
              </Alert>
            ) : (
              <List>
                {examData.questions.map((question, index) => (
                  <React.Fragment key={question.id}>
                    <ListItem>
                      <ListItemText
                        primary={`Q${index + 1}: ${question.question_text}`}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Chip label={question.question_type} size="small" sx={{ mr: 1 }} />
                            <Chip label={`${question.marks} marks`} size="small" sx={{ mr: 1 }} />
                            <Chip label={question.difficulty} size="small" color="primary" variant="outlined" />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => removeQuestion(question.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < examData.questions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      )
    },
    {
      label: 'Schedule & Settings',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Exam Scheduling
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={examData.is_scheduled}
                  onChange={(e) => handleInputChange('is_scheduled', e.target.checked)}
                />
              }
              label="Schedule this exam for a specific time"
            />
          </Grid>

          {examData.is_scheduled && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Start Time"
                  value={examData.start_time}
                  onChange={(value) => handleInputChange('start_time', value)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDateTime={new Date()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="End Time (Auto-calculated)"
                  value={examData.end_time}
                  renderInput={(params) => <TextField {...params} fullWidth disabled />}
                />
              </Grid>
            </LocalizationProvider>
          )}

          <Grid item xs={12}>
            <Divider />
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Grading Settings
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={examData.auto_grade}
                  onChange={(e) => handleInputChange('auto_grade', e.target.checked)}
                />
              }
              label="Auto-grade objective questions"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={examData.show_results_immediately}
                  onChange={(e) => handleInputChange('show_results_immediately', e.target.checked)}
                />
              }
              label="Show results immediately after submission"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={examData.randomize_questions}
                  onChange={(e) => handleInputChange('randomize_questions', e.target.checked)}
                />
              }
              label="Randomize question order"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={examData.allow_review}
                  onChange={(e) => handleInputChange('allow_review', e.target.checked)}
                />
              }
              label="Allow students to review answers"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Notification Settings
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={examData.notification_settings.notify_students}
                  onChange={(e) => handleNotificationChange('notify_students', e.target.checked)}
                />
              }
              label="Notify students when exam is published"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={examData.notification_settings.notify_parents}
                  onChange={(e) => handleNotificationChange('notify_parents', e.target.checked)}
                />
              }
              label="Notify parents about exam"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Reminder Hours Before Exam"
              value={examData.notification_settings.reminder_before}
              onChange={(e) => handleNotificationChange('reminder_before', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 168 }}
              helperText="Send reminder this many hours before exam starts"
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Review & Create',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Exam Summary
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Basic Information
                  </Typography>
                  <Typography><strong>Title:</strong> {examData.title}</Typography>
                  <Typography><strong>Duration:</strong> {examData.duration_minutes} minutes</Typography>
                  <Typography><strong>Questions:</strong> {examData.questions.length}</Typography>
                  <Typography>
                    <strong>Total Marks:</strong> {examData.questions.reduce((sum, q) => sum + q.marks, 0)}
                  </Typography>
                  <Typography><strong>Passing Marks:</strong> {examData.passing_marks}</Typography>
                  <Typography><strong>Max Attempts:</strong> {examData.max_attempts}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Schedule & Settings
                  </Typography>
                  {examData.is_scheduled ? (
                    <>
                      <Typography>
                        <strong>Start:</strong> {examData.start_time?.toLocaleString()}
                      </Typography>
                      <Typography>
                        <strong>End:</strong> {examData.end_time?.toLocaleString()}
                      </Typography>
                    </>
                  ) : (
                    <Typography color="textSecondary">
                      Manual publishing (not scheduled)
                    </Typography>
                  )}
                  <Typography>
                    <strong>Auto-grade:</strong> {examData.auto_grade ? 'Yes' : 'No'}
                  </Typography>
                  <Typography>
                    <strong>Randomize:</strong> {examData.randomize_questions ? 'Yes' : 'No'}
                  </Typography>
                  <Typography>
                    <strong>Show Results:</strong> {examData.show_results_immediately ? 'Immediately' : 'After grading'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Notifications
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {examData.notification_settings.notify_students && (
                      <Chip icon={<NotificationsIcon />} label="Students will be notified" color="primary" />
                    )}
                    {examData.notification_settings.notify_parents && (
                      <Chip icon={<NotificationsIcon />} label="Parents will be notified" color="secondary" />
                    )}
                    <Chip 
                      label={`Reminder: ${examData.notification_settings.reminder_before}h before`} 
                      variant="outlined" 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewOpen(true)}
            >
              Preview Exam
            </Button>
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Create New Exam
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {step.content}
                
                <Box sx={{ mb: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleCreateExam : handleNext}
                    disabled={loading}
                    sx={{ mr: 1 }}
                    startIcon={index === steps.length - 1 ? <SendIcon /> : null}
                  >
                    {loading ? 'Creating...' : (index === steps.length - 1 ? 'Create Exam' : 'Continue')}
                  </Button>
                  
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Exam Preview</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{examData.title}</Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {examData.description}
          </Typography>
          
          {examData.instructions && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Instructions:</strong> {examData.instructions}
            </Alert>
          )}

          <Typography variant="subtitle1" gutterBottom>
            Time Limit: {examData.duration_minutes} minutes | Total Marks: {examData.questions.reduce((sum, q) => sum + q.marks, 0)}
          </Typography>

          {examData.questions.map((question, index) => (
            <Card key={question.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">
                  Question {index + 1} ({question.marks} marks) - {question.difficulty}
                </Typography>
                <Typography paragraph>
                  {question.question_text}
                </Typography>
                
                {question.question_type === 'multiple_choice' && (
                  <Box>
                    {question.options.filter(opt => opt.trim()).map((option, optIndex) => (
                      <Typography key={optIndex} variant="body2">
                        {optIndex + 1}. {option}
                      </Typography>
                    ))}
                  </Box>
                )}
                
                {question.explanation && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <strong>Explanation:</strong> {question.explanation}
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close Preview</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ExamCreationPage;