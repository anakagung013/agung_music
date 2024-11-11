import { CheckCircle } from '@mui/icons-material';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Avatar, 
  Stack 
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  demoChannelTitle,
  demoChannelUrl,
  demoVideoTitle,
  demoVideoUrl
} from '../utils/constant';

const VideoCard = ({
  video: {
    id: { videoId },
    snippet
  }
}) => {
  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '358px', md: '320px' },
        borderRadius: '16px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: '#1e1e1e',
        color: 'white',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
        }
      }}
      elevation={3}
    >
      <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
        <CardMedia
          component="img"
          image={snippet?.thumbnails?.high?.url}
          alt={snippet?.title}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }}
        />
      </Link>
      <CardContent 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          p: 2 
        }}
      >
        <Avatar 
          src={snippet?.thumbnails?.default?.url}
          sx={{ 
            width: 50, 
            height: 50, 
            border: '2px solid #3f3f3f' 
          }}
        />
        <Box>
          <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
            <Typography 
              variant='subtitle1' 
              fontWeight='bold' 
              color='white'
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {snippet?.title.slice(0, 60) || demoVideoTitle.slice(0, 60)}
            </Typography>
          </Link>
          <Link
            to={snippet?.channelId ? `/channel/${snippet?.channelId}` : demoChannelUrl}
          >
            <Stack 
              direction="row" 
              alignItems="center" 
              gap={1}
              sx={{ mt: 0.5 }}
            >
              <Typography 
                variant='subtitle2' 
                color='#a0a0a0'
                sx={{ 
                  fontWeight: 500,
                  '&:hover': {
                    color: 'white'
                  }
                }}
              >
                {snippet?.channelTitle || demoChannelTitle}
              </Typography>
              <CheckCircle 
                sx={{ 
                  fontSize: 14, 
                  color: '#3f3f3f' 
                }} 
              />
            </Stack>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoCard;