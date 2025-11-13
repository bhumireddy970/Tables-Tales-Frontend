
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
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import {
  Tapas,
  Person,
  Work,
  Star,
  Description,
  PhotoCamera,
  CheckCircle,
  Restaurant
} from '@mui/icons-material';
import { useUser } from '../../contextAPI/context';
import { useNavigate } from 'react-router-dom';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const AddChefs = () => {
  const [newChef, setNewChef] = useState({
    name: '',
    speciality: '',
    experience: '',
    rating: '',
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



  const steps = ['Basic Info', 'Experience & Rating', 'Description & Image'];

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/
    },
    speciality: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    experience: {
      required: true,
      min: 0,
      max: 50
    },
    rating: {
      required: true,
      min: 1,
      max: 5
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
    let error = '';

    if (rules.required && !value) {
      error = 'This field is required';
    } else if (rules.minLength && value.length < rules.minLength) {
      error = `Minimum ${rules.minLength} characters required`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      error = `Maximum ${rules.maxLength} characters allowed`;
    } else if (rules.min && parseFloat(value) < rules.min) {
      error = `Minimum value is ${rules.min}`;
    } else if (rules.max && parseFloat(value) > rules.max) {
      error = `Maximum value is ${rules.max}`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = 'Invalid format';
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(newChef).forEach(key => {
      const error = validateField(key, newChef[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewChef(prev => ({ ...prev, [name]: value }));

    // Validate field on change if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, newChef[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file (JPEG, PNG, WebP)' }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      setNewChef(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    let stepFields = [];
    switch (activeStep) {
      case 0:
        stepFields = ['name', 'speciality'];
        break;
      case 1:
        stepFields = ['experience', 'rating'];
        break;
      case 2:
        stepFields = ['description', 'image'];
        break;
      default:
        stepFields = [];
    }

    const stepErrors = {};
    stepFields.forEach(field => {
      const error = validateField(field, newChef[field]);
      if (error) stepErrors[field] = error;
    });

    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...stepErrors }));
      // Mark fields as touched to show errors
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
    
    // Mark all fields as touched to show all errors
    const allTouched = {};
    Object.keys(newChef).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Object.keys(newChef).forEach(key => formData.append(key, newChef[key]));

    try {
      const response = await fetch(`${BACKEND_API_URL}/chef/addchef`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add chef');

      setSuccess(true);
      setLoading(false);
      
      // Reset form after success
      setTimeout(() => {
        setNewChef({
          name: '',
          speciality: '',
          experience: '',
          rating: '',
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
      console.error(error);
      setErrors(prev => ({ ...prev, submit: 'Failed to add chef. Please try again.' }));
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
                label="Chef Name"
                fullWidth
                name="name"
                value={newChef.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.name}
                helperText={errors.name}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter chef's full name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Speciality"
                fullWidth
                name="speciality"
                value={newChef.speciality}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.speciality}
                helperText={errors.speciality}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Restaurant color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g., Italian Cuisine, Pastry, BBQ"
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience (years)"
                fullWidth
                type="number"
                name="experience"
                value={newChef.experience}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.experience}
                helperText={errors.experience}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work color="action" />
                    </InputAdornment>
                  ),
                  inputProps: { 
                    min: 0, 
                    max: 50,
                    step: 0.5
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rating"
                fullWidth
                type="number"
                name="rating"
                value={newChef.rating}
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
                    min: 1, 
                    max: 5,
                    step: 0.1
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
                fullWidth
                name="description"
                value={newChef.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.description}
                helperText={`${newChef.description.length}/500 ${errors.description || ''}`}
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
                placeholder="Describe the chef's expertise, achievements, and cooking style..."
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  sx={{ display: 'none' }}
                  id="chef-image-upload"
                  required
                />
                <label htmlFor="chef-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{ mb: 2 }}
                  >
                    Upload Chef Photo
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
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  mb: 2
                }}
              >
                <Tapas sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Add New Chef
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Complete the form below to add a new chef to your restaurant team
              </Typography>
            </Box>

            {/* Success Alert */}
            {success && (
              <Alert 
                severity="success" 
                icon={<CheckCircle />}
                sx={{ mb: 3 }}
              >
                Chef added successfully! Redirecting...
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
                      {loading ? 'Adding Chef...' : 'Add Chef'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
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

        {/* Quick Stats */}
        <Paper
          sx={{
            p: 3,
            mt: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            💡 Chef Profile Tips
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Use high-quality professional photos<br/>
            • Highlight unique specialities and achievements<br/>
            • Keep descriptions engaging and professional<br/>
            • Ensure ratings reflect actual expertise
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddChefs;