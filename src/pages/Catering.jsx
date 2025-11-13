
import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box, IconButton } from '@mui/material';
import Layout from '../components/Layout/Layout';
import HeroImage from '../assets/hero.jpeg';
import BirthDay from '../assets/cat3.avif';
import corporateImg from '../assets/cat2.avif';
import weddingImg from '../assets/wedcat.webp';
import { Link,useNavigate } from 'react-router-dom';
import { KeyboardArrowDown } from '@mui/icons-material';
import SetImg from '../assets/set.jpeg';
import { useUser } from '../contextAPI/context';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const CateringPage = () => {
  const navigate = useNavigate()
  const [backgroundImage, setBackgroundImage] = useState('');
  const {email} = useUser()
  useEffect(()=>{
    if(email===null){
      navigate('*')
    }
  },[])
  // UseEffect to set the background image when component mounts
  useEffect(() => {
    setBackgroundImage(`url(${SetImg})`);
  }, []);

  return (
    
      <Box sx={{ backgroundImage: backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center',backdropFilter: 'blur(20px)' }}>
        <Container sx={{  px:2,py: 2, borderRadius: '10px',backdropFilter: 'blur(20px)' }}>
          {/* Hero Image Section */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 400,
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <img
              src={HeroImage}
              alt="Restaurant Catering"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.6)', // Adjusted brightness for better text readability
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white',
              }}
            >
              <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', sm: '3rem' } }}>
                Exceptional Catering Services for Every Occasion
              </Typography>
              <Typography variant="h6" sx={{ marginTop: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Discover the perfect menu for your event, with personalized service that meets your every need.
              </Typography>
              <a href="#catering-options">
                <IconButton
                  sx={{
                    backgroundColor: '#3f51b5',
                    color: 'white',
                    marginTop: 3,
                    '&:hover': { backgroundColor: '#303f9f' },
                  }}
                >
                  <KeyboardArrowDown />
                </IconButton>
              </a>
            </Box>
          </Box>

          {/* About Catering Service Section */}
          <Box sx={{ padding: 4 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 4, fontSize: { xs: '1.5rem', sm: '2rem' },fontWeight:'bold' }}>
              Our Catering Services
            </Typography>
            <Typography variant="h5" paragraph sx={{ textAlign: 'center', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            We specialize in offering personalized catering services for all occasions, ensuring that every event is marked by exceptional food and impeccable service. Whether you're hosting a wedding, corporate event, or a private party, our team is dedicated to providing a dining experience that your guests will remember.

We take pride in our ability to cater to your unique preferences, offering flexible menu options and customized services tailored to your specific event needs. From intimate gatherings to large-scale celebrations, we manage all the details to ensure a seamless and delightful experience.
            </Typography>
            <Link to={'/about'}>
              <Button variant="contained" color="success" sx={{ color: '#fff', '&:hover': { backgroundColor: '#303f9f' }, padding: '10px 20px' }}>
                Learn More About Our Services
              </Button>
            </Link>
          </Box>

          {/* Catering Options Section */}
          <Box sx={{ padding: 4 }} id="catering-options">
            <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 4, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Catering Options
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {/* Wedding Catering */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 345, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' }, boxShadow: 3 }}>
                  <CardMedia sx={{ height: 200 }} image={weddingImg} title="Wedding Catering" />
                  <CardContent sx={{backgroundColor:'rgb(204, 195, 255)',color:'white'}}>
                    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Wedding Catering
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Make your wedding unforgettable with our elegant catering options tailored to your taste and style.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Corporate Events Catering */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 345, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' }, boxShadow: 3 }}>
                  <CardMedia sx={{ height: 200 }} image={corporateImg} title="Corporate Events" />
                  <CardContent sx={{backgroundColor:'rgb(204, 195, 255)',color:'white'}}>
                    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Corporate Events
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      We offer both formal and casual dining options, perfectly suited for business meetings and conferences.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Private Parties Catering */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 345, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' }, boxShadow: 3 }}>
                  <CardMedia sx={{ height: 200 }} image={BirthDay} title="Private Parties" />
                  <CardContent sx={{backgroundColor:'rgb(204, 195, 255)',color:'white'}}>
                    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Private Parties
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Celebrate birthdays, anniversaries, or any occasion with exquisite food and exceptional service.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Why Choose Us Section */}
          <Box sx={{ padding: 4 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 4, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Why Choose Our Catering?
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>Quality Ingredients</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  We source the freshest ingredients to ensure every dish is flavorful and memorable.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>Personalized Menus</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  We work with you to create a menu tailored to your event’s theme and preferences.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>Exceptional Service</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Our team is dedicated to providing outstanding service to ensure your event is a success.
                </Typography>
              </Grid>
            </Grid>
            {/* <Link to={'/menu'}>
              <Button variant="contained" color="success" sx={{ color: '#fff', '&:hover': { backgroundColor: '#303f9f' }, padding: '10px 20px' }}>
                Discover Our Full Menu
              </Button>
            </Link> */}
          </Box>

          {/* Order & Delivery Information Section */}
          <Box sx={{ padding: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>Ready to Order? We Ensure Timely Delivery!</Typography>
            <Typography variant="body1" sx={{ marginBottom: 3 }}>
              Place your order for food items and catering services with us! We guarantee fresh and delicious food, delivered on time to your event.
              Our team works hard to make sure everything is perfect for your special occasion.
            </Typography>
            <Link to={'/booking'}>
              <Button variant="contained" color="success" sx={{ color: '#fff', '&:hover': { backgroundColor: '#303f9f' }, padding: '15px 30px' }}>
                Book Catering Now
              </Button>
            </Link>
          </Box>

          {/* Testimonials Section */}
          <Box sx={{  padding: 4, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>What Our Clients Are Saying</Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic', marginBottom: 2 }}>
              "The catering service was absolutely incredible! The food was delicious and beautifully presented. Our guests are
              still talking about it!"
            </Typography>
            <Typography variant="h6" color="textSecondary">
              - Sarah M., Wedding Client
            </Typography>
          </Box>

          {/* Call to Action Section */}
          <Box sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" paragraph sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Ready to Host Your Event? Let's Make It Memorable!
            </Typography>
            <Link to={'/contact'}>
              <Button variant="contained" size="large" color="success" sx={{ color: '#fff', '&:hover': { backgroundColor: '#303f9f' }, padding: '15px 30px' }}>
                Get in Touch with Us
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    
  );
};

export default CateringPage;
