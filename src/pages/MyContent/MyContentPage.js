import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Rating,
  Fab
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Add as AddIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  ChildCare as ChildCareIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../api';
import PropTypes from 'prop-types';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

function VideoCard({ video, onPlay, onToggleFavorite, isLiked }) {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={video.thumbnail_url || 'https://via.placeholder.com/400x200'}
          alt={video.title}
          sx={{ cursor: 'pointer' }}
          onClick={() => onPlay(video)}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem'
          }}
        >
          {formatDuration(video.duration)}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer'
          }}
          onClick={() => onPlay(video)}
        >
          <PlayIcon 
            sx={{ 
              fontSize: 60, 
              color: 'white',
              opacity: 0.8,
              '&:hover': { opacity: 1 }
            }} 
          />
        </Box>
        {video.is_paid && (
          <Chip
            label={`$${video.price}`}
            color="warning"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8
            }}
          />
        )}
      </Box>

      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          fontSize: '1rem',
          fontWeight: 600,
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {video.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            src={video.instructor?.avatar} 
            sx={{ width: 24, height: 24, mr: 1 }}
          >
            {video.instructor?.name?.[0]}
          </Avatar>
          <Typography variant="body2" color="textSecondary">
            {video.instructor?.name || 'Unknown Instructor'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Rating value={video.rating || 0} readOnly size="small" />
          <Typography variant="caption" color="textSecondary">
            {video.views || 0} views
          </Typography>
        </Box>

        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {video.tags?.slice(0, 2).map((tag, index) => (
            <Chip 
              key={index}
              label={tag} 
              size="small" 
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button 
          size="small" 
          startIcon={<PlayIcon />}
          variant="contained"
          onClick={() => onPlay(video)}
        >
          Watch
        </Button>
        <Box>
          <IconButton 
            size="small"
            onClick={() => onToggleFavorite(video.content_id)}
            color={isLiked ? "error" : "default"}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton size="small">
            <ShareIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}

VideoCard.propTypes = {
  video: PropTypes.object.isRequired,
  onPlay: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isLiked: PropTypes.bool
};

function MyContentPage() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const { user } = useAuth();

  const categories = [
    { id: 0, label: 'All Videos', icon: <SchoolIcon /> },
    { id: 1, label: 'Teaching Methods', icon: <SchoolIcon /> },
    { id: 2, label: 'Child Development', icon: <ChildCareIcon /> },
    { id: 3, label: 'Coding Classes', icon: <CodeIcon /> },
    { id: 4, label: 'Design & Graphics', icon: <PaletteIcon /> },
    { id: 5, label: 'Counseling Services', icon: <PsychologyIcon />, isPaid: true }
  ];

  // Sample data - replace with actual API calls
  const sampleVideos = [
    {
      content_id: 1,
      title: "Effective Teaching Strategies for Primary School",
      description: "Learn proven methods to engage young learners",
      duration: 1200,
      thumbnail_url: "https://via.placeholder.com/400x200",
      category: "Teaching Methods",
      instructor: { name: "Dr. Sarah Johnson", avatar: "https://via.placeholder.com/40x40" },
      rating: 4.8,
      views: 15420,
      tags: ["Teaching", "Primary", "Engagement"],
      is_paid: false,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      content_id: 2,
      title: "Introduction to Child Psychology",
      description: "Understanding developmental stages in children",
      duration: 1800,
      thumbnail_url: "https://via.placeholder.com/400x200",
      category: "Child Development",
      instructor: { name: "Prof. Mike Chen", avatar: "https://via.placeholder.com/40x40" },
      rating: 4.6,
      views: 8930,
      tags: ["Psychology", "Development", "Children"],
      is_paid: false,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      content_id: 3,
      title: "Python for Beginners - Complete Course",
      description: "Learn programming from scratch with hands-on projects",
      duration: 7200,
      thumbnail_url: "https://via.placeholder.com/400x200",
      category: "Coding Classes",
      instructor: { name: "Alex Rodriguez", avatar: "https://via.placeholder.com/40x40" },
      rating: 4.9,
      views: 25610,
      tags: ["Python", "Programming", "Beginners"],
      is_paid: true,
      price: 49.99,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
      content_id: 4,
      title: "Advanced Counseling Techniques",
      description: "Professional counseling methods for educators",
      duration: 2400,
      thumbnail_url: "https://via.placeholder.com/400x200",
      category: "Counseling Services",
      instructor: { name: "Dr. Lisa Williams", avatar: "https://via.placeholder.com/40x40" },
      rating: 4.7,
      views: 5240,
      tags: ["Counseling", "Professional", "Techniques"],
      is_paid: true,
      price: 79.99,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      // Replace with actual API call when ready
      // const data = await ApiService.getMyContentVideos();
      setTimeout(() => {
        setVideos(sampleVideos);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load videos');
      console.error(err);
      setLoading(false);
    }
  };

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleToggleFavorite = (videoId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(videoId)) {
        newFavorites.delete(videoId);
      } else {
        newFavorites.add(videoId);
      }
      return newFavorites;
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = tabValue === 0 || video.category === categories[tabValue].label;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          My Content Hub
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Educational videos, tutorials, and premium content for learning and development
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search videos, courses, and tutorials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: 3
            }
          }}
        />
      </Paper>

      {/* Category Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 60,
              textTransform: 'none',
              fontWeight: 500
            }
          }}
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              icon={category.icon}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {category.label}
                  {category.isPaid && (
                    <Chip 
                      label="Premium" 
                      size="small" 
                      color="warning"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              }
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Video Grid */}
      <Grid container spacing={3}>
        {filteredVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.content_id}>
            <VideoCard
              video={video}
              onPlay={handlePlayVideo}
              onToggleFavorite={handleToggleFavorite}
              isLiked={favorites.has(video.content_id)}
            />
          </Grid>
        ))}
      </Grid>

      {filteredVideos.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            No videos found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Try adjusting your search or browse different categories
          </Typography>
        </Box>
      )}

      {/* Video Player Dialog */}
      <Dialog
        open={!!selectedVideo}
        onClose={handleCloseVideo}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { bgcolor: 'black' }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedVideo && (
            <Box sx={{ position: 'relative', width: '100%', height: '70vh' }}>
              <video
                src={selectedVideo.video_url}
                controls
                autoPlay
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
              <IconButton
                onClick={handleCloseVideo}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)'
                }}
              >
                ✕
              </IconButton>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload FAB for teachers */}
      {user?.role === 'teacher' && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16
          }}
          onClick={() => {/* Handle upload */}}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

export default MyContentPage;