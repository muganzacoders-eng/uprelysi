// frontend/src/components/Ads/AdBanner.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Link,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import ApiService from '../../api';

function AdBanner({ position = 'sidebar_right', maxAds = 3 }) {
  const [ads, setAds] = useState([]);
  const [hiddenAds, setHiddenAds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [position]);

  const fetchAds = async () => {
    try {
      const data = await ApiService.getActiveAds(position);
      setAds(data.slice(0, maxAds));
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (ad) => {
    try {
      await ApiService.trackAdClick(ad.ad_id);
      if (ad.link_url) {
        window.open(ad.link_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to track ad click:', error);
    }
  };

  const handleCloseAd = (adId) => {
    setHiddenAds(prev => new Set(prev).add(adId));
  };

  const visibleAds = ads.filter(ad => !hiddenAds.has(ad.ad_id));

  if (loading || visibleAds.length === 0) {
    return null;
  }

  const getContainerStyles = () => {
    switch (position) {
      case 'header':
        return {
          width: '100%',
          maxHeight: '100px',
          mb: 2
        };
      case 'footer':
        return {
          width: '100%',
          maxHeight: '100px',
          mt: 2
        };
      case 'sidebar_left':
      case 'sidebar_right':
        return {
          width: '300px',
          position: 'sticky',
          top: '20px'
        };
      case 'content_top':
      case 'content_bottom':
        return {
          width: '100%',
          maxHeight: '200px',
          my: 2
        };
      default:
        return {
          width: '300px'
        };
    }
  };

  const containerStyles = getContainerStyles();

  return (
    <Box sx={containerStyles}>
      {visibleAds.map((ad) => (
        <Card
          key={ad.ad_id}
          sx={{
            mb: 1,
            cursor: ad.link_url ? 'pointer' : 'default',
            position: 'relative',
            transition: 'transform 0.2s',
            '&:hover': ad.link_url ? {
              transform: 'translateY(-2px)',
              boxShadow: 3
            } : {}
          }}
          onClick={() => ad.link_url && handleAdClick(ad)}
        >
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCloseAd(ad.ad_id);
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {ad.image_url && (
            <CardMedia
              component="img"
              height={position.includes('sidebar') ? '150' : '120'}
              image={ad.image_url}
              alt={ad.title}
              sx={{ objectFit: 'cover' }}
            />
          )}

          <CardContent sx={{ p: 1.5 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              {ad.title}
            </Typography>
            
            {ad.description && (
              <Typography variant="caption" color="text.secondary" display="block">
                {ad.description.length > 80 
                  ? `${ad.description.substring(0, 80)}...` 
                  : ad.description
                }
              </Typography>
            )}

            <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
              Advertisement
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

AdBanner.propTypes = {
  position: PropTypes.oneOf([
    'header',
    'footer', 
    'sidebar_left',
    'sidebar_right',
    'content_top',
    'content_bottom'
  ]),
  maxAds: PropTypes.number
};

export default AdBanner;