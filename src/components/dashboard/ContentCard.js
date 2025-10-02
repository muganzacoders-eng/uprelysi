// frontend/src/components/dashboard/ContentCard.js
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  IconButton
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

function ContentCard({ content, onView, onDownload, onFavorite }) {
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'document': return '📄';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="span">
            {getContentTypeIcon(content.content_type)}
          </Typography>
          <Chip
            label={content.content_type}
            size="small"
            sx={{ ml: 1 }}
          />
          {content.is_paid && (
            <Chip
              label={`$${content.price}`}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          {content.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {content.description?.length > 100
            ? `${content.description.substring(0, 100)}...`
            : content.description
          }
        </Typography>

        {content.categories && content.categories.length > 0 && (
          <Box sx={{ mb: 1 }}>
            {content.categories.slice(0, 2).map((category) => (
              <Chip
                key={category.category_id}
                label={category.name}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
            {content.categories.length > 2 && (
              <Chip
                label={`+${content.categories.length - 2} more`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
            {content.uploader?.first_name?.[0]}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {content.uploader?.first_name} {content.uploader?.last_name}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary" display="block">
          {formatFileSize(content.file_size)} • {new Date(content.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<PlayIcon />}
          onClick={() => onView(content)}
        >
          View
        </Button>
        <Button
          size="small"
          startIcon={<DownloadIcon />}
          onClick={() => onDownload(content)}
        >
          Download
        </Button>
        <IconButton
          size="small"
          onClick={() => onFavorite(content)}
          color={content.is_favorited ? 'primary' : 'default'}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton size="small">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

ContentCard.propTypes = {
  content: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onFavorite: PropTypes.func.isRequired
};

export default ContentCard;