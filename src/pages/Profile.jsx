
// import React, { useState, useEffect } from 'react';
// import { format } from 'date-fns';

// import Layout from '../components/Layout/Layout';
// import {
//   Avatar,
//   Box,
//   Button,
//   Divider,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Tabs,
//   Tab,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   CircularProgress, Stepper, Step, StepLabel
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import { useUser } from '../contextAPI/context';
// import { Link, useNavigate } from 'react-router-dom';
// import LogoutIcon from '@mui/icons-material/Logout';


// const Profile = () => {
//   const [tabValue, setTabValue] = useState('details');
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [profileDetails, setProfileDetails] = useState(null);
//   const [tempDetails, setTempDetails] = useState({});
//   const [orders, setOrders] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const { email, logout,logo } = useUser();  // useUser hook for accessing context (email, logout)
//   const e = email
//   console.log(email)
//   const orderStatuses = ['Ordered', 'Shipped', 'Delivered'];
//   const navigate = useNavigate()
//   useEffect(() => {
//     // if (email !== null) {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:8071/customer/profile/${e}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user details');
//         }
//         const data = await response.json();
//         setProfileDetails(data.customer);
//         setTempDetails(data.customer);
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//       }
//     };
//     fetchUserDetails();
//     // }else{
//     //     navigate('*')
//     // }
//   }, [email]);  // Include email as a dependency to re-fetch if email changes
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch(`http://localhost:8071/orders/${email}`)
//         if (!response.ok) {
//           throw new Error('Failed to fetch user details');
//         }
//         const data = await response.json()
//         console.log(data)
//         setOrders(data.order)
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//       }
//     }
//     fetchOrders()
//   }, [])

//   // Fetch the menu items (assuming you have a menu API endpoint)
//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const response = await fetch('http://localhost:8071/item/menu-items'); // replace with your API endpoint
//         if (!response.ok) {
//           throw new Error('Failed to fetch menu items');
//         }
//         const data = await response.json();
//         setMenuItems(data);  // Store the menu items in the state
//       } catch (err) {
//         console.error("Error fetching menu items:", err);
//       }
//     };

//     fetchMenuItems();
//   }, []);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   // Update the order status to "delivered" if it was "completed"
//   const getOrderStatusStep = (status) => {
//     switch (status) {
//       case 'ordered':
//         return 0;
//       case 'pending':
//         return 1;
//       case 'delivered': // Change this to 'delivered'
//       case 'cancelled': // Treat cancelled as a final status
//         return 2;
//       default:
//         return 0;
//     }
//   };

//   const getMenuItemDetails = (menuId) => {
//     const item = menuItems.find(item => item._id === menuId);
//     return item ? { name: item.name, price: item.price } : { name: 'Unknown Item', price: '0.00' };  // Fallback if item is not found
//   };

//   const handleEditClick = () => {
//     setTempDetails({ ...profileDetails });
//     setEditDialogOpen(true);
//   };
//   const handleRemoveFromWishlist = async (itemId) => {
//     try {
//       // Remove the item from the wishlist on the backend
//       const response = await fetch(`http://localhost:8071/customer/remove-wishlist-item/${email}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ itemId }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to remove item from wishlist');
//       }

//       const updatedProfile = {
//         ...profileDetails,
//         wishList: profileDetails.wishList.filter(item => item._id !== itemId)
//       }
//       setProfileDetails(updatedProfile)
//     } catch (error) {
//       console.error('Error removing item from wishlist:', error);
//     }
//   };
//   const handleSaveChanges = async () => {
//     try {
//       const response = await fetch(`http://localhost:8071/profile/update/${email}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(tempDetails),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update profile');
//       }

//       const updatedData = await response.json();
//       setProfileDetails(updatedData.customer);
//       setEditDialogOpen(false);
//     } catch (error) {
//       console.error('Error saving changes:', error);
//     }
//   };
//   const handleLogOut = () => {
//     logout(null);
//     logo('CUSTOMER')
//     navigate('/')
//   }
//   const handleInputChange = (field, value) => {
//     setTempDetails({ ...tempDetails, [field]: value });
//   };

//   if (!profileDetails) {
//     return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
//   }

//   return (
//     <>
//       <Button
//         variant="outlined"
//         color="warning"
//         onClick={handleLogOut}
//         startIcon={<LogoutIcon />}
//         sx={{
//           position: 'absolute',
//           top: '80px',
//           right: '20px',
//           mx: 2,
//           my: 1,
//           textTransform: 'none',
//           fontWeight: 'bold',
//           width: '120px',
//           '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' },
//           transition: 'background-color 0.3s ease',
//         }}
//       >
//         Log Out
//       </Button>
//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, maxWidth: 800, margin: '0 auto' }}>
//         {/* Profile Header */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
//           <Avatar sx={{ width: 120, height: 120 }} alt="Profile Picture">
//             <AccountCircleIcon fontSize="large" />
//           </Avatar>
//         </Box>

//         {/* User Name and Email */}
//         <Typography variant="h5" gutterBottom>
//           {profileDetails.firstName} {profileDetails.lastName}
//         </Typography>
//         <Typography variant="body1" color="textSecondary" gutterBottom>
//           {profileDetails.email}
//         </Typography>
//         <Button
//           startIcon={<EditIcon />}
//           variant="outlined"
//           size="small"
//           color="primary"
//           onClick={handleEditClick}
//           sx={{ mb: 3 }}
//         >
//           Edit Profile
//         </Button>

//         {/* Tabs Section */}
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           sx={{ mb: 3, width: '100%' }}
//           centered
//           textColor="primary"
//           indicatorColor="primary"
//         >
//           <Tab label="Details" value="details" />
//           <Tab label="Wishlist" value="wishlist" />
//           <Tab label="Orders" value="orders" />
//         </Tabs>

//         {/* Tab Panels */}
//         {tabValue === 'details' && (
//           <Box sx={{ textAlign: 'left', width: '100%' }}>
//             <Typography variant="h6" gutterBottom>Account Details</Typography>
//             <Typography><strong>First Name:</strong> {profileDetails.firstName}</Typography>
//             <Typography><strong>Last Name:</strong> {profileDetails.lastName}</Typography>
//             <Typography><strong>Email:</strong> {profileDetails.email}</Typography>
//             <Typography><strong>Age:</strong> {profileDetails.age}</Typography>
//             <Typography><strong>Phone:</strong> {profileDetails.mobileNumber}</Typography>
//             <Typography><strong>Address:</strong> {profileDetails.address}</Typography>
//             <Typography><strong>Pincode:</strong> {profileDetails.pincode}</Typography>
//           </Box>
//         )}

//         {tabValue === 'wishlist' && (
//           <Box sx={{ textAlign: 'left', width: '100%' }}>
//             <Typography variant="h6" gutterBottom>Wishlist</Typography>
//             {
//               profileDetails.wishList && profileDetails.wishList.length > 0 ? (
//                 <List>
//                   {
//                     profileDetails.wishList.map((item, index) => (
//                       <ListItem key={index}>
//                         <ListItemAvatar><FavoriteIcon color="error" /></ListItemAvatar>
//                         {/* <ListItemText primary={item.name} secondary={₹`₹item.price`} /> */}
//                         <ListItemText
//                           primary={item.name}
//                           secondary={`₹${item.price}`}
//                         />
//                         <Button
//                           variant="outlined"
//                           color="secondary"
//                           size="small"
//                           onClick={() => handleRemoveFromWishlist(item._id)}
//                         >
//                           Remove
//                         </Button>
//                       </ListItem>

//                     ))
//                   }
//                 </List>
//               ) : (
//                 <Typography >
//                   No items in the wish list
//                 </Typography>
//               )
//             }
//           </Box>
//         )}

//         {tabValue === 'orders' && (



//           <Box sx={{ textAlign: 'left', width: '100%' }}>
//             {/* Flex container to align heading and button side by side */}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>Today's Orders</Typography>

//               {/* View All Orders button aligned to the right */}
//               <Link to={'/orders'}>
//                 <Button variant='contained' color='success'>
//                   View All Orders
//                 </Button>
//               </Link>
//             </Box>

//             {/* Check if there are any orders */}
//             {profileDetails.orders && profileDetails.orders.length > 0 ? (
//               <List>
//                 {/* Filter today's orders and map through them */}
//                 {profileDetails.orders.filter(order => {
//                   // Get today's date
//                   const today = new Date();
//                   // Format the createdAt date and today's date to compare
//                   const orderDate = new Date(order.createdAt);

//                   // Check if the order was placed today
//                   return orderDate.toDateString() === today.toDateString();
//                 }).map((order, index) => (
//                   <div key={index}>
//                     <Typography variant="h6" sx={{ mt: 2 }}>
//                       Order ID: {order._id} - Status: {order.status === 'completed' ? 'delivered' : order.status}
//                     </Typography>

//                     {/* Stepper for order status */}
//                     <Stepper activeStep={getOrderStatusStep(order.status)} alternativeLabel>
//                       {orderStatuses.map((status, i) => (
//                         <Step key={i}>
//                           <StepLabel>{status}</StepLabel>
//                         </Step>
//                       ))}
//                     </Stepper>

//                     {/* Display total amount */}
//                     <Typography variant="body1" sx={{ mt: 1 }}>
//                       Total amount: ₹{order.totalAmount}
//                     </Typography>

//                     {/* Display the items in the order */}
//                     {order.items && order.items.length > 0 ? (
//                       order.items.map((item, i) => {
//                         const { name, price } = getMenuItemDetails(item.menuId);  // Get name and price from the menu
//                         return (
//                           <ListItem key={i}>
//                             <ListItemText
//                               primary={name}  // Display the item name
//                               secondary={`Price: ₹${price}`}  // Display the item price
//                             />
//                             <ListItemText
//                               secondary={`Quantity: ${item.quantity}`}  // Display the quantity of the item
//                             />
//                           </ListItem>
//                         );
//                       })
//                     ) : (
//                       <Typography variant="body2" sx={{ mt: 1 }}>
//                         No items in this order
//                       </Typography>
//                     )}

//                     <Divider sx={{ mt: 2 }} />
//                   </div>
//                 ))}
//               </List>
//             ) : (
//               <Typography>No orders available.</Typography>
//             )}
//           </Box>

//         )}
//       </Box>

//       {/* Edit Profile Dialog */}
//       <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
//         <DialogTitle>Edit Profile</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             margin="normal"
//             label="First Name"
//             value={tempDetails.firstName}
//             onChange={(e) => handleInputChange('firstName', e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Last Name"
//             value={tempDetails.lastName}
//             onChange={(e) => handleInputChange('lastName', e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Email"
//             value={tempDetails.email}
//             onChange={(e) => handleInputChange('email', e.target.value)}
//             disabled
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Age"
//             value={tempDetails.age}
//             onChange={(e) => handleInputChange('age', e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Phone"
//             value={tempDetails.mobileNumber}
//             onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Address"
//             value={tempDetails.address}
//             onChange={(e) => handleInputChange('address', e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Pincode"
//             value={tempDetails.pincode}
//             onChange={(e) => handleInputChange('pincode', e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleSaveChanges} variant="contained" color="primary">
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Divider, Typography, List, ListItem, ListItemAvatar, ListItemText, Tabs, Tab, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Stepper, Step, StepLabel, Paper, Stack } from '@mui/material';
import { Edit as EditIcon, AccountCircle as AccountCircleIcon, Favorite as FavoriteIcon, Logout as LogoutIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useUser } from '../contextAPI/context';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const [tabValue, setTabValue] = useState('details');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState(null);
  const [tempDetails, setTempDetails] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const { email, logout, logo } = useUser();
  const navigate = useNavigate();

  const orderStatuses = ['Ordered', 'Shipped', 'Delivered'];

  // Fetch Profile Details
  useEffect(() => {
    if (!email) return;
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/customer/profile/${email}`);
        if (!response.ok) throw new Error('Failed to fetch user details');
        const data = await response.json();
        setProfileDetails(data.customer);
        setTempDetails(data.customer);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserDetails();
  }, [email]);

  // Fetch Menu Items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/item/menu-items`);
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenuItems();
  }, []);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleEditClick = () => { setTempDetails({ ...profileDetails }); setEditDialogOpen(true); };
  const handleInputChange = (field, value) => setTempDetails({ ...tempDetails, [field]: value });

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/profile/update/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempDetails),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const updatedData = await response.json();
      setProfileDetails(updatedData.customer);
      setEditDialogOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/customer/remove-wishlist-item/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      if (!response.ok) throw new Error('Failed to remove item from wishlist');
      setProfileDetails(prev => ({ ...prev, wishList: prev.wishList.filter(item => item._id !== itemId) }));
    } catch (err) { console.error(err); }
  };

  const getMenuItemDetails = (menuId) => {
    const item = menuItems.find(item => item._id === menuId);
    return item ? { name: item.name, price: item.price } : { name: 'Unknown Item', price: '0.00' };
  };

  const getOrderStatusStep = (status) => {
    switch (status) {
      case 'ordered': return 0;
      case 'pending': return 1;
      case 'delivered': case 'cancelled': return 2;
      default: return 0;
    }
  };

  const handleLogOut = () => { logout(null); logo('CUSTOMER'); navigate('/'); };

  if (!profileDetails) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 4 }}>
      {/* Logout Button */}
      <Button variant="outlined" color="warning" startIcon={<LogoutIcon />} onClick={handleLogOut}
        sx={{ position: 'absolute', top: 80, right: 20, textTransform: 'none', fontWeight: 'bold', width: 120 }}
      >Log Out</Button>

      {/* Profile Header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 120, height: 120, mb: 2 }}><AccountCircleIcon fontSize="large" /></Avatar>
        <Typography variant="h5">{profileDetails.firstName} {profileDetails.lastName}</Typography>
        <Typography variant="body2" color="textSecondary">{profileDetails.email}</Typography>
        <Button startIcon={<EditIcon />} variant="outlined" size="small" color="primary" sx={{ mt: 2 }} onClick={handleEditClick}>Edit Profile</Button>
      </Box>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} centered textColor="primary" indicatorColor="primary" sx={{ mb: 3 }}>
        <Tab label="Details" value="details" />
        <Tab label="Wishlist" value="wishlist" />
        <Tab label="Orders" value="orders" />
      </Tabs>

      {/* Tab Panels */}
      {tabValue === 'details' && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Account Details</Typography>
          <Stack spacing={1}>
            <Typography><strong>First Name:</strong> {profileDetails.firstName}</Typography>
            <Typography><strong>Last Name:</strong> {profileDetails.lastName}</Typography>
            <Typography><strong>Email:</strong> {profileDetails.email}</Typography>
            <Typography><strong>Age:</strong> {profileDetails.age}</Typography>
            <Typography><strong>Phone:</strong> {profileDetails.mobileNumber}</Typography>
            <Typography><strong>Address:</strong> {profileDetails.address}</Typography>
            <Typography><strong>Pincode:</strong> {profileDetails.pincode}</Typography>
          </Stack>
        </Paper>
      )}

      {tabValue === 'wishlist' && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Wishlist</Typography>
          {profileDetails.wishList && profileDetails.wishList.length > 0 ? (
            <List>
              {profileDetails.wishList.map((item, idx) => (
                <ListItem key={idx} secondaryAction={
                  <Button variant="outlined" color="secondary" size="small" onClick={() => handleRemoveFromWishlist(item._id)}>Remove</Button>
                }>
                  <ListItemAvatar><FavoriteIcon color="error" /></ListItemAvatar>
                  <ListItemText primary={item.name} secondary={`₹${item.price}`} />
                </ListItem>
              ))}
            </List>
          ) : <Typography>No items in wishlist</Typography>}
        </Paper>
      )}

      {tabValue === 'orders' && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Today's Orders</Typography>
            <Link to="/orders"><Button variant="contained" color="success">View All Orders</Button></Link>
          </Box>
          {profileDetails.orders && profileDetails.orders.length > 0 ? (
            profileDetails.orders.filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString())
              .map((order, idx) => (
                <Box key={idx} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Order ID: {order._id} - Status: {order.status === 'completed' ? 'Delivered' : order.status}</Typography>
                  <Stepper activeStep={getOrderStatusStep(order.status)} alternativeLabel sx={{ mt: 1, mb: 1 }}>
                    {orderStatuses.map((status, i) => <Step key={i}><StepLabel>{status}</StepLabel></Step>)}
                  </Stepper>
                  <Typography variant="body2">Total Amount: ₹{order.totalAmount}</Typography>
                  {order.items && order.items.length > 0 ? order.items.map((item, i) => {
                    const { name, price } = getMenuItemDetails(item.menuId);
                    return (
                      <ListItem key={i}>
                        <ListItemText primary={name} secondary={`Price: ₹${price}`} />
                        <ListItemText secondary={`Quantity: ${item.quantity}`} />
                      </ListItem>
                    );
                  }) : <Typography variant="body2">No items in this order</Typography>}
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))
          ) : <Typography>No orders available today</Typography>}
        </Paper>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {['firstName','lastName','age','mobileNumber','address','pincode'].map((field, idx) => (
            <TextField key={idx} fullWidth margin="normal" label={field.charAt(0).toUpperCase() + field.slice(1)} value={tempDetails[field]} onChange={(e) => handleInputChange(field, e.target.value)} />
          ))}
          <TextField fullWidth margin="normal" label="Email" value={tempDetails.email} disabled />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
