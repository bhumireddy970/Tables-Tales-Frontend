import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ThumbUpOffAltRoundedIcon from '@mui/icons-material/ThumbUpOffAltRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';

const MenuCard = ({ menu, onOrderClick, onLike, onDislike, onAddToWishlist }) => {
  const updatedImageURL = `${menu.imageURL}`;

  return (
    <Card sx={{ maxWidth: '350px', display: 'flex', m: 2, backgroundColor: 'rgb(206, 206, 206)' }}>
      <CardActionArea>
        <CardMedia 
          sx={{ minHeight: '400px' }} 
          component="img" 
          src={updatedImageURL} 
          alt={menu.name} 
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {menu.name}
          </Typography>
          <Typography variant="body2">{menu.description}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
            <Typography>
              <CurrencyRupeeIcon fontSize="small" />
              {menu.price}
            </Typography>
            <LikeDislikeSection
              menu={menu}
              onLike={onLike}
              onDislike={onDislike}
            />
          </Box>
          <ActionButtons
            menu={menu}
            onOrderClick={onOrderClick}
            onAddToWishlist={onAddToWishlist}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const LikeDislikeSection = ({ menu, onLike, onDislike }) => (
  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <ThumbUpOffAltRoundedIcon 
      onClick={() => onLike(menu._id)} 
      sx={{ cursor: 'pointer' }} 
    />
    {menu.likes || 0}
    <ThumbDownRoundedIcon 
      onClick={() => onDislike(menu._id)} 
      sx={{ cursor: 'pointer' }} 
    />
    {menu.dislikes || 0}
  </Typography>
);

const ActionButtons = ({ menu, onOrderClick, onAddToWishlist }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 2 }}>
    <Button 
      variant="contained" 
      color="success" 
      onClick={() => onAddToWishlist(menu._id)}
    >
      Add to WishList
    </Button>
    <Button 
      variant="contained" 
      color="success" 
      onClick={onOrderClick}
    >
      Order Now
    </Button>
  </Box>
);

export default MenuCard;