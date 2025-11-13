import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  Alert,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Box,
  Paper,
  Avatar,
  CircularProgress,
  alpha,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Tapas,
  Restaurant,
  AttachMoney,
  Description,
  PhotoCamera,
  CheckCircle,
  Category,
  Fastfood
} from '@mui/icons-material';
import { useUser } from '../../contextAPI/context';
import { useNavigate } from 'react-router-dom';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: null,
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

  const categories = [
    'tiffin',
    'Fast Food',
    'Full meals',
    'Sea food',
    'Snack',
    'Beverage',
    'Salad',
    'Cuisine',
    'Dessert',
    'Special'
  ];

  const steps = ['Basic Information', 'Pricing & Category', 'Description & Image'];

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[A-Za-z0-9\s\-&]+$/
    },
    category: {
      required: true
    },
    price: {
      required: true,
      min: 1,
      max: 10000,
      pattern: /^\d+(\.\d{1,2})?$/
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    image: {
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
      error = `Minimum price is $${rules.min}`;
    } else if (rules.max !== undefined && parseFloat(value) > rules.max) {
      error = `Maximum price is $${rules.max}`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      switch (name) {
        case 'name':
          error = 'Only letters, numbers, spaces, hyphens, and ampersands are allowed';
          break;
        case 'price':
          error = 'Please enter a valid price (e.g., 12.99)';
          break;
        default:
          error = 'Invalid format';
      }
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file (JPEG, PNG, WebP)' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));

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
        stepFields = ['name'];
        break;
      case 1:
        stepFields = ['category', 'price'];
        break;
      case 2:
        stepFields = ['description', 'image'];
        break;
      default:
        stepFields = [];
    }

    const stepErrors = {};
    stepFields.forEach(field => {
      const error = validateField(field, formData[field]);
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
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const newFormData = new FormData();
    newFormData.append('name', formData.name);
    newFormData.append('category', formData.category);
    newFormData.append('price', formData.price);
    newFormData.append('description', formData.description);
    newFormData.append('image', formData.image);

    try {
      const response = await fetch(`${BACKEND_API_URL}/admin/addItem`, {
        method: 'POST',
        body: newFormData,
      });

      if (!response.ok) throw new Error('Failed to add item');

      const data = await response.json();
      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        setFormData({
          name: '',
          category: '',
          price: '',
          description: '',
          image: null,
        });
        setImagePreview(null);
        setActiveStep(0);
        setTouched({});
        setErrors({});
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding item:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to add item. Please try again.' }));
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Fastfood color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter the name of the dish"
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  label="Category"
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <Category color="action" />
                    </InputAdornment>
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.price}
                helperText={errors.price}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="action" />
                    </InputAdornment>
                  ),
                  inputProps: { 
                    min: 1, 
                    max: 10000,
                    step: 0.01
                  }
                }}
              />
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.description}
                helperText={`${formData.description.length}/500 ${errors.description || ''}`}
                fullWidth
                multiline
                rows={4}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Describe the dish, ingredients, and special features..."
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="item-image-upload"
                  required
                />
                <label htmlFor="item-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{ mb: 2 }}
                  >
                    Upload Dish Photo
                  </Button>
                </label>
                {errors.image && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.image}
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
                      Image Preview
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
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.1)} 100%)`,
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
                  background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.primary.main} 100%)`,
                  mb: 2
                }}
              >
                <Tapas sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Add New Menu Item
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Create a delicious new addition to your restaurant menu
              </Typography>
            </Box>

            {/* Success Alert */}
            {success && (
              <Alert 
                severity="success" 
                icon={<CheckCircle />}
                sx={{ mb: 3 }}
              >
                Menu item added successfully!
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
                      {loading ? 'Adding Item...' : 'Add Menu Item'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.primary.main} 100%)`
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
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold" color="warning.main">
            🍽️ Menu Item Tips
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Use high-quality, appetizing food photos<br/>
            • Write engaging descriptions that highlight key ingredients<br/>
            • Choose appropriate categories for better menu organization<br/>
            • Set competitive prices based on ingredients and portion size<br/>
            • Consider dietary information and allergens
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddItem;