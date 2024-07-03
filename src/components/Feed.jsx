import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Sidebar, Videos } from './';
import { fetchFromAPI } from '../utils/fetchFromAPI';

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState('New');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchFromAPI(`search?part=snippet&q=${selectedCategory}`).then((data) =>
      setVideos(data.items)
    );
  }, [selectedCategory]);

  return (
    <Stack
      sx={{
        flexDirection: { sx: 'column', md: 'row' },
        position: { lg: 'fixed' }
      }}
    >
      <Box
        sx={{
          height: { sx: 'auto', md: 'calc(100vh - 78px)' },
          borderRight: '1px solid #dddddd',
          px: { sx: 0, md: 2 }
        }}
      >
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Typography
          className='copyright'
          variant='body2'
          sx={{ mt: 1.5, color: '#1d1d1d' }}
        >
          Copyright &copy; {new Date().getFullYear()} Agung Music
        </Typography>
      </Box>

      <Box
        p={2}
        sx={{ overflowY: 'auto', height: 'calc(100vh - 78px)', flex: 2 }}
      >
        <Typography
          variant='h4'
          fontWeight='bold'
          mb={2}
          sx={{ color: '#1d1d1d' }}
        >
          {selectedCategory} <span style={{ color: 'skyblue' }}>videos</span>
        </Typography>

        <Videos videos={videos} />
      </Box>
    </Stack>
  );
};

export default Feed;
