import React from 'react';
import { Box, Typography } from '@mui/material';

const SearchResults = ({ filteredMenu, searchQuery }) => {
  return (
    <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {(filteredMenu.length > 0 || searchQuery === '') ? (
        filteredMenu.map((item, index) => (
          <MenuItemCard key={index} item={item} isSearchResult={true} />
        ))
      ) : (
        <Typography>No items found</Typography>
      )}
    </Box>
  );
};

const MenuItemCard = ({ item, isSearchResult }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        padding: 2,
        width: '80%',
        maxWidth: 500,
      }}
    >
      <img 
        src={`${item.imageURL}`} 
        alt={item.name} 
        style={{ width: 60, height: 60, marginRight: 16 }} 
      />
      <Box>
        <Typography variant="h6">{item.name}</Typography>
        <Typography variant="body2">{item.category}</Typography>
        <Typography variant="body2">{item.description}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold', marginTop: 1 }}>
          ₹ {item.price}
        </Typography>
      </Box>
    </Box>
  );
};

export default SearchResults;