import React from 'react';
import { Box, Typography, Button, Container, Fade } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        px: 2,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #81c784 0%, #43a047 100%)', // Table Tales green theme
      }}
    >
      <Fade in timeout={800}>
        <ErrorOutlineIcon
          sx={{
            fontSize: { xs: '4rem', sm: '5rem' },
            color: '#fff',
            mb: 2,
            animation: 'bounce 2s infinite',
          }}
        />
      </Fade>

      <Typography
        variant="h4"
        sx={{
          color: '#fff',
          fontWeight: 'bold',
          mb: 1,
          fontSize: { xs: '1.6rem', sm: '2rem' },
        }}
      >
        Oops! Page Not Found
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: '#f1f1f1',
          mb: 4,
          maxWidth: 500,
          lineHeight: 1.5,
          fontSize: { xs: '0.9rem', sm: '1rem' },
        }}
      >
        The page you are looking for does not exist. Don't worry, you can navigate back or log in to continue enjoying Table Tales.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate('/signin')}
          sx={{
            width: { xs: '100%', sm: '180px' },
            fontWeight: 'bold',
            textTransform: 'none',
          }}
        >
          Log In
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{
            width: { xs: '100%', sm: '180px' },
            fontWeight: 'bold',
            color: '#fff',
            borderColor: '#fff',
            textTransform: 'none',
            '&:hover': { borderColor: '#e0e0e0' },
          }}
        >
          Go Home
        </Button>
      </Box>

      {/* BOUNCE ANIMATION */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-15px); }
            60% { transform: translateY(-7px); }
          }
        `}
      </style>
    </Container>
  );
};

export default PageNotFound;
