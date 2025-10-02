import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function ProgressChart({ 
  studentProgress, 
  examResults, 
  title = "Student Progress Analytics" 
}) {
  // Process data for different chart types
  const processGradeDistribution = () => {
    if (!examResults || examResults.length === 0) return [];
    
    const gradeRanges = {
      'A (90-100%)': 0,
      'B (80-89%)': 0,
      'C (70-79%)': 0,
      'D (60-69%)': 0,
      'F (0-59%)': 0
    };

    examResults.forEach(result => {
      const percentage = result.percentage || 0;
      if (percentage >= 90) gradeRanges['A (90-100%)']++;
      else if (percentage >= 80) gradeRanges['B (80-89%)']++;
      else if (percentage >= 70) gradeRanges['C (70-79%)']++;
      else if (percentage >= 60) gradeRanges['D (60-69%)']++;
      else gradeRanges['F (0-59%)']++;
    });

    return Object.entries(gradeRanges).map(([name, value]) => ({
      name,
      value,
      percentage: examResults.length > 0 ? ((value / examResults.length) * 100).toFixed(1) : 0
    }));
  };

  const processPerformanceTrend = () => {
    if (!examResults || examResults.length === 0) return [];
    
    return examResults
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .map((result, index) => ({
        exam: `Exam ${index + 1}`,
        score: result.percentage || 0,
        date: new Date(result.start_time).toLocaleDateString()
      }));
  };

  const processSubjectPerformance = () => {
    if (!examResults || examResults.length === 0) return [];
    
    // Group by subject/classroom if available
    const subjectData = {};
    examResults.forEach(result => {
      const subject = result.Exam?.ExamClassroom?.title || 'General';
      if (!subjectData[subject]) {
        subjectData[subject] = { total: 0, count: 0 };
      }
      subjectData[subject].total += result.percentage || 0;
      subjectData[subject].count += 1;
    });

    return Object.entries(subjectData).map(([subject, data]) => ({
      subject,
      average: (data.total / data.count).toFixed(1),
      count: data.count
    }));
  };

  const gradeDistribution = processGradeDistribution();
  const performanceTrend = processPerformanceTrend();
  const subjectPerformance = processSubjectPerformance();

  const calculateStats = () => {
    if (!examResults || examResults.length === 0) {
      return { average: 0, highest: 0, lowest: 0, improvement: 0 };
    }

    const scores = examResults.map(r => r.percentage || 0);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    
    // Calculate improvement (compare first vs last 3 exams)
    let improvement = 0;
    if (scores.length >= 6) {
      const firstThree = scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
      const lastThree = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
      improvement = lastThree - firstThree;
    }

    return { 
      average: average.toFixed(1), 
      highest: highest.toFixed(1), 
      lowest: lowest.toFixed(1), 
      improvement: improvement.toFixed(1) 
    };
  };

  const stats = calculateStats();

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center">
        {title}
      </Typography>

      {/* Summary Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.average}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Average Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.highest}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Highest Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {stats.lowest}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Lowest Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                color={parseFloat(stats.improvement) >= 0 ? "success.main" : "error.main"}
              >
                {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Improvement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Grade Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Grade Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performance Trend Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="exam" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Subject Performance Bar Chart */}
        {subjectPerformance.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Subject Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Average Score']}
                  />
                  <Legend />
                  <Bar dataKey="average" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

ProgressChart.propTypes = {
  studentProgress: PropTypes.object,
  examResults: PropTypes.array,
  title: PropTypes.string
};

export default ProgressChart;