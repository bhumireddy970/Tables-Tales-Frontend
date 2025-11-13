import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography, 
  CircularProgress, 
  Snackbar, 
  Alert 
} from '@mui/material';
import { useUser } from '../../contextAPI/context';
import { useNavigate } from 'react-router-dom';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const DeliverBoyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const { role } = useUser();
    const navigate = useNavigate();

  
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch(`${BACKEND_API_URL}/item/menu-items`);
                if (!response.ok) {
                    throw new Error('Failed to fetch menu items');
                }
                const data = await response.json();
                setMenuItems(data);
            } catch (err) {
                console.error("Error fetching menu items:", err);
            }
        };
        fetchMenuItems();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${BACKEND_API_URL}/orders/deliveryboy/showpendingorders`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                const updatedOrders = data.order.map(order => ({
                    ...order,
                    status: order.status === 'completed' ? 'delivered' : order.status
                }));
                setOrders(updatedOrders);
                setLoading(false);
            } catch (err) {
                console.error("Error occurred while fetching orders:", err);
                alert("Failed to load orders.");
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getOrderStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'ordered':
                return 'blue';
            case 'pending':
                return 'orange';
            case 'delivered':
                return 'green';
            case 'canceled':
                return 'red';
            default:
                return 'gray';
        }
    };

    const getItemName = (menuId) => {
        const item = menuItems.find(item => item._id === menuId);
        return item ? item.name : 'Unknown Item';
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${BACKEND_API_URL}/orders/changestatus/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            const data = await response.json();
            setSnackbarMessage(data.message || "Order status updated successfully!");
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            console.error("Error updating order status:", error);
            setSnackbarMessage("Error updating order status.");
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <div style={{ padding: '20px' }} data-testid="delivery-boy-orders-page">
            <Typography 
                variant="h4" 
                gutterBottom 
                data-testid="page-title"
            >
                Pending Orders for Delivery
            </Typography>
            
            {loading ? (
                <div 
                    style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
                    data-testid="loading-spinner"
                >
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer data-testid="orders-table-container">
                    <Table data-testid="orders-table">
                        <TableHead>
                            <TableRow>
                                <TableCell data-testid="column-order-id">Order ID</TableCell>
                                <TableCell data-testid="column-customer-name">Customer Name</TableCell>
                                <TableCell data-testid="column-items">Items</TableCell>
                                <TableCell data-testid="column-total-amount">Total Amount</TableCell>
                                <TableCell data-testid="column-status">Status</TableCell>
                                <TableCell data-testid="column-update-status">Update Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody data-testid="orders-table-body">
                            {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <TableRow 
                                        key={order._id} 
                                        hover
                                        data-testid={`order-row-${index}`}
                                        data-order-id={order._id}
                                    >
                                        <TableCell data-testid="order-id">{order._id}</TableCell>
                                        <TableCell data-testid="customer-name">{order.customerName}</TableCell>
                                        <TableCell data-testid="order-items">
                                            {order.items.map(item =>
                                                `${getItemName(item.menuId)} (x${item.quantity})`).join(', ')}
                                        </TableCell>
                                        <TableCell data-testid="total-amount">{`₹${order.totalAmount}`}</TableCell>
                                        <TableCell data-testid="order-status">
                                            <Typography 
                                                sx={{ color: getOrderStatusColor(order.status) }}
                                                data-testid="status-text"
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell data-testid="status-update-cell">
                                            <FormControl fullWidth>
                                                <InputLabel data-testid="status-label">Status</InputLabel>
                                                <Select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    inputProps={{ 
                                                        'data-testid': `status-select-${index}`,
                                                        'data-order-id': order._id
                                                    }}
                                                    data-testid="status-select"
                                                >
                                                    <MenuItem 
                                                        value="pending"
                                                        data-testid="status-option-pending"
                                                    >
                                                        Pending
                                                    </MenuItem>
                                                    <MenuItem 
                                                        value="delivered"
                                                        data-testid="status-option-delivered"
                                                    >
                                                        Delivered
                                                    </MenuItem>
                                                    <MenuItem 
                                                        value="canceled"
                                                        data-testid="status-option-canceled"
                                                    >
                                                        Canceled
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow data-testid="no-orders-row">
                                    <TableCell 
                                        colSpan={6} 
                                        data-testid="no-orders-message"
                                        style={{ textAlign: 'center' }}
                                    >
                                        No pending orders to deliver.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Snackbar for success/error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                data-testid="snackbar"
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity={snackbarSeverity} 
                    sx={{ width: '100%' }}
                    data-testid="snackbar-alert"
                    data-severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DeliverBoyOrders;
