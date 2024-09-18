import React from 'react';
import { Box, Button, Typography, AppBar, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { categories } from '../utils/constant';

const Sidebar = ({ selectedCategory, setSelectedCategory, isSidebarOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Detect if the device is mobile

  const sidebarContent = (
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
            borderRadius: '26px', // Menambahkan radius border
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
              display: isMobile ? 'none' : 'block', // Hide text on mobile
            }}
          >
            {category.name}
          </Typography>
        </Button>
      ))}
    </Box>
  );

  return (
    <>
      {isMobile ? (
        // Navbar for mobile devices
        <AppBar
          position="fixed"
          sx={{
            top: 'auto',
            bottom: 0,
            backgroundColor: theme.palette.background.default,
            boxShadow: 'none', // Remove shadow for a cleaner look
            display: 'flex',
            justifyContent: 'space-around', // Distribute buttons evenly
            alignItems: 'center',
          }}
        >
          <Toolbar>
            {categories.map((category) => (
              <Button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                style={{
                  color: 'skyblue', // Set default color for all icons
                  padding: '10px',
                }}
              >
                <span
                  style={{
                    color: 'skyblue', // Set default color for all icons
                    marginRight: '8px',
                    fontSize: '1.2rem',
                  }}
                >
                  {category.icon}
                </span>
                {/* Hide text on mobile */}
                <Typography
                  variant="body2"
                  style={{
                    display: 'none',
                  }}
                >
                  {category.name}
                </Typography>
              </Button>
            ))}
          </Toolbar>
        </AppBar>
      ) : (
        // Sidebar for larger screens
        <Box
          sx={{
            overflowY: 'auto',
            height: '96%',
            flexDirection: 'column',
            display: isSidebarOpen ? 'block' : 'none'
          }}
        >
          {sidebarContent}
        </Box>
      )}
    </>
  );
};

export default Sidebar;
