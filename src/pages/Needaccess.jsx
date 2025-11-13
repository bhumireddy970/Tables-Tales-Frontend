// import React from 'react';
// import Layout from '../components/Layout/Layout';
// import { Box, Typography, Button, Container } from '@mui/material';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import { useNavigate } from 'react-router-dom';

// const Needaccess = () => {
//   const navigate = useNavigate()

//   const handleRedirectToLogin = () => {
//     navigate('/signin') // Redirect to login page
//   };

//   return (
//     
//       <Container
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           flexDirection: 'column',
//           minHeight: '100vh',
//         }}
//       >
//         <ErrorOutlineIcon sx={{ fontSize: '5rem', color: 'error.main', mb: 2 }} />
//         <Typography variant="h4" color="error" sx={{ mb: 2 }}>
//           Page Not Found
//         </Typography>
//         <Typography variant="h6" sx={{ mb: 4 }}>
//           The page you're looking for does not exist. You don't have access to the page.
//         </Typography>
//         <Button
//           variant="contained"
//           color="success"
//           onClick={handleRedirectToLogin}
//           sx={{ width: '200px', fontWeight: 'bold' }}
//         >
//           Log In
//         </Button>
//       </Container>
//     
//   );
// };

// export default Needaccess;

//mobile
import React from 'react';
import { Box, Typography, Button, Container, useMediaQuery } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Needaccess = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRedirectToLogin = () => {
    navigate('/signin'); // Redirect to login page
  };

  return (
    
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
          px: isSmallScreen ? 2 : 4,
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: isSmallScreen ? '3.5rem' : '5rem',
            color: 'error.main',
            mb: isSmallScreen ? 1.5 : 2,
          }}
        />
        <Typography
          variant={isSmallScreen ? 'h5' : 'h4'}
          color="error"
          sx={{ mb: isSmallScreen ? 1.5 : 2, fontWeight: 'bold' }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant={isSmallScreen ? 'body1' : 'h6'}
          sx={{ mb: isSmallScreen ? 3 : 4, px: isSmallScreen ? 1 : 6 }}
        >
          The page you're looking for does not exist. You don't have access to the page.
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleRedirectToLogin}
          sx={{
            width: isSmallScreen ? '100%' : 200,
            fontWeight: 'bold',
            fontSize: isSmallScreen ? '1rem' : '1.1rem',
            py: isSmallScreen ? 1.5 : 1.75,
          }}
        >
          Log In
        </Button>
      </Container>
    
  );
};

export default Needaccess;
