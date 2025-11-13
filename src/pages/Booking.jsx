import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Grid, InputLabel, FormControl, MenuItem, Select, Box, Snackbar, Alert } from '@mui/material';
import Layout from '../components/Layout/Layout';
import { useUser } from '../contextAPI/context';
import backImg from '../assets/signin.jpeg';
import TapasIcon from '@mui/icons-material/Tapas';


const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

export default function CateringForm() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    numberOfGuests: '',
    dietaryPreferences: '',
    contactPerson: '',
    noOfDays: 0,
    contactPhone: '',
    specialRequests: '',
    eventType: '', // New field for event type
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false)
  const { email } = useUser();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request using fetch API
      const response = await fetch(`${BACKEND_API_URL}/catering/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify(formData), // Send form data as a JSON string
      });

      // Parse the response from the server
      const data = await response.json();

      if (response.ok) {
        setFormData({
          eventName: '',
          eventDate: '',
          numberOfGuests: '',
          dietaryPreferences: '',
          contactPerson: '',
          noOfDays: 0,
          contactPhone: '',
          specialRequests: '',
          eventType: '',
        });
        setMessage('Request submitted successfully!');
        setError(false); // Reset error state
        setOpenDialog(true)
        setOpenSnackbar(true);
      } else {
        setMessage('There was an error submitting your request. Please try again.');
        setError(true);
        setOpenSnackbar(true);
      }
    } catch (error) {
      // Catch any network or other errors and show an error message
      console.error('Error submitting form:', error);
      setMessage('There was an error submitting your request. Please try again.');
      setError(true);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Box sx={{ backgroundImage: `url(${backImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ maxWidth: '800px', margin: 'auto', padding: 3, backdropFilter: 'blur(20px)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <TapasIcon color="goldenrod" size='large' />
              <Typography variant="h4" sx={{ fontWeight: 'bold', my: 3 }} gutterBottom align="center">
                Catering Request Form
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Event Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Event Name"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                />
              </Grid>

              {/* Event Type (New Field) */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="medium" required>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    label="Event Type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                  >
                    <MenuItem value="wedding">Wedding</MenuItem>
                    <MenuItem value="corporate">Corporate Event</MenuItem>
                    <MenuItem value="birthday">Birthday Party</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Event Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Event Date"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Number of Guests */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Guests"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  required
                  variant="outlined"
                  size="medium"
                  helperText="Please enter the estimated number of guests"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Days"
                  name="noOfDays"
                  value={formData.noOfDays}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  required
                  variant="outlined"
                  size="medium"
                  helperText="Please enter the exact number of days"
                />
              </Grid>

              {/* Dietary Preferences */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dietary Preferences"
                  name="dietaryPreferences"
                  value={formData.dietaryPreferences}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                  helperText="E.g., vegetarian, vegan, gluten-free"
                />
              </Grid>

              {/* Contact Person */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Person"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                />
              </Grid>

              {/* Contact Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Phone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                  type="tel"
                  helperText="Please enter a valid phone number"
                />
              </Grid>

              {/* Special Requests */}
              <Grid item xs={12}>
                <TextField
                  label="Special Requests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  size="medium"
                  helperText="Any special requests or additional details"
                />
              </Grid>

              {/* Submit Button */}

            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="submit" variant="contained" color="success"  >
                Submit Request
              </Button>
            </Box>
          </Box>

          {/* Snackbar for error/success message */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>

        </form>
      </Box>
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Thank You for choosing{' '}
          <span style={{ color: 'goldenrod', fontWeight: 'bold' }}>
            Table
            <Button variant='contained' color='success' sx={{ ml: 1 }}>
              <Typography sx={{ color: 'goldenrod', fontSize: '18px', fontWeight: 'bold' }}>Tales</Typography>
            </Button>
          </span>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <span style={{ fontSize: '6rem', textAlign: 'center' }}>🎉</span>
          </Box>

          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Your Catering request has been accepted successfully!
          </Typography>

          

          <Typography variant="body1" align="center" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 2 }}>
             Thank you for your time and trust! We will make the event memorable 🌟
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="success" variant="contained" sx={{  fontWeight: 'bold' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
</>
    
  );
}
