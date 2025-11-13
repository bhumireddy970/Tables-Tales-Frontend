import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  AccountCircle as AccountCircleIcon,
  Favorite as FavoriteIcon,
  Logout as LogoutIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useUser } from "../contextAPI/context";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const [tabValue, setTabValue] = useState("details");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState(null);
  const [tempDetails, setTempDetails] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const { email, logout, logo } = useUser();
  const navigate = useNavigate();

  const orderStatuses = ["Ordered", "Shipped", "Delivered"];

  // Fetch Profile Details
  useEffect(() => {
    if (!email) return;
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${BACKEND_API_URL}/customer/profile/${email}`
        );
        if (!response.ok) throw new Error("Failed to fetch user details");
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
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenuItems();
  }, []);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleEditClick = () => {
    setTempDetails({ ...profileDetails });
    setEditDialogOpen(true);
  };
  const handleInputChange = (field, value) =>
    setTempDetails({ ...tempDetails, [field]: value });

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/profile/update/${email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tempDetails),
        }
      );
      if (!response.ok) throw new Error("Failed to update profile");
      const updatedData = await response.json();
      setProfileDetails(updatedData.customer);
      setEditDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/customer/remove-wishlist-item/${email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId }),
        }
      );
      if (!response.ok) throw new Error("Failed to remove item from wishlist");
      setProfileDetails((prev) => ({
        ...prev,
        wishList: prev.wishList.filter((item) => item._id !== itemId),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const getMenuItemDetails = (menuId) => {
    const item = menuItems.find((item) => item._id === menuId);
    return item
      ? { name: item.name, price: item.price }
      : { name: "Unknown Item", price: "0.00" };
  };

  const getOrderStatusStep = (status) => {
    switch (status) {
      case "ordered":
        return 0;
      case "pending":
        return 1;
      case "delivered":
      case "cancelled":
        return 2;
      default:
        return 0;
    }
  };

  const handleLogOut = () => {
    logout(null);
    logo("CUSTOMER");
    navigate("/");
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      {/* Logout Button */}
      <Button
        variant="outlined"
        color="warning"
        startIcon={<LogoutIcon />}
        onClick={handleLogOut}
        sx={{
          position: "absolute",
          top: 80,
          right: 20,
          textTransform: "none",
          fontWeight: "bold",
          width: 120,
        }}
      >
        Log Out
      </Button>

      {/* Profile Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Avatar sx={{ width: 120, height: 120, mb: 2 }}>
          <AccountCircleIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5">
          {profileDetails?.firstName} {profileDetails?.lastName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {profileDetails?.email}
        </Typography>
        <Button
          startIcon={<EditIcon />}
          variant="outlined"
          size="small"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleEditClick}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Details" value="details" />
        <Tab label="Wishlist" value="wishlist" />
        <Tab label="Orders" value="orders" />
      </Tabs>

      {/* Tab Panels */}
      {tabValue === "details" && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Account Details
          </Typography>
          <Stack spacing={1}>
            <Typography>
              <strong>First Name:</strong> {profileDetails?.firstName}
            </Typography>
            <Typography>
              <strong>Last Name:</strong> {profileDetails?.lastName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {profileDetails?.email}
            </Typography>
            <Typography>
              <strong>Age:</strong> {profileDetails?.age}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {profileDetails?.mobileNumber}
            </Typography>
            <Typography>
              <strong>Address:</strong> {profileDetails?.address}
            </Typography>
            <Typography>
              <strong>Pincode:</strong> {profileDetails?.pincode}
            </Typography>
          </Stack>
        </Paper>
      )}

      {tabValue === "wishlist" && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Wishlist
          </Typography>
          {profileDetails.wishList && profileDetails.wishList.length > 0 ? (
            <List>
              {profileDetails.wishList.map((item, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleRemoveFromWishlist(item._id)}
                    >
                      Remove
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <FavoriteIcon color="error" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`₹${item.price}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No items in wishlist</Typography>
          )}
        </Paper>
      )}

      {tabValue === "orders" && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Today's Orders
            </Typography>
            <Link to="/orders">
              <Button variant="contained" color="success">
                View All Orders
              </Button>
            </Link>
          </Box>
          {profileDetails.orders && profileDetails.orders.length > 0 ? (
            profileDetails.orders
              .filter(
                (order) =>
                  new Date(order.createdAt).toDateString() ===
                  new Date().toDateString()
              )
              .map((order, idx) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Order ID: {order._id} - Status:{" "}
                    {order.status === "completed" ? "Delivered" : order.status}
                  </Typography>
                  <Stepper
                    activeStep={getOrderStatusStep(order.status)}
                    alternativeLabel
                    sx={{ mt: 1, mb: 1 }}
                  >
                    {orderStatuses.map((status, i) => (
                      <Step key={i}>
                        <StepLabel>{status}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <Typography variant="body2">
                    Total Amount: ₹{order.totalAmount}
                  </Typography>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, i) => {
                      const { name, price } = getMenuItemDetails(item.menuId);
                      return (
                        <ListItem key={i}>
                          <ListItemText
                            primary={name}
                            secondary={`Price: ₹${price}`}
                          />
                          <ListItemText
                            secondary={`Quantity: ${item.quantity}`}
                          />
                        </ListItem>
                      );
                    })
                  ) : (
                    <Typography variant="body2">
                      No items in this order
                    </Typography>
                  )}
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))
          ) : (
            <Typography>No orders available today</Typography>
          )}
        </Paper>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {[
            "firstName",
            "lastName",
            "age",
            "mobileNumber",
            "address",
            "pincode",
          ].map((field, idx) => (
            <TextField
              key={idx}
              fullWidth
              margin="normal"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={tempDetails[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          ))}
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={tempDetails.email}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
