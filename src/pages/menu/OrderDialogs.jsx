import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
} from '@mui/material';
import OrderReceipt from './OrderReceipt';

const OrderDialogs = ({
  dialogOpen,
  orderDialogOpen,
  receiptDialogOpen,
  menuItems,
  selectedItems,
  email,
  onDialogClose,
  onOrderDialogClose,
  onReceiptDialogClose,
  onDialogClick,
  onCheckboxChange,
  onQuantityChange,
  onOrderSubmit,
  onDownloadReceipt,
  onViewReceipt, // Add this new prop
}) => {
  const totalAmount = Object.values(selectedItems).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={onDialogClose}
        onConfirm={onDialogClick}
      />

      <OrderSelectionDialog
        open={orderDialogOpen}
        onClose={onOrderDialogClose}
        menuItems={menuItems}
        selectedItems={selectedItems}
        totalAmount={totalAmount}
        onCheckboxChange={onCheckboxChange}
        onQuantityChange={onQuantityChange}
        onOrderSubmit={onOrderSubmit}
        onViewReceipt={onViewReceipt} // Pass the new prop
      />

      <ReceiptDialog
        open={receiptDialogOpen}
        onClose={onReceiptDialogClose}
        menuItems={menuItems}
        selectedItems={selectedItems}
        onDownload={onDownloadReceipt}
        onBack={() => {
          onReceiptDialogClose();
          // Don't close order dialog here, just open it
        }}
      />
    </>
  );
};

const ConfirmationDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Require Confirmation</DialogTitle>
    <DialogContent>
      <DialogContentText>Do you want to order now?</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm}>Order It</Button>
    </DialogActions>
  </Dialog>
);

const OrderSelectionDialog = ({
  open,
  onClose,
  menuItems,
  selectedItems,
  totalAmount,
  onCheckboxChange,
  onQuantityChange,
  onOrderSubmit,
  onViewReceipt, // This should open the receipt dialog
}) => {
  // Check if any items are selected
  const hasSelectedItems = Object.keys(selectedItems).length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Items</DialogTitle>
      <DialogContent>
        {menuItems.length === 0 ? (
          <Typography>Loading menu items...</Typography>
        ) : (
          <>
            {menuItems.map((menu) => (
              <MenuItemSelection
                key={menu._id}
                menu={menu}
                selected={!!selectedItems[menu._id]}
                quantity={selectedItems[menu._id]?.quantity || 1}
                onCheckboxChange={onCheckboxChange}
                onQuantityChange={onQuantityChange}
              />
            ))}
            <Typography variant="h6" mt={2}>
              Total: ₹{totalAmount}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onViewReceipt}
          disabled={!hasSelectedItems} // Disable if no items selected
        >
          View Receipt
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onOrderSubmit}
          disabled={!hasSelectedItems} // Disable if no items selected
        >
          Place Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MenuItemSelection = ({ menu, selected, quantity, onCheckboxChange, onQuantityChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <FormControlLabel
      control={
        <Checkbox
          checked={selected}
          onChange={() => onCheckboxChange(menu._id, menu.price)}
        />
      }
      label={`${menu.name} - ₹${menu.price}`}
    />
    {selected && (
      <TextField
        sx={{ ml: 2 }}
        type="number"
        label="Quantity"
        size="small"
        variant="outlined"
        value={quantity}
        onChange={(e) => onQuantityChange(menu._id, parseInt(e.target.value, 10))}
        inputProps={{ min: 1 }}
      />
    )}
  </Box>
);

const ReceiptDialog = ({ open, onClose, menuItems, selectedItems, email, onDownload, onBack }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>Receipt</DialogTitle>
    <DialogContent>
      <OrderReceipt 
        menuItems={menuItems} 
        selectedItems={selectedItems} 
        email={email}
        onDownload={onDownload}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onBack}>Back to Order</Button>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default OrderDialogs;