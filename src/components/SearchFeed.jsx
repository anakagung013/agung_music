import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Videos } from './';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { useParams } from 'react-router-dom';
import { locales } from '../locales'; // Import objek locales


const SearchFeed = () => {
  const [videos, setVideos] = useState([]);
  const { searchTerm } = useParams();

  useEffect(() => {
    fetchFromAPI(`search?part=snippet&q=${searchTerm}`).then((data) =>
      setVideos(data.items)
    );
  }, [searchTerm]);

  return (
    <Box p={2} sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100vh' }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        sx={{ color: '#1d1d1d' }}
      >
        Search Results for: <span style={{ color: 'skyblue' }}>{searchTerm}</span> videos
      </Typography>

      <Box sx={{ flex: 1 }}> {/* Use flex to expand content area */}
        <Videos videos={videos} />
      </Box>
    </Box>
  );
};

export default SearchFeed;
