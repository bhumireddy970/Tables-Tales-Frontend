import React, { useState } from 'react';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import MenuCard from './MenuCard';

const CategoryTabs = ({ menuItems, onOrderClick, onLike, onDislike, onAddToWishlist }) => {
  const [tabValue, setTabValue] = useState('1');

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const categories = [
    { value: '1', label: 'All items', filter: () => true },
    { value: '2', label: 'Tiffins', filter: (menu) => menu.category === 'tiffin' },
    { value: '3', label: 'Fast Food Items', filter: (menu) => menu.category === 'Fast Food' },
    { value: '4', label: 'General Food Items', filter: (menu) => menu.category === 'Full meals' },
    { value: '5', label: 'Sea Food', filter: (menu) => menu.category === 'Sea food' },
    { value: '6', label: 'Snacks', filter: (menu) => menu.category === 'Snack' },
    { value: '7', label: 'Beverages', filter: (menu) => menu.category === 'Beverage' },
    { value: '8', label: 'Salad', filter: (menu) => menu.category === 'Salad' },
    { value: '9', label: 'Cuisines', filter: (menu) => menu.category === 'Cuisine' },
    { value: '10', label: 'Dessert', filter: (menu) => menu.category === 'Dessert' },
  ];

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="Menu Tabs">
            {categories.map((category) => (
              <Tab key={category.value} label={category.label} value={category.value} />
            ))}
          </TabList>
        </Box>

        {categories.map((category) => (
          <TabPanel key={category.value} value={category.value}>
            <MenuGrid
              menuItems={menuItems.filter(category.filter)}
              onOrderClick={onOrderClick}
              onLike={onLike}
              onDislike={onDislike}
              onAddToWishlist={onAddToWishlist}
            />
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

const MenuGrid = ({ menuItems, onOrderClick, onLike, onDislike, onAddToWishlist }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', bgcolor: 'gray' }}>
    {menuItems.map((menu, index) => (
      <MenuCard
        key={index}
        menu={menu}
        onOrderClick={onOrderClick}
        onLike={onLike}
        onDislike={onDislike}
        onAddToWishlist={onAddToWishlist}
      />
    ))}
  </Box>
);

export default CategoryTabs;
