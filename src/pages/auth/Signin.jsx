import React, { useState } from 'react';
import TapasIcon from '@mui/icons-material/Tapas';
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
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Paper,
  Fade
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contextAPI/context';
import backImg from '../../assets/signup.webp';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const Signin = () => {
  const { login, log } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) return showError('Please enter a valid email');
    if (!validatePassword(password)) return showError('Password must be at least 8 characters');
    if (!userRole) return showError('Please select a user role');

    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_API_URL}/customer/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, userRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return showError(errorData.message || 'Error during sign-in');
      }

      const data = await response.json();
      login(email);
      log(data.role);
      navigate('/menu');
      setEmail('');
      setPassword('');
      setUserRole('');
    } catch {
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg) => {
    setError(msg);
    setOpenSnackbar(true);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${backImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 3,
              width: 400,
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <TapasIcon sx={{ fontSize: 40, color: 'goldenrod' }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" mb={1}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
              Sign in to continue to your account
            </Typography>

            {/* Email */}
            <TextField
              id="outlined-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              inputProps={{ 'data-cy': 'email-input' }}
              sx={{
                mb: 2,
                input: { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&:hover fieldset': { borderColor: 'goldenrod' },
                  '&.Mui-focused fieldset': { borderColor: 'goldenrod' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              }}
            />

            {/* Password */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Password</InputLabel>
              <OutlinedInput
                data-cy="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'goldenrod' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'goldenrod' },
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: 'white' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            {/* Role Dropdown */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Select Role</InputLabel>
              <Select
                data-cy="role-select"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                label="Select Role"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'goldenrod' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'goldenrod' },
                }}
              >
                <MenuItem data-cy="role-admin" value="ADMIN">ADMIN</MenuItem>
                <MenuItem data-cy="role-deliveryboy" value="DELIVERYBOY">DELIVERYBOY</MenuItem>
                <MenuItem data-cy="role-customer" value="CUSTOMER">CUSTOMER</MenuItem>
              </Select>
            </FormControl>

            <Typography sx={{ mt: 1, mb: 2, color: 'rgba(255,255,255,0.8)' }}>
              Don’t have an account?{' '}
              <Link to="/signup" style={{ color: 'goldenrod', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>

            <Button
              data-cy="signin-button"
              variant="contained"
              color="warning"
              onClick={handleSubmit}
              fullWidth
              disabled={loading}
              sx={{
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                backgroundColor: 'goldenrod',
                '&:hover': { backgroundColor: '#c18f00', transform: 'scale(1.03)' },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Paper>
        </Fade>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signin;

