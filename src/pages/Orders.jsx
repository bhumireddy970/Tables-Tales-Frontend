import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useUser } from '../contextAPI/context';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const OrderPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [profileDetails, setProfileDetails] = useState(null);
  const { email } = useUser();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const orderStatuses = ['Ordered', 'Shipped', 'Delivered'];

  // Fetch user profile including orders
  useEffect(() => {
    if (!email) return;
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/customer/profile/${email}`);
        if (!res.ok) throw new Error('Failed to fetch user details');
        const data = await res.json();
        setProfileDetails(data.customer);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserDetails();
  }, [email]);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/item/menu-items`);
        if (!res.ok) throw new Error('Failed to fetch menu items');
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenuItems();
  }, []);

  const getOrderStatusStep = (status) => {
    switch (status) {
      case 'ordered': return 0;
      case 'pending': return 1;
      case 'delivered': case 'cancelled': return 2;
      default: return 0;
    }
  };

  const getMenuItemDetails = (menuId) => {
    const item = menuItems.find(i => i._id === menuId);
    return item ? { name: item.name, price: item.price } : { name: 'Unknown', price: '0.00' };
  };

  if (!profileDetails) return <Typography textAlign="center" mt={5}>Loading orders...</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant={isSmallScreen ? 'h5' : 'h4'} fontWeight="bold" textAlign="center" mb={4}>
        Orders History
      </Typography>

      {profileDetails.orders && profileDetails.orders.length > 0 ? (
        <Stack spacing={3}>
          {profileDetails.orders.map((order, idx) => (
            <Paper
              key={idx}
              elevation={3}
              sx={{
                p: 3,
                '&:hover': { boxShadow: 6, transform: 'scale(1.01)', transition: '0.3s' },
              }}
            >
              <Typography variant={isSmallScreen ? 'subtitle1' : 'h6'} fontWeight="bold" mb={1}>
                Order ID: {order._id} - Status: {order.status === 'completed' ? 'Delivered' : order.status}
              </Typography>

              <Stepper activeStep={getOrderStatusStep(order.status)} alternativeLabel sx={{ mb: 2 }}>
                {orderStatuses.map((status, i) => (
                  <Step key={i}>
                    <StepLabel sx={{
                      '& .MuiStepLabel-label': { fontSize: isSmallScreen ? '0.75rem' : '1rem' }
                    }}>
                      {status}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Typography variant="body2" mb={1}>
                Order placed at: {new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Total Amount: ₹{order.totalAmount} | Items: {order.items.length}
              </Typography>

              {order.items && order.items.length > 0 ? (
                <List>
                  {order.items.map((item, i) => {
                    const { name, price } = getMenuItemDetails(item.menuId);
                    return (
                      <ListItem
                        key={i}
                        sx={{
                          display: 'flex',
                          flexDirection: isSmallScreen ? 'column' : 'row',
                          justifyContent: 'space-between',
                          px: 0,
                        }}
                      >
                        <ListItemText primary={name} secondary={`Price: ₹${price}`} />
                        <ListItemText secondary={`Quantity: ${item.quantity}`} />
                      </ListItem>
                    );
                  })}
                </List>
              ) : <Typography>No items in this order</Typography>}

              <Divider sx={{ mt: 2 }} />
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography variant="body1" textAlign="center" mt={4}>No orders available.</Typography>
      )}
    </Box>
  );
};

export default OrderPage;
