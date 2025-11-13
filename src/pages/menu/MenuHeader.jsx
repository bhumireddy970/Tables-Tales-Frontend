import React from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const MenuHeader = ({ drawerOpen, searchQuery, onDrawerToggle, onSearchChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'gray',
        padding: '10px',
      }}
    >
      <IconButton
        color="inherit"
        aria-label="menu"
        onClick={onDrawerToggle}
      >
        <MenuIcon fontSize="large" />
      </IconButton>

      <Typography
        variant="h4"
        sx={{
          fontWeight: '200',
          color: 'white',
          textAlign: 'center',
          flexGrow: 1,
        }}
      >
        Menu Items
      </Typography>

      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={onSearchChange}
        sx={{
          width: 200,
          marginLeft: 2,
          backgroundColor: 'white',
        }}
      />
    </Box>
  );
};

export default MenuHeader;