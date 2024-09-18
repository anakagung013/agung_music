import React, { useState } from 'react';
import { Paper, IconButton, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false); // State to handle focus
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
      <Paper
        component='form'
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          borderRadius: '26px',
          border: '1px solid #e3e3e3',
          display: 'flex',
          alignItems: 'center',
          width: { xs: '100%', md: '900px' },
          maxWidth: '600px',
          transition: 'all 0.3s ease', // Smooth transition for focus effect
          boxShadow: isFocused ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none', // Box shadow on focus
          transform: isFocused ? 'scale(1.02)' : 'scale(1)', // Slightly enlarge on focus
        }}
        onFocus={() => setIsFocused(true)} // Set focus state to true
        onBlur={() => setIsFocused(false)} // Set focus state to false
      >
        <InputBase
          sx={{ flex: 1, pl: 2, transition: 'width 0.3s ease' }} // Smooth width transition
          placeholder='Search a Music'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <IconButton
          type='submit'
          sx={{
            p: '10px',
            color: 'skyblue',
            transition: 'transform 0.3s ease', // Smooth transition for button
            '&:hover': {
              transform: 'scale(1.1)', // Slightly enlarge on hover
            },
          }}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;
