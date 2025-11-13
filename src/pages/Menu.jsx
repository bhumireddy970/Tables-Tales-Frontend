

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contextAPI/context';
import { jsPDF } from 'jspdf';

// Import components
import MenuHeader from './menu/MenuHeader';
import NavigationDrawer from './menu/NavigationDrawer';
import SearchResults from './menu/SearchResults';
import CategoryTabs from './menu/CategoryTabs';
import OrderDialogs from './menu/OrderDialogs';

// Import utility functions
import { handleLike, handleDislike, handleCartClick, handleOrderSubmit } from './utils/menuUtils';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;
console.log(BACKEND_API_URL)
const Menu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const { email, logout, logo } = useUser();

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/item/menu-items`);
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
          setFilteredMenu(data);
        } else {
          console.error('Failed to fetch menu items');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  // Handle search
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filteredItems = menuItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredMenu(filteredItems);
  };

  // Handle item selection
  const handleCheckboxChange = (menuId, price) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (updated[menuId]) {
        delete updated[menuId];
      } else {
        updated[menuId] = { price, quantity: 1 };
      }
      return updated;
    });
  };

  // Handle quantity change
  const handleQuantityChange = (menuId, quantity) => {
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) return;

    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (updated[menuId]) {
        updated[menuId].quantity = parsedQuantity;
      }
      return updated;
    });
  };

  // Handle like with utility function
  const handleLikeClick = async (menuId) => {
    await handleLike(menuId, setLikes);
  };

  // Handle dislike with utility function
  const handleDislikeClick = async (menuId) => {
    await handleDislike(menuId, setDislikes);
  };

  // Handle add to wishlist
  const handleAddToWishlist = async (itemId) => {
    await handleCartClick(email, itemId);
  };

  // Handle order submission
  const handleOrderSubmitClick = async () => {
    const result = await handleOrderSubmit(selectedItems, email, menuItems);
    if (result.success) {
      alert(`Order placed successfully! Order ID: ${result.orderId}`);
      setOrderDialogOpen(false);
      setSelectedItems({});
    } else {
      alert(result.message);
    }
  };

  // Download receipt function
  const downloadReceipt = () => {
    const doc = new jsPDF();

    // Title with customized font and positioning
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text('Table Tales Receipt', 105, 20, null, null, 'center');
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

    // Customer information
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Customer: ${email}`, 20, 40);

    // Draw a horizontal line to separate title from items
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    let yPosition = 55;
    doc.text('Items:', 20, yPosition);
    yPosition += 10;

    // Add each item and its price/quantity
    Object.entries(selectedItems).forEach(([menuId, { price, quantity }]) => {
      const menuName = menuItems.find((item) => item._id === menuId)?.name || 'Unknown Item';

      doc.setFont("helvetica", "normal");
      doc.text(`${menuName}`, 20, yPosition);
      doc.text(`₹${price} x ${quantity}`, 140, yPosition, { align: 'right' });
      doc.text("🛒", 170, yPosition);

      yPosition += 8;
    });

    // Spacer before totals
    yPosition += 10;

    // Draw a line before totals section
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);

    // Calculating subtotal, tax, and total
    const subtotal = calculateTotalAmount();
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    // Totals section
    yPosition += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Tax (18%): ₹${tax.toFixed(2)}`, 20, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    doc.text(`Total: ₹${total.toFixed(2)}`, 20, yPosition);
    doc.setTextColor(0, 0, 0);

    // Draw a line at the end of the receipt
    yPosition += 10;
    doc.line(20, yPosition, 190, yPosition);

    // Add a receipt icon
    doc.text("📜", 170, yPosition - 5);

    // Save the generated PDF
    doc.save('receipt.pdf');
  };

  const calculateTotalAmount = () => {
    return Object.values(selectedItems).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Handle view receipt - this should OPEN the receipt dialog
  const handleViewReceipt = () => {
    setReceiptDialogOpen(true);
  };

  // Handle back from receipt to order
  const handleBackFromReceipt = () => {
    setReceiptDialogOpen(false);
    // Order dialog remains open
  };

  // Handle logout
  const handleLogOut = () => {
    logout(null);
    logo('CUSTOMER');
    navigate('/');
  };


  return (
    <>
      <MenuHeader
        drawerOpen={drawerOpen}
        searchQuery={searchQuery}
        onDrawerToggle={() => setDrawerOpen(!drawerOpen)}
        onSearchChange={handleSearchChange}
      />

      <NavigationDrawer
        drawerOpen={drawerOpen}
        menuItems={menuItems}
        onDrawerClose={() => setDrawerOpen(false)}
        onAccountClick={() => navigate('/profile')}
        onLogOut={handleLogOut}
      />

      {
        searchQuery && (
          <SearchResults 
        filteredMenu={filteredMenu} 
        searchQuery={searchQuery} 
      />
        )
      }

      <CategoryTabs
        menuItems={menuItems}
        onOrderClick={() => setDialogOpen(true)}
        onLike={handleLikeClick}
        onDislike={handleDislikeClick}
        onAddToWishlist={handleAddToWishlist}
      />

      <OrderDialogs
  dialogOpen={dialogOpen}
  orderDialogOpen={orderDialogOpen}
  receiptDialogOpen={receiptDialogOpen}
  menuItems={menuItems}
  selectedItems={selectedItems}
  email={email} // Make sure this is passed
  onDialogClose={() => setDialogOpen(false)}
  onOrderDialogClose={() => setOrderDialogOpen(false)}
  onReceiptDialogClose={() => setReceiptDialogOpen(false)}
  onDialogClick={() => {
    setDialogOpen(false);
    setOrderDialogOpen(true);
  }}
  onCheckboxChange={handleCheckboxChange}
  onQuantityChange={handleQuantityChange}
  onOrderSubmit={handleOrderSubmitClick}
  onDownloadReceipt={downloadReceipt}
  onViewReceipt={handleViewReceipt}
/>
    </>
  );
};

export default Menu;