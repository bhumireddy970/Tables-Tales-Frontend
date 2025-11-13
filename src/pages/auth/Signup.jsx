import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Checkbox,
  Snackbar,
  Alert,
  Paper,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Restaurant,
  Email,
  Phone,
  LocationOn,
  Person,
  Lock,
  Cake,
  Pin
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import SignupImage from '../../assets/signup.webp';

// 🔑 EmailJS Configuration - REPLACE WITH YOUR ACTUAL CREDENTIALS
const EMAILJS_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_PUBLIC_KEY ,      // From EmailJS Account → API Keys
  SERVICE_ID: import.meta.env.VITE_SERVICE_ID,      // From EmailJS → Email Services
  TEMPLATE_ID: import.meta.env.VITE_TEMPLATE_ID     // From EmailJS → Email Templates
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// ---------- STYLES ----------
const textFieldStyle = {
  mb: 2,
  input: { color: 'white' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
    '&:hover fieldset': { borderColor: 'goldenrod' },
    '&.Mui-focused fieldset': { borderColor: 'goldenrod' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  '& .MuiFormHelperText-root': {
    color: '#ff6b6b',
    fontWeight: 'bold'
  }
};

const outlinedInputStyle = {
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'goldenrod' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'goldenrod' },
};

const otpInputStyle = {
  width: 45,
  height: 45,
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  '& input': { textAlign: 'center' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#ccc' },
    '&:hover fieldset': { borderColor: 'goldenrod' },
    '&.Mui-focused fieldset': { borderColor: 'goldenrod' },
  },
};

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    mobileNumber: '',
    address: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});

  // ---------- VALIDATION FUNCTIONS ----------
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validatePassword = (password) => password.length >= 8;

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (formValues.firstName.length < 2) newErrors.firstName = 'First name must be at least 2 characters';

    if (!formValues.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (formValues.lastName.length < 2) newErrors.lastName = 'Last name must be at least 2 characters';

    if (!formValues.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formValues.email)) newErrors.email = 'Enter a valid email address';

    if (!formValues.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formValues.password)) newErrors.password = 'Password must be at least 8 characters';

    if (!formValues.age) newErrors.age = 'Age is required';
    else if (formValues.age < 18) newErrors.age = 'You must be at least 18 years old';
    else if (formValues.age > 120) newErrors.age = 'Please enter a valid age';

    if (!formValues.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
    else if (!/^[0-9]{10}$/.test(formValues.mobileNumber)) newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';

    if (!formValues.address.trim()) newErrors.address = 'Address is required';
    else if (formValues.address.length < 10) newErrors.address = 'Please enter a complete address';

    if (!formValues.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(formValues.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode';

    if (!acceptTerms) newErrors.terms = 'You must accept terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- OTP FUNCTIONS ----------
  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOTP = async (userEmail) => {
    try {
      setOtpLoading(true);
      
      // Generate 6-digit OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in localStorage (for demo - in production use backend)
      localStorage.setItem('temp_otp', generatedOTP);
      localStorage.setItem('otp_email', userEmail);
      localStorage.setItem('otp_expires', Date.now() + 10 * 60 * 1000); // 10 minutes

      // Prepare email template parameters
      const templateParams = {
        to_email: userEmail, // ✅ THIS SENDS TO THE USER'S ENTERED EMAIL
        user_email: userEmail, // Alternative parameter name
        otp: generatedOTP,
        user_name: `${formValues.firstName} ${formValues.lastName}`,
        from_name: 'Table Tales',
        company_name: 'Table Tales Restaurant',
        expiration_time: '10 minutes'
      };

      console.log('Sending OTP to:', userEmail); // Debug log

      // Send OTP email using EmailJS
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (result.status === 200) {
        setSnackbarMsg(`OTP sent successfully to ${userEmail}`);
        setSnackbarSeverity('success');
        startResendTimer();
      } else {
        setSnackbarMsg('Failed to send OTP. Please try again.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      setSnackbarMsg(`Failed to send OTP to ${formValues.email}. Please check your EmailJS configuration.`);
      setSnackbarSeverity('error');
    } finally {
      setOtpLoading(false);
      setOpenSnackbar(true);
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setSnackbarMsg('Please enter 6-digit OTP');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      setOtpLoading(true);
      
      // Verify OTP from localStorage
      const storedOTP = localStorage.getItem('temp_otp');
      const storedEmail = localStorage.getItem('otp_email');
      const expiresAt = localStorage.getItem('otp_expires');

      if (!storedOTP || storedEmail !== formValues.email) {
        setSnackbarMsg('OTP not found. Please request a new one.');
        setSnackbarSeverity('error');
        return;
      }

      if (Date.now() > parseInt(expiresAt)) {
        setSnackbarMsg('OTP has expired. Please request a new one.');
        setSnackbarSeverity('error');
        return;
      }

      if (otpString !== storedOTP) {
        setSnackbarMsg('Invalid OTP. Please try again.');
        setSnackbarSeverity('error');
        return;
      }

      // OTP verified successfully - Complete registration
      await completeSignup();
      
      // Clear OTP data
      localStorage.removeItem('temp_otp');
      localStorage.removeItem('otp_email');
      localStorage.removeItem('otp_expires');
      
    } catch (error) {
      setSnackbarMsg('Verification failed. Please try again.');
      setSnackbarSeverity('error');
    } finally {
      setOtpLoading(false);
      setOpenSnackbar(true);
    }
  };

  const completeSignup = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_API_URL}/customer/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbarMsg('Account created successfully! Redirecting to login...');
        setSnackbarSeverity('success');
        setOtpDialogOpen(false);
        
        // Reset form
        setFormValues({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          age: '',
          mobileNumber: '',
          address: '',
          pincode: ''
        });
        
        // Redirect to login after delay
        setTimeout(() => navigate('/signin'), 2000);
      } else {
        setSnackbarMsg(result.message || 'Error creating account. Please try again.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMsg('Network error. Please check your connection and try again.');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  // ---------- EVENT HANDLERS ----------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSnackbarMsg('Please fix the errors in the form.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Open OTP dialog and send OTP to the user's entered email
    setOtpDialogOpen(true);
    await sendOTP(formValues.email); // ✅ This sends to the email user entered
  };

  const handleResendOTP = async () => {
    if (resendTimer === 0) {
      await sendOTP(formValues.email); // ✅ This sends to the email user entered
    }
  };

  const handleCloseOtpDialog = () => {
    if (!otpLoading) {
      setOtpDialogOpen(false);
      setOtp(['', '', '', '', '', '']);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${SignupImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          py: 4,
          px: 2
        }}
      >
        <Container maxWidth="md">
          <Fade in={true} timeout={800}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              {/* Header Section */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,215,0,0.2)',
                    border: '2px solid goldenrod',
                    color: 'goldenrod',
                    mb: 2
                  }}
                >
                  <Restaurant sx={{ fontSize: 40 }} />
                </Box>
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Join Table Tales
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                  Create Your Account
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Already have an account?{' '}
                  <Link 
                    to="/signin" 
                    style={{ 
                      color: 'goldenrod', 
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      borderBottom: '1px solid goldenrod'
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Name Row */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'rgba(255,255,255,0.7)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    sx={textFieldStyle}
                  />
                </Box>

                {/* Email */}
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password */}
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Password</InputLabel>
                  <OutlinedInput
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    sx={outlinedInputStyle}
                    startAdornment={
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {errors.password && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.password}
                    </Typography>
                  )}
                </FormControl>

                {/* Age and Mobile Row */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={formValues.age}
                    onChange={handleChange}
                    error={!!errors.age}
                    helperText={errors.age}
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Cake sx={{ color: 'rgba(255,255,255,0.7)' }} />
                        </InputAdornment>
                      ),
                      inputProps: { min: 18, max: 120 }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    type="tel"
                    value={formValues.mobileNumber}
                    onChange={handleChange}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber}
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: 'rgba(255,255,255,0.7)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Address */}
                <TextField
                  fullWidth
                  label="Full Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formValues.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Pincode */}
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  type="number"
                  value={formValues.pincode}
                  onChange={handleChange}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Pin sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Terms and Conditions */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (errors.terms) {
                        setErrors((prev) => ({ ...prev, terms: '' }));
                      }
                    }}
                    color="warning"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-checked': { color: 'goldenrod' },
                      mt: -0.5
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                    I agree to the{' '}
                    <Link 
                      to="/terms" 
                      style={{ 
                        color: 'goldenrod', 
                        textDecoration: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link 
                      to="/privacy" 
                      style={{ 
                        color: 'goldenrod', 
                        textDecoration: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                </Box>
                {errors.terms && (
                  <Typography variant="caption" color="error" sx={{ mb: 2, display: 'block' }}>
                    {errors.terms}
                  </Typography>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    border: 'none',
                    borderRadius: 3,
                    boxShadow: '0 8px 20px rgba(255,215,0,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 25px rgba(255,215,0,0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.3)',
                      color: 'rgba(255,255,255,0.5)'
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>

      {/* OTP Verification Dialog */}
      <Dialog 
        open={otpDialogOpen} 
        onClose={handleCloseOtpDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          bgcolor: 'primary.main', 
          color: 'white',
          borderRadius: '3px 3px 0 0',
          py: 3
        }}>
          <Typography variant="h5" fontWeight="bold">
            Verify Your Email
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              color: 'primary.main',
              mb: 2
            }}
          >
            <Email sx={{ fontSize: 30 }} />
          </Box>
          
          <Typography variant="body1" gutterBottom color="text.secondary">
            We've sent a 6-digit verification code to:
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            {formValues.email}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter the code below to verify your email address
          </Typography>
          
          {/* OTP Input Fields */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, my: 4 }}>
            {otp.map((digit, index) => (
              <TextField
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
                inputProps={{ 
                  maxLength: 1,
                  style: { textAlign: 'center' }
                }}
                sx={otpInputStyle}
                disabled={otpLoading}
                autoFocus={index === 0}
              />
            ))}
          </Box>

          {/* Resend OTP */}
          <Box sx={{ mt: 2 }}>
            <Button
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || otpLoading}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2 }}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 4, px: 4, gap: 2 }}>
          <Button 
            onClick={handleCloseOtpDialog}
            disabled={otpLoading}
            color="secondary"
            variant="outlined"
            sx={{ borderRadius: 2, px: 4 }}
          >
            Cancel
          </Button>
          <Button
            onClick={verifyOTP}
            variant="contained"
            disabled={otpLoading || otp.join('').length !== 6}
            startIcon={otpLoading && <CircularProgress size={20} color="inherit" />}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {otpLoading ? 'Verifying...' : 'Verify & Create Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbarSeverity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontSize: '1rem',
            alignItems: 'center'
          }}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;

