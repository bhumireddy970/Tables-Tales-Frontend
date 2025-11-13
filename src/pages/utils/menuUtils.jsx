// Utility functions for menu operations

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

export const handleLike = async (menuId, setLikes) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/item/update-likes/${menuId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      setLikes((prevLikes) => ({
        ...prevLikes,
        [menuId]: (prevLikes[menuId] || 0) + 1,
      }));
      return true;
    } else {
      throw new Error('Failed to update like');
    }
  } catch (err) {
    console.error('Error updating like:', err.message);
    return false;
  }
};

export const handleDislike = async (menuId, setDislikes) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/item/update-dislikes/${menuId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      setDislikes((prevDislikes) => ({
        ...prevDislikes,
        [menuId]: (prevDislikes[menuId] || 0) + 1,
      }));
      return true;
    } else {
      throw new Error('Failed to update dislike');
    }
  } catch (err) {
    console.error('Error updating dislike:', err.message);
    return false;
  }
};

export const handleCartClick = async (email, itemId) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/customer/wishlist/${email}/${itemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('Item added to wishlist!');
      return true;
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to add item to wishlist.');
      return false;
    }
  } catch (err) {
    console.error('Error occurred while adding item to wishlist:', err);
    alert('An error occurred. Please try again later.');
    return false;
  }
};

export const handleOrderSubmit = async (selectedItems, email, menuItems) => {
  const items = Object.entries(selectedItems).map(([menuId, details]) => ({
    menuId,
    quantity: details.quantity,
  }));

  try {
    const response = await fetch(`${BACKEND_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, customerName: email }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, orderId: data.orderId };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message };
    }
  } catch (error) {
    console.error('Error placing order:', error);
    return { success: false, message: 'An error occurred while placing the order.' };
  }
};

// Calculate total amount
export const calculateTotalAmount = (selectedItems) => {
  return Object.values(selectedItems).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};