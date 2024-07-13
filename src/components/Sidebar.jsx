import React from 'react';
import { Box, Button, Typography } from '@mui/material'; // Menggunakan komponen dari Material-UI

import { categories } from '../utils/constant';

const Sidebar = ({ selectedCategory, setSelectedCategory, isSidebarOpen }) => {
  return (
    <Box
      sx={{
        overflowY: 'auto',
        height: { xs: 'auto', md: '96%' },
        flexDirection: { md: 'column' },
        display: { md: isSidebarOpen ? 'block' : 'none' } // Tampilkan atau sembunyikan sidebar berdasarkan isSidebarOpen
      }}
    >
      {categories.map((category) => (
        <Button
          key={category.name}
          variant="text"
          fullWidth
          onClick={() => setSelectedCategory(category.name)}
          style={{
            backgroundColor: category.name === selectedCategory ? 'skyblue' : 'transparent',
            color: category.name === selectedCategory ? '#ffffff' : 'inherit',
            padding: '10px',
            marginBottom: '5px',
            textTransform: 'none',
            justifyContent: 'flex-start',
            alignItems: 'center',
            textAlign: 'left',
          }}
        >
          <span
            style={{
              color: category.name === selectedCategory ? '#ffffff' : 'skyblue',
              marginRight: '15px',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {category.icon}
          </span>
          <Typography
            variant="body1"
            style={{
              opacity: category.name === selectedCategory ? '1' : '0.8',
            }}
          >
            {category.name}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};

export default Sidebar;
