import { Stack } from '@mui/material';
import React from 'react';
import { categories } from '../utils/constant';

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <Stack
      direction='row'
      sx={{
        overflowY: 'auto',
        height: { sx: 'auto', md: '96%' },
        flexDirection: { md: 'column' }
      }}
    >
      {categories.map((category) => (
        <button
          onClick={() => setSelectedCategory(category.name)}
          key={category.name}
          className='category-btn'
          style={{
            background: category.name === selectedCategory && '#FC1503',
            color: category.name === selectedCategory && '#ffffff'
          }}
        >
          <span
            style={{
              color: category.name === selectedCategory ? '#ffffff' : '#FC1503',
              marginRight: '15px'
            }}
          >
            {category.icon}
          </span>
          <span
            style={{
              opacity: category.name === selectedCategory ? '1' : '0.8'
            }}
          >
            {category.name}
          </span>
        </button>
      ))}
    </Stack>
  );
};

export default Sidebar;
