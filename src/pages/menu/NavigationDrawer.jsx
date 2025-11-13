import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import StarIcon from '@mui/icons-material/Star';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

const NavigationDrawer = ({
  drawerOpen,
  menuItems,
  onDrawerClose,
  onAccountClick,
  onLogOut,
}) => {
  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={onDrawerClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 250,
          transition: 'width 0.3s ease-in-out',
        },
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          my: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          <FastfoodIcon sx={{ fontSize: '2rem', color: 'success.main' }} />
          Table Tales
        </Typography>
        <Divider />

        <SpecialItemsAccordion menuItems={menuItems} />
        
        <AccountSection onAccountClick={onAccountClick} />
        <ChefsSection />
        <LogoutSection onLogOut={onLogOut} />
        
        <FooterSection />
      </Box>
    </Drawer>
  );
};

const SpecialItemsAccordion = ({ menuItems }) => (
  <Accordion sx={{ textAlign: 'left' }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StarIcon color="warning" />
        Special Items
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <List>
        {menuItems
          .filter((menu) => menu.category === 'Special')
          .map((menu, index) => (
            <ListItem
              button
              key={index}
              sx={{
                '&:hover': { bgcolor: 'rgba(0, 150, 136, 0.1)' },
                transition: 'background-color 0.2s ease',
              }}
            >
              <ListItemText
                primary={menu.name}
                secondary={`Price: ₹${menu.price}`}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
          ))}
      </List>
    </AccordionDetails>
  </Accordion>
);

const AccountSection = ({ onAccountClick }) => (
  <Button
    variant="outlined"
    color="info"
    onClick={onAccountClick}
    startIcon={<AccountCircleIcon />}
    sx={buttonStyles}
  >
    My Account
  </Button>
);

const ChefsSection = () => (
  <Link to={'/chefs'} style={{ textDecoration: 'none' }}>
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<EmojiPeopleIcon />}
      sx={buttonStyles}
    >
      Chefs
    </Button>
  </Link>
);

const LogoutSection = ({ onLogOut }) => (
  <Button
    variant="outlined"
    color="warning"
    onClick={onLogOut}
    startIcon={<LogoutIcon />}
    sx={buttonStyles}
  >
    Log Out
  </Button>
);

const FooterSection = () => (
  <Box
    sx={{
      mt: 'auto',
      py: 2,
      textAlign: 'center',
      bgcolor: 'rgba(0, 0, 0, 0.05)',
    }}
  >
    <Typography variant="body2" color="textSecondary">
      © {new Date().getFullYear()} Table Tales. All Rights Reserved.
    </Typography>
  </Box>
);

const buttonStyles = {
  mx: 2,
  my: 1,
  textTransform: 'none',
  fontWeight: 'bold',
  width: '180px',
  '&:hover': { bgcolor: 'rgba(0, 150, 136, 0.1)' },
  transition: 'background-color 0.3s ease',
};

export default NavigationDrawer;