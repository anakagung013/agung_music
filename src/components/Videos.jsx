import React from 'react';
import { Box, Stack, CircularProgress, Typography } from '@mui/material'; // Menggunakan komponen dari Material-UI
import { isMobile } from 'react-device-detect'; // Menambahkan import untuk mendeteksi perangkat mobile

import { VideoCard, ChannelCard } from './';

const Videos = ({ videos, direction }) => {
  if (isMobile) {
    return (
      <Stack justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" mt={2} textAlign="center" color="error">
          Sorry, you are using a mobile device. Please visit this website using a Desktop Device.
        </Typography>
      </Stack>
    );
  }

  if (!videos?.length) {
    return (
      <Stack justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress color="primary" />
        <Typography variant="body1" mt={2} textAlign="center">
          Loading...
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      direction={direction || 'row'}
      flexWrap='wrap'
      justifyContent='center'
      gap={2}
    >
      {videos
        .filter((item) => item.id.videoId || item.id.channelId)
        .map((item, index) => (
          <Box key={index}>
            {item.id.videoId && <VideoCard video={item} />}
            {item.id.channelId && <ChannelCard channelDetail={item} />}
          </Box>
        ))}
    </Stack>
  );
};

export default Videos;
