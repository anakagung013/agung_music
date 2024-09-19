import React, { useState, useEffect, useRef } from 'react';
import { Paper, IconButton, InputBase, Box, List, ListItem, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { fetchSuggestions } from '../utils/fetchFromAPI'; // Import fungsi fetchSuggestions

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const navigate = useNavigate();
  const searchBarRef = useRef(null);

  useEffect(() => {
    // Mengambil saran saat searchTerm berubah
    if (searchTerm.length > 2) {
      const fetchData = async () => {
        try {
          const results = await fetchSuggestions(searchTerm);
          const suggestions = results.map(item => item.snippet.title);
          setFilteredSuggestions(suggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      };
      fetchData();
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Event listener untuk klik di luar search bar
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setFilteredSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setFilteredSuggestions([]);
    navigate(`/search/${suggestion}`);
  };

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
          transition: 'all 0.3s ease',
          boxShadow: isFocused ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
          transform: isFocused ? 'scale(1.02)' : 'scale(1)',
          position: 'relative',
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={searchBarRef}
      >
        <InputBase
          sx={{ flex: 1, pl: 2, transition: 'width 0.3s ease' }}
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
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <SearchIcon />
        </IconButton>

        {filteredSuggestions.length > 0 && (
          <List
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              maxHeight: '200px',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              borderRadius: '4px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              mt: 1,
              zIndex: 1,
            }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSelectSuggestion(suggestion)}
                sx={{ px: 2, py: 1, '&:hover': { bgcolor: 'grey.200' } }}
              >
                <Typography variant="body2">{suggestion}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default SearchBar;
