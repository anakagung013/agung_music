import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  AppBar, 
  Toolbar, 
  useMediaQuery, 
  useTheme, 
  Tooltip,
  Container
} from '@mui/material';
import { categories } from '../utils/constant';

const Sidebar = ({ selectedCategory, setSelectedCategory, isSidebarOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const CategoryButton = ({ category }) => (
    <Tooltip title={category.name} placement="right">
      <Button
        fullWidth
        onClick={() => setSelectedCategory(category.name)}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          py: 1.5,
          px: 2,
          borderRadius: 3,
          transition: 'all 0.3s ease',
          backgroundColor: category.name === selectedCategory 
            ? 'rgba(33, 150, 243, 0.1)' // Soft blue background when selected
            : 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.05)',
            transform: 'scale(1.02)',
          }
        }}
      >
        <Box 
          sx={{ 
            color: category.name === selectedCategory 
              ? theme.palette.primary.main 
              : theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            mr: 2
          }}
        >
          {category.icon}
        </Box>
        {(!isMobile && isSidebarOpen) && (
          <Typography
            variant="body2"
            sx={{
              color: category.name === selectedCategory 
                ? theme.palette.primary.main 
                : theme.palette.text.primary,
              fontWeight: category.name === selectedCategory ? 600 : 400,
              opacity: category.name === selectedCategory ? 1 : 0.8,
            }}
          >
            {category.name}
          </Typography>
        )}
      </Button>
    </Tooltip>
  );

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <AppBar
        position="fixed"
        color="default"
        sx={{
          top: 'auto',
          bottom: 0,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center' 
        }}>
          {categories.map((category) => (
            <Tooltip key={category.name} title={category.name} placement="top">
              <Button
                onClick={() => setSelectedCategory(category.name)}
                sx={{
                  minWidth: 'auto',
                  color: category.name === selectedCategory 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                }}
              >
                {category.icon}
              </Button>
            </Tooltip>
          ))}
        </Toolbar>
      </AppBar>
    );
  }

  // Desktop Sidebar
  return (
    <Box
      sx={{
        width: isSidebarOpen ? { xs: 240, md: 240 } : 80,
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        pt: 10, // Adjust based on your navbar height
        zIndex: 1000,
      }}
    >
      <Box sx={{ px: isSidebarOpen ? 2 : 1 }}>
        {categories.map((category) => (
          <CategoryButton 
            key={category.name} 
            category={category} 
          />
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;