import React, { useState } from 'react';
import { Paper, IconButton, InputBase, Box } from '@mui/material'; // Import Box from Material-UI
import SearchIcon from '@mui/icons-material/Search'; // Using icon from Material-UI
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}> {/* Centering the search bar */}
      <Paper
        component='form'
        onSubmit={handleSubmit}
        elevation={0} // Remove elevation for flat design
        sx={{
          borderRadius: '20px',
          border: '1px solid #e3e3e3',
          display: 'flex',
          alignItems: 'center',
          width: { xs: '100%', md: 'auto' }, // Adjust width based on your layout
          maxWidth: '600px', // Set a maximum width
        }}
      >
        <InputBase
          sx={{ flex: 1, pl: 2 }}
          placeholder='Search a Music'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton type='submit' sx={{ p: '10px', color: 'skyblue' }}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;
