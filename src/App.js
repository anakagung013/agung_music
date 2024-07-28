import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { Navbar, Feed, VideoDetail, SearchFeed, ChannelDetail, AlertDialog } from './components';

const App = () => {
  useEffect(() => {
    document.title = "Agung Music - Home"; // Default title for the main page
  }, []);

  return (
    <Router>
      <Box sx={{ backgroundColor: 'white' }}>
        <Navbar />
        <AlertDialog /> {/* Tambahkan AlertDialog di sini */}
        <Routes>
          <Route path="/" exact element={<Feed />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/channel/:id" element={<ChannelDetail />} />
          <Route path="/search/:searchTerm" element={<SearchFeed />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
