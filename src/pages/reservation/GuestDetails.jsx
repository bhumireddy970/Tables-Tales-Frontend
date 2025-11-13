import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Paper,
  alpha
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Notes,
  Chair
} from '@mui/icons-material';

const GuestDetails = ({ reservationData, onDataChange, selectedTable, onNext, onBack }) => {
  const handleCustomerChange = (field, value) => {
    onDataChange({
      customer: {
        ...reservationData.customer,
        [field]: value
      }
    });
  };

  const handleSpecialRequestsChange = (value) => {
    onDataChange({ specialRequests: value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // If it's already a Date object
    if (dateString instanceof Date) {
      return dateString.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // If it's a string (from date input)
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isFormValid = () => {
    return (
      reservationData.customer.name?.trim() &&
      reservationData.customer.email?.trim() &&
      reservationData.customer.phone?.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reservationData.customer.email) &&
      reservationData.customer.phone.replace(/\D/g, '').length >= 10
    );
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Guest Information
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Please provide your details to complete the reservation
        </Typography>

        <Grid container spacing={4}>
          {/* Guest Details Form */}
          <Grid item xs={12} md={7}>
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={reservationData.customer.name || ''}
                    onChange={(e) => handleCustomerChange('name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={reservationData.customer.email || ''}
                    onChange={(e) => handleCustomerChange('email', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={reservationData.customer.phone || ''}
                    onChange={(e) => handleCustomerChange('phone', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notes /> Special Requests
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Any special requirements, allergies, or occasions we should know about?"
                value={reservationData.specialRequests || ''}
                onChange={(e) => handleSpecialRequestsChange(e.target.value)}
              />
            </Box>
          </Grid>

          {/* Reservation Summary */}
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: alpha('#000', 0.02),
                border: `1px solid ${alpha('#000', 0.1)}`
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Reservation Summary
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">Branch</Typography>
                <Typography variant="body1" fontWeight="500">
                  {reservationData.branch?.name}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">Date & Time</Typography>
                <Typography variant="body1" fontWeight="500">
                  {formatDate(reservationData.date)} at {reservationData.time}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">Party Size</Typography>
                <Typography variant="body1" fontWeight="500">
                  {reservationData.partySize} people
                </Typography>
              </Box>

              {selectedTable && (
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Chair sx={{ fontSize: 16 }} /> Table
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    Table {selectedTable.tableNumber} ({selectedTable.tableType})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Capacity: {selectedTable.capacity} people
                  </Typography>
                </Box>
              )}

              <Box mt={3} p={2} sx={{ backgroundColor: alpha('#000', 0.05), borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  💡 Your table will be held for 15 minutes after the reservation time
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button variant="outlined" onClick={onBack}>
            Back to Date & Time
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={onNext}
            disabled={!isFormValid()}
            sx={{ px: 4 }}
          >
            Confirm Reservation
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GuestDetails;