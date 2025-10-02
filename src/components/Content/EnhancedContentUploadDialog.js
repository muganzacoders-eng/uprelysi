// frontend/src/components/Content/EnhancedContentUploadDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert,
  LinearProgress,
  Chip,
  Box,
  IconButton,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import ApiService from '../../api';

function EnhancedContentUploadDialog({ open, onClose, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: '',
    categories: [],
    is_paid: false,
    price: 0,
    duration: '',
    difficulty_level: 'beginner',
    tags: []
  });
  
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (open) {
      fetchCategories();
      resetForm();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const data = await ApiService.getContentCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content_type: '',
      categories: [],
      is_paid: false,
      price: 0,
      duration: '',
      difficulty_level: 'beginner',
      tags: []
    });
    setFile(null);
    setUploadProgress(0);
    setError('');
    setSuccess('');
    setTagInput('');
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      categories: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file size (50MB limit)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }

      // Auto-detect content type
      const fileType = selectedFile.type;
      let contentType = '';
      
      if (fileType.startsWith('video/')) {
        contentType = 'video';
      } else if (fileType.startsWith('audio/')) {
        contentType = 'audio';
      } else if (fileType.includes('pdf')) {
        contentType = 'document';
      } else if (fileType.startsWith('image/')) {
        contentType = 'image';
      } else {
        contentType = 'document';
      }

      setFile(selectedFile);
      setFormData(prev => ({
        ...prev,
        content_type: contentType
      }));
      setError('');
    }
  };

  const handleTagAdd = (event) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!file) {
      setError('Please select a file to upload');
      return false;
    }
    if (formData.categories.length === 0) {
      setError('Please select at least one category');
      return false;
    }
    if (formData.is_paid && (!formData.price || formData.price <= 0)) {
      setError('Please enter a valid price for paid content');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key === 'categories' || key === 'tags') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add file
      submitData.append('file', file);

      // Create XMLHttpRequest for upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      });

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
      });

      const token = localStorage.getItem('token');
      xhr.open('POST', `${process.env.REACT_APP_API_URL || 'https://educationapi-n33q.onrender.com'}/api/content`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(submitData);

      await uploadPromise;

      setSuccess('Content uploaded successfully!');
      setTimeout(() => {
        onUploadSuccess();
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contentTypes = [
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'document', label: 'Document' },
    { value: 'image', label: 'Image' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'other', label: 'Other' }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Upload Educational Content
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {loading && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{ width: '100%' }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Title"
                value={formData.title}
                onChange={handleInputChange('title')}
                disabled={loading}
                placeholder="Enter a descriptive title for your content"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                disabled={loading}
                placeholder="Provide a detailed description of the content"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={loading}>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={formData.content_type}
                  label="Content Type"
                  onChange={handleInputChange('content_type')}
                >
                  {contentTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={formData.difficulty_level}
                  label="Difficulty Level"
                  onChange={handleInputChange('difficulty_level')}
                >
                  {difficultyLevels.map(level => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Categories */}
            <Grid item xs={12}>
              <FormControl fullWidth required disabled={loading}>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={formData.categories}
                  onChange={handleCategoryChange}
                  label="Categories"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const category = categories.find(cat => cat.category_id === value);
                        return (
                          <Chip key={value} label={category?.name || value} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.category_id} value={category.category_id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                File Upload
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main' }
                }}
                component="label"
              >
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  disabled={loading}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                />
                <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {file ? file.name : 'Click to select file'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: PDF, DOC, PPT, MP4, MP3, Images (Max 50MB)
                </Typography>
              </Box>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (optional)"
                value={formData.duration}
                onChange={handleInputChange('duration')}
                disabled={loading}
                placeholder="e.g., 30 minutes, 2 hours"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_paid}
                    onChange={handleInputChange('is_paid')}
                    disabled={loading}
                  />
                }
                label="Paid Content"
              />
            </Grid>

            {formData.is_paid && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  value={formData.price}
                  onChange={handleInputChange('price')}
                  disabled={loading}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </Grid>
            )}

            {/* Tags */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (Press Enter to add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                disabled={loading}
                placeholder="Add tags to help users find your content"
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagRemove(tag)}
                    size="small"
                    disabled={loading}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? null : <UploadIcon />}
          >
            {loading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Content'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EnhancedContentUploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func.isRequired
};

export default EnhancedContentUploadDialog;