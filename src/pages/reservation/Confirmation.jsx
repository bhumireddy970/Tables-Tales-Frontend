import React, { useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import {
  CheckCircle,
  Download,
  Share,
  CalendarToday,
  LocationOn,
  People,
  Chair
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Confirmation = ({ reservationData, selectedTable, onBackToHome }) => {
  const theme = useTheme();
  const receiptRef = useRef();

  const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    // Convert 24h time to 12h format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const generateReceiptContent = () => {
    const reservationId = `TT${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    return {
      reservationId,
      currentDate,
      currentTime,
      formattedTime: formatTime(reservationData.time)
    };
  };

  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`TableTales-Reservation-${generateReceiptContent().reservationId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating receipt. Please try again.');
    }
  };

  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        const receiptContent = generateReceiptContent();
        const shareText = `
Table Tales Reservation Confirmation

Reservation ID: ${receiptContent.reservationId}
Location: ${reservationData.branch?.name}
Date: ${formatDate(reservationData.date)}
Time: ${receiptContent.formattedTime}
Party Size: ${reservationData.partySize} people
Table: ${selectedTable?.tableNumber}
Guest: ${reservationData.customer.name}

Thank you for your reservation!
        `.trim();

        await navigator.share({
          title: 'Table Tales Reservation',
          text: shareText,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      const receiptContent = generateReceiptContent();
      const shareText = `
Table Tales Reservation Confirmation

Reservation ID: ${receiptContent.reservationId}
Location: ${reservationData.branch?.name}
Date: ${formatDate(reservationData.date)}
Time: ${receiptContent.formattedTime}
Party Size: ${reservationData.partySize} people
Table: ${selectedTable?.tableNumber}
Guest: ${reservationData.customer.name}

Thank you for your reservation!
      `.trim();

      try {
        await navigator.clipboard.writeText(shareText);
        alert('Reservation details copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Sharing not supported on this device.');
      }
    }
  };

  const receiptContent = generateReceiptContent();

  return (
    <>
      {/* Hidden receipt for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={receiptRef} style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          padding: '20mm',
          backgroundColor: 'white',
          color: 'black',
          fontFamily: 'Arial, sans-serif'
        }}>
          {/* Receipt Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #4CAF50', paddingBottom: '20px' }}>
            <h1 style={{ color: '#4CAF50', margin: '0 0 10px 0', fontSize: '28px' }}>Table Tales</h1>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#333' }}>Reservation Confirmation</h2>
            <p style={{ margin: '5px 0', color: '#666' }}>Reservation ID: {receiptContent.reservationId}</p>
            <p style={{ margin: '5px 0', color: '#666' }}>Confirmed on: {receiptContent.currentDate} at {receiptContent.currentTime}</p>
          </div>

          {/* Reservation Details */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#4CAF50', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Reservation Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div>
                <strong>Location:</strong><br/>
                {reservationData.branch?.name}<br/>
                {reservationData.branch?.address?.street}, {reservationData.branch?.address?.city}
              </div>
              
              <div>
                <strong>Date & Time:</strong><br/>
                {formatDate(reservationData.date)}<br/>
                {receiptContent.formattedTime}
              </div>
              
              <div>
                <strong>Party Size:</strong><br/>
                {reservationData.partySize} people
              </div>
              
              <div>
                <strong>Table:</strong><br/>
                Table {selectedTable?.tableNumber}<br/>
                {selectedTable?.tableType} (Capacity: {selectedTable?.capacity})
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#4CAF50', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Guest Information</h3>
            <div style={{ marginTop: '15px' }}>
              <strong>Name:</strong> {reservationData.customer.name}<br/>
              <strong>Email:</strong> {reservationData.customer.email}<br/>
              <strong>Phone:</strong> {reservationData.customer.phone}
            </div>
          </div>

          {/* Special Requests */}
          {reservationData.specialRequests && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#4CAF50', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Special Requests</h3>
              <p style={{ marginTop: '15px' }}>{reservationData.specialRequests}</p>
            </div>
          )}

          {/* Terms and Conditions */}
          <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#4CAF50', marginTop: '0' }}>Important Information</h3>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              <li>Please arrive on time - tables are held for 15 minutes after reservation time</li>
              <li>Contact the restaurant for any changes or cancellations</li>
              <li>Present this confirmation at the reception</li>
            </ul>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #4CAF50', color: '#666' }}>
            <p style={{ margin: '5px 0' }}>Thank you for choosing Table Tales!</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>For inquiries: contact@tabletales.com | +1 (555) 123-4567</p>
          </div>
        </div>
      </div>

      {/* Main Confirmation Component */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'success.main',
              color: 'white',
              mb: 3
            }}
          >
            <CheckCircle sx={{ fontSize: 40 }} />
          </Box>

          <Typography variant="h4" fontWeight="bold" gutterBottom color="success.main">
            Reservation Confirmed!
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            Your table has been successfully reserved. We look forward to serving you at Table Tales!
          </Typography>

          {/* Reservation Details */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: alpha('#000', 0.02),
              border: `1px solid ${alpha('#000', 0.1)}`,
              mb: 4,
              maxWidth: 500,
              mx: 'auto'
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Reservation Details
            </Typography>

            <Box sx={{ textAlign: 'left' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <LocationOn color="primary" />
                <Box>
                  <Typography variant="body2" color="textSecondary">Location</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {reservationData.branch?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {reservationData.branch?.address.street}, {reservationData.branch?.address.city}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <CalendarToday color="primary" />
                <Box>
                  <Typography variant="body2" color="textSecondary">Date & Time</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {formatDate(reservationData.date)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatTime(reservationData.time)}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <People color="primary" />
                <Box>
                  <Typography variant="body2" color="textSecondary">Party Size</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {reservationData.partySize} people
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Chair color="primary" />
                <Box>
                  <Typography variant="body2" color="textSecondary">Table</Typography>
                  <Typography variant="body1" fontWeight="500">
                    Table {selectedTable?.tableNumber}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedTable?.tableType} • Capacity: {selectedTable?.capacity}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <People color="primary" />
                <Box>
                  <Typography variant="body2" color="textSecondary">Guest</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {reservationData.customer.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {reservationData.customer.email} • {reservationData.customer.phone}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
              }}
            >
              <Typography variant="body2" color="success.main" fontWeight="500">
                ✅ Your table will be held for 15 minutes after the reservation time
              </Typography>
            </Box>
          </Paper>

          {/* Action Buttons */}
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadPDF}
            >
              Download Receipt
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={shareReceipt}
            >
              Share Reservation
            </Button>
            <Button
              variant="contained"
              onClick={onBackToHome}
              sx={{ px: 4 }}
            >
              Back to Home
            </Button>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
            A confirmation email has been sent to {reservationData.customer.email}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default Confirmation;