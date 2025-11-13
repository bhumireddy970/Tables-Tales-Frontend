
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Input,
  Card,
  CardContent,
  Alert,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  alpha,
  useTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  DeliveryDining,
  Email,
  Person,
  Phone,
  Star,
  CheckCircle,
  PhotoCamera,
  TwoWheeler
} from '@mui/icons-material';
import { useUser } from '../../contextAPI/context';
import { useNavigate } from 'react-router-dom';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const AddDeliveryBoy = () => {
  const [newDeliveryBoy, setNewDeliveryBoy] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    status: 'available',
    rating: 0,
    completedOrders: 0,
    imageURL: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const { role } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();



  const steps = ['Personal Info', 'Contact Details', 'Work Information'];

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/
    },
    lastName: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/
    },
    phone: {
      required: true,
      pattern: /^\+?[\d\s-()]{10,}$/
    },
    rating: {
      required: true,
      min: 0,
      max: 5
    },
    completedOrders: {
      required: false,
      min: 0
    },
    imageURL: {
      required: true
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    let error = '';

    if (rules.required && !value) {
      error = 'This field is required';
    } else if (rules.minLength && value.length < rules.minLength) {
      error = `Minimum ${rules.minLength} characters required`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      error = `Maximum ${rules.maxLength} characters allowed`;
    } else if (rules.min !== undefined && parseFloat(value) < rules.min) {
      error = `Minimum value is ${rules.min}`;
    } else if (rules.max !== undefined && parseFloat(value) > rules.max) {
      error = `Maximum value is ${rules.max}`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      switch (name) {
        case 'email':
          error = 'Please enter a valid email address';
          break;
        case 'phone':
          error = 'Please enter a valid phone number';
          break;
        default:
          error = 'Invalid format';
      }
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(newDeliveryBoy).forEach(key => {
      if (key !== 'status') { // status has default value
        const error = validateField(key, newDeliveryBoy[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDeliveryBoy(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, newDeliveryBoy[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, imageURL: 'Please select a valid image file (JPEG, PNG, WebP)' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageURL: 'Image size should be less than 5MB' }));
        return;
      }

      setNewDeliveryBoy(prev => ({ ...prev, imageURL: file }));
      setErrors(prev => ({ ...prev, imageURL: '' }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    let stepFields = [];
    switch (activeStep) {
      case 0:
        stepFields = ['firstName', 'lastName'];
        break;
      case 1:
        stepFields = ['email', 'phone'];
        break;
      case 2:
        stepFields = ['rating', 'imageURL'];
        break;
      default:
        stepFields = [];
    }

    const stepErrors = {};
    stepFields.forEach(field => {
      const error = validateField(field, newDeliveryBoy[field]);
      if (error) stepErrors[field] = error;
    });

    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...stepErrors }));
      const newTouched = {};
      stepFields.forEach(field => { newTouched[field] = true; });
      setTouched(prev => ({ ...prev, ...newTouched }));
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {};
    Object.keys(newDeliveryBoy).forEach(key => { 
      if (key !== 'status') allTouched[key] = true; 
    });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('email', newDeliveryBoy.email);
    formData.append('firstName', newDeliveryBoy.firstName);
    formData.append('lastName', newDeliveryBoy.lastName);
    formData.append('phone', newDeliveryBoy.phone);
    formData.append('status', newDeliveryBoy.status);
    formData.append('rating', newDeliveryBoy.rating.toString());
    formData.append('completedOrders', newDeliveryBoy.completedOrders.toString());
    formData.append('imageURL', newDeliveryBoy.imageURL);

    try {
      const response = await fetch(`${BACKEND_API_URL}/deliveryboy/add`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add delivery boy');

      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        setNewDeliveryBoy({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          status: 'available',
          rating: 0,
          completedOrders: 0,
          imageURL: null,
        });
        setImagePreview(null);
        setActiveStep(0);
        setTouched({});
        setErrors({});
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error(error);
      setErrors(prev => ({ ...prev, submit: 'Failed to add delivery boy. Please try again.' }));
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                name="firstName"
                value={newDeliveryBoy.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter first name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                name="lastName"
                value={newDeliveryBoy.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter last name"
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                fullWidth
                name="email"
                type="email"
                value={newDeliveryBoy.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={errors.email}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="delivery@example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                fullWidth
                name="phone"
                value={newDeliveryBoy.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.phone}
                helperText={errors.phone}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="+1 (555) 123-4567"
              />
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rating"
                fullWidth
                type="number"
                name="rating"
                value={newDeliveryBoy.rating}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.rating}
                helperText={errors.rating}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Star color="action" />
                    </InputAdornment>
                  ),
                  inputProps: { 
                    min: 0, 
                    max: 5,
                    step: 0.1
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Completed Orders"
                fullWidth
                type="number"
                name="completedOrders"
                value={newDeliveryBoy.completedOrders}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.completedOrders}
                helperText={errors.completedOrders}
                InputProps={{
                  inputProps: { 
                    min: 0
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newDeliveryBoy.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="busy">Busy</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Input
                  type="file"
                  name="imageURL"
                  onChange={handleImageChange}
                  sx={{ display: 'none' }}
                  id="delivery-boy-image-upload"
                  required
                />
                <label htmlFor="delivery-boy-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{ mb: 2 }}
                  >
                    Upload Profile Photo
                  </Button>
                </label>
                {errors.imageURL && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.imageURL}
                  </Typography>
                )}
                
                {imagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <Avatar
                      src={imagePreview}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        border: `3px solid ${theme.palette.primary.main}`
                      }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Photo Preview
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.info.light, 0.1)} 100%)`,
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'visible',
            background: 'white',
            mt: 2
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
                  mb: 2
                }}
              >
                <DeliveryDining sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Add Delivery Partner
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Register a new delivery partner to join your team
              </Typography>
            </Box>

            {/* Success Alert */}
            {success && (
              <Alert 
                severity="success" 
                icon={<CheckCircle />}
                sx={{ mb: 3 }}
              >
                Delivery partner added successfully!
              </Alert>
            )}

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              {/* Step Content */}
              <Box sx={{ mb: 4 }}>
                {getStepContent(activeStep)}
              </Box>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                >
                  Back
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        px: 4
                      }}
                    >
                      {loading ? 'Adding Partner...' : 'Add Delivery Partner'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Submit Error */}
              {errors.submit && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errors.submit}
                </Alert>
              )}
            </form>

            {/* Progress Indicator */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Paper
          sx={{
            p: 3,
            mt: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold" color="info.main">
            🚀 Delivery Partner Tips
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Ensure contact information is accurate and verified<br/>
            • Use professional profile photos for better customer trust<br/>
            • Set realistic initial ratings based on experience<br/>
            • Provide proper onboarding and training materials
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddDeliveryBoy;