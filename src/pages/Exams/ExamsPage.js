// frontend/src/pages/Exams/ExamsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';
import AdBanner from '../../components/Ads/AdBanner';

function ExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    total_marks: 100,
    passing_marks: 60,
    instructions: '',
    is_active: true,
    questions: []
  });

  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    marks: 1
  });

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const fetchExams = async () => {
    try {
      const data = await ApiService.getExams();
      setExams(data);
    } catch (err) {
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async () => {
    try {
      await ApiService.createExam(formData);
      setSuccess('Exam created successfully!');
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        duration: 60,
        total_marks: 100,
        passing_marks: 60,
        instructions: '',
        is_active: true,
        questions: []
      });
      fetchExams();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create exam');
    }
  };

  const handleStartExam = async (exam) => {
    try {
      const examData = await ApiService.getExam(exam.exam_id);
      setCurrentExam(examData);
      setTimeLeft(examData.duration * 60);
      setExamStarted(true);
      setExamDialogOpen(true);
      setAnswers({});
    } catch (err) {
      setError('Failed to start exam');
    }
  };

  const handleSubmitExam = async () => {
    try {
      await ApiService.submitExam(currentExam.exam_id, answers);
      setSuccess('Exam submitted successfully!');
      setExamDialogOpen(false);
      setExamStarted(false);
      setCurrentExam(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to submit exam');
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion, id: Date.now() }]
    }));
    setNewQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      marks: 1
    });
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AdBanner position="content_top" />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Exams</Typography>
        {user?.role === 'teacher' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Create Exam
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <AdBanner position="sidebar_left" />
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {exams.map((exam) => (
              <Grid item xs={12} key={exam.exam_id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {exam.title}
                      </Typography>
                      <Chip
                        label={exam.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        color={exam.is_active ? 'success' : 'default'}
                      />
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {exam.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimerIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        <Typography variant="caption">
                          {exam.duration} minutes
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AssignmentIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        <Typography variant="caption">
                          {exam.total_marks} marks
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="caption" color="textSecondary">
                      Passing: {exam.passing_marks} marks
                    </Typography>
                  </CardContent>

                  <CardActions>
                    {user?.role === 'student' && exam.is_active && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<StartIcon />}
                        onClick={() => handleStartExam(exam)}
                      >
                        Start Exam
                      </Button>
                    )}

                    {user?.userId === exam.created_by && (
                      <>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}

                    <Button size="small">
                      View Results
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <AdBanner position="sidebar_right" />
        </Grid>
      </Grid>

      {/* Create Exam Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Create New Exam</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Exam Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Total Marks"
                value={formData.total_marks}
                onChange={(e) => setFormData({...formData, total_marks: parseInt(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Passing Marks"
                value={formData.passing_marks}
                onChange={(e) => setFormData({...formData, passing_marks: parseInt(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              />
            </Grid>

            {/* Question Builder */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Questions ({formData.questions.length})
              </Typography>
              
              <Card sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Add New Question
                </Typography>
                
                <TextField
                  fullWidth
                  label="Question Text"
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={newQuestion.question_type}
                    label="Question Type"
                    onChange={(e) => setNewQuestion({...newQuestion, question_type: e.target.value})}
                  >
                    <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                    <MenuItem value="true_false">True/False</MenuItem>
                    <MenuItem value="short_answer">Short Answer</MenuItem>
                  </Select>
                </FormControl>

                {newQuestion.question_type === 'multiple_choice' && (
                  <Box sx={{ mb: 2 }}>
                    {newQuestion.options.map((option, index) => (
                      <TextField
                        key={index}
                        fullWidth
                        label={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOptions});
                        }}
                        sx={{ mb: 1 }}
                      />
                    ))}
                    <TextField
                      fullWidth
                      label="Correct Answer"
                      value={newQuestion.correct_answer}
                      onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                    />
                  </Box>
                )}

                <TextField
                  type="number"
                  label="Marks"
                  value={newQuestion.marks}
                  onChange={(e) => setNewQuestion({...newQuestion, marks: parseInt(e.target.value)})}
                  sx={{ width: 100, mr: 2 }}
                />

                <Button variant="outlined" onClick={addQuestion}>
                  Add Question
                </Button>
              </Card>

              {/* Questions List */}
              {formData.questions.map((question, index) => (
                <Card key={question.id} sx={{ p: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        Q{index + 1}: {question.question_text}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Type: {question.question_type} | Marks: {question.marks}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeQuestion(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateExam} variant="contained">
            Create Exam
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exam Taking Dialog */}
      <Dialog open={examDialogOpen} onClose={false} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {currentExam?.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'error.main', color: 'white', px: 2, py: 1, borderRadius: 1 }}>
              <TimerIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {currentExam && (
            <Box>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {currentExam.instructions}
              </Typography>

              {currentExam.questions?.map((question, index) => (
                <Card key={question.question_id} sx={{ mb: 2, p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Q{index + 1}: {question.question_text}
                  </Typography>

                  {question.question_type === 'multiple_choice' && (
                    <RadioGroup
                      value={answers[question.question_id] || ''}
                      onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                    >
                      {question.options?.map((option, optIndex) => (
                        <FormControlLabel
                          key={optIndex}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  )}

                  {question.question_type === 'true_false' && (
                    <RadioGroup
                      value={answers[question.question_id] || ''}
                      onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="True" />
                      <FormControlLabel value="false" control={<Radio />} label="False" />
                    </RadioGroup>
                  )}

                  {question.question_type === 'short_answer' && (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={answers[question.question_id] || ''}
                      onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                      placeholder="Enter your answer here..."
                    />
                  )}

                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    Marks: {question.marks}
                  </Typography>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitExam} variant="contained" color="primary">
            Submit Exam
          </Button>
        </DialogActions>
      </Dialog>

      <AdBanner position="content_bottom" />
    </Box>
  );
}

export default ExamsPage;