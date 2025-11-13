import React from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Button 
} from '@mui/material';
import { jsPDF } from 'jspdf';

const OrderReceipt = ({ menuItems, selectedItems, email, onDownload }) => {
  const items = Object.entries(selectedItems).map(([menuId, details]) => ({
    name: menuItems.find((item) => item._id === menuId)?.name || 'Unknown Item',
    price: details.price,
    quantity: details.quantity,
    total: details.price * details.quantity,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }

    // Fallback download function if onDownload prop is not provided
    const doc = new jsPDF();

    // Title with customized font and positioning
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text('Table Tales Receipt', 105, 20, null, null, 'center');
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

    // Customer information
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Customer: ${email || 'Guest'}`, 20, 40);

    // Draw a horizontal line to separate title from items
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    let yPosition = 55;
    doc.text('Items:', 20, yPosition);
    yPosition += 10;

    // Add each item and its price/quantity
    items.forEach((item) => {
      doc.setFont("helvetica", "normal");
      doc.text(`${item.name}`, 20, yPosition);
      doc.text(`₹${item.price} x ${item.quantity}`, 140, yPosition, { align: 'right' });
      doc.text("🛒", 170, yPosition);
      yPosition += 8;
    });

    // Spacer before totals
    yPosition += 10;

    // Draw a line before totals section
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);

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

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Order Receipt
      </Typography>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Item Name</strong></TableCell>
            <TableCell><strong>Quantity</strong></TableCell>
            <TableCell><strong>Price per Item (₹)</strong></TableCell>
            <TableCell><strong>Total (₹)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell>₹{item.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">
          Subtotal: ₹{subtotal.toFixed(2)}
        </Typography>
        <Typography variant="h6">
          Tax (18%): ₹{tax.toFixed(2)}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
          Total: ₹{total.toFixed(2)}
        </Typography>
      </Box>

      {/* Download Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleDownload}
          size="large"
        >
          Download Receipt as PDF
        </Button>
      </Box>
    </Box>
  );
};

export default OrderReceipt;