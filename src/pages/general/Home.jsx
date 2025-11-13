import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  Container,
  Divider,
  Stack,
  Paper,
  Slide
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Banner from '../../assets/banner.jpeg';
import '../../styles/home.css';
import { useUser } from '../../contextAPI/context';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { email} = useUser();
  console.log(email);
  const navigate = useNavigate();
  const handleClick = () => setOpen(true);
  const handleMenuClick = () => navigate('/menu');
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* HERO SECTION */}
      <Box
        className="home"
        sx={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${Banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: { xs: 8, sm: 10 },
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: '90vh', sm: '100vh' },
          px: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? 'h4' : 'h2'}
            sx={{
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2,
              fontSize: { xs: '1.8rem', sm: '2.8rem' },
            }}
          >
            Welcome to <span style={{ color: '#81c784' }}>Table Tales</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              lineHeight: 1.6,
              px: { xs: 1, sm: 0 },
            }}
          >
            Savor the Flavors, Anytime, Anywhere! Discover your next favorite dish from a variety of cuisines, crafted
            with love and fresh ingredients.
          </Typography>
          {
            email ? (
              <Button
            variant="contained"
            color="success"
            size={isMobile ? 'medium' : 'large'}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 4, sm: 6 },
              py: { xs: 1, sm: 1.2 },
            }}
            onClick={handleMenuClick}
          >
            Order Now
          </Button>
            ) : (<Button
            variant="contained"
            color="success"
            size={isMobile ? 'medium' : 'large'}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 4, sm: 6 },
              py: { xs: 1, sm: 1.2 },
            }}
            onClick={handleClick}
          >
            Register
          </Button>)
          }
        </Container>
      </Box>

      {/* ABOUT SECTION */}
      <Container sx={{ py: { xs: 6, sm: 8 }, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 3,
            fontSize: { xs: '1.7rem', sm: '2rem' },
          }}
        >
          About <span style={{ color: '#43a047' }}>Table Tales</span>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            maxWidth: 700,
            mx: 'auto',
            lineHeight: 1.8,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            px: { xs: 2, sm: 0 },
          }}
        >
          At Table Tales, we believe every meal tells a story — of culture, creativity, and community. 
          Whether you’re craving comfort food or exploring new cuisines, we bring a symphony of flavors 
          straight to your plate.
        </Typography>
      </Container>

      {/* FEATURES SECTION */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 0 } }}>
        <Container>
          <Stack
            direction={isMobile ? 'column' : 'row'}
            justifyContent="center"
            alignItems="stretch"
            spacing={isMobile ? 3 : 4}
          >
            {[
              { title: 'Fresh Ingredients', desc: 'We use only the finest, locally-sourced produce.' },
              { title: 'Quick Delivery', desc: 'Hot, fresh, and on your table in no time!' },
              { title: 'Loved by Foodies', desc: 'Rated 4.9/5 by our happy customers.' },
            ].map((item, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  textAlign: 'center',
                  flex: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                  width: '100%',
                }}
              >
                <Typography variant="h6" sx={{ color: '#43a047', mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {item.desc}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* FAQ SECTION */}
      <Container sx={{ py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 0 } }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 600,
            color: '#43a047',
            fontSize: { xs: '1.7rem', sm: '2rem' },
          }}
        >
          Frequently Asked Questions
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {[
            {
              question: 'What kind of food is available?',
              answer:
                'Table Tales offers a wide range of delicious options — from vegetarian delights to sizzling non-veg dishes, and everything in between.'
            },
            {
              question: 'What food is famous here?',
              answer:
                'Our signature dishes include gourmet burgers, spicy tandoori platters, and handcrafted desserts that foodies love!'
            },
            {
              question: 'Do you offer home delivery?',
              answer: 'Absolutely! We deliver fresh meals straight to your doorstep, hot and ready to enjoy.'
            }
          ].map((item, index) => (
            <Slide in direction="up" key={index}>
              <Accordion sx={{ width: '100%', maxWidth: 700, bgcolor: '#fafafa' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon color="success" />}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 500, fontSize: { xs: '0.95rem', sm: '1rem' } }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Slide>
          ))}
        </Box>
      </Container>

      <Divider sx={{ my: { xs: 3, sm: 4 } }} />


      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#2e7d32',
            color: '#fff',
            p: 2,
            width: isMobile ? '90%' : '400px',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>
            Require Confirmation
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#fff' }}>
            Do you have an account?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#66bb6a',
              textTransform: 'none',
              px: 3,
              '&:hover': { backgroundColor: '#57a15e' },
            }}
            component={Link}
            to="/signin"
            onClick={() => setOpen(false)}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#81c784',
              textTransform: 'none',
              px: 3,
              ml: 1,
              '&:hover': { backgroundColor: '#6dbf70' },
            }}
            component={Link}
            to="/signup"
            onClick={() => setOpen(false)}
          >
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
