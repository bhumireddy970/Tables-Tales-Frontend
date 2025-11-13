import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  CardMedia,
  CssBaseline,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  CardActions,
  alpha,
  useTheme,
  Fade,
  Zoom
} from '@mui/material';
import {
  RamenDining,
  People,
  LocalShipping,
  Event,
  Analytics,
  Add,
  Restaurant,
  TrendingUp
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import AdminImg from '../../assets/admin.avif';
import ItemImg from '../../assets/item.webp';
import AnalyticsImg from '../../assets/adminanalytics.webp';
import AdminChefImg from '../../assets/adminchef.avif';
import deliveryImg from '../../assets/delivery.avif';
import { useUser } from '../../contextAPI/context';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

function AdminPage() {
  const [chefs, setChefs] = useState([]);
  const [items, setItems] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);

  const { role } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();


  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [chefsRes, itemsRes, deliveryRes, eventsRes] = await Promise.all([
          fetch(`${BACKEND_API_URL}/chef/showchefs`),
          fetch(`${BACKEND_API_URL}/item/menu-items`),
          fetch(`${BACKEND_API_URL}/deliveryboy/show`),
          fetch(`${BACKEND_API_URL}/catering/getEvents`)
        ]);

        if (!chefsRes.ok) throw new Error('Failed to fetch chefs data');
        if (!itemsRes.ok) throw new Error('Failed to fetch items data');
        if (!deliveryRes.ok) throw new Error('Failed to fetch delivery boys');

        const chefsData = await chefsRes.json();
        const itemsData = await itemsRes.json();
        const deliveryData = await deliveryRes.json();

        setChefs(chefsData.chef);
        setItems(itemsData);
        setDeliveryBoys(deliveryData.deliverboys);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEventsData(eventsData.events);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsCards = [
    {
      title: 'Active Chefs',
      count: chefs.length,
      desc: 'Professional chefs managing our kitchen',
      link: '/chefs',
      btn: 'View Chefs',
      icon: <People sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Menu Items',
      count: items.length,
      desc: 'Delicious dishes in our restaurant menu',
      link: '/menu',
      btn: 'View Menu',
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Delivery Team',
      count: deliveryBoys.length,
      desc: 'Dedicated delivery professionals',
      link: '/deliveryboys',
      btn: 'View Team',
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Catering Events',
      count: eventsData.length,
      desc: 'Upcoming catering services',
      link: '/events',
      btn: 'View Events',
      icon: <Event sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const actionCards = [
    {
      title: 'Add Menu Item',
      desc: 'Add a new food item to the restaurant menu',
      link: '/additem',
      btn: 'Add Food Item',
      icon: <RamenDining sx={{ fontSize: 48 }} />,
      image: ItemImg,
      color: theme.palette.warning.main,
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
      title: 'Add Chef',
      desc: 'Add a new chef to manage the kitchen',
      link: '/addchef',
      btn: 'Add New Chef',
      icon: <People sx={{ fontSize: 48 }} />,
      image: AdminChefImg,
      color: theme.palette.secondary.main,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      title: 'Add Delivery',
      desc: 'Assign a delivery boy for orders',
      link: '/adddeliveryboy',
      btn: 'Add Delivery Boy',
      icon: <LocalShipping sx={{ fontSize: 48 }} />,
      image: deliveryImg,
      color: theme.palette.success.main,
      gradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)'
    },
    {
      title: 'Analytics',
      desc: 'View restaurant performance data',
      link: '/analytics',
      btn: 'View Analytics',
      icon: <Analytics sx={{ fontSize: 48 }} />,
      image: AnalyticsImg,
      color: theme.palette.error.main,
      gradient: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)'
    }
  ];

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Box textAlign="center">
          <CircularProgress 
            size={80} 
            sx={{ 
              color: 'white',
              mb: 2
            }} 
          />
          <Typography variant="h6" color="white" fontWeight="bold">
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Snackbar open autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.9)}), url(${AdminImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        py: 4
      }}
    >
      <CssBaseline />
      
      <Container maxWidth="xl">
        {/* Header Section */}
        <Fade in={animate} timeout={800}>
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FFFFFF, #E0E0E0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '2rem', md: '3.5rem' },
                mb: 2
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#FFFFFF', 0.9),
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Complete overview of your restaurant's performance and management tools
            </Typography>
          </Box>
        </Fade>

        {/* Stats Overview */}
        <Zoom in={animate} timeout={1000}>
          <Grid container spacing={3} mb={6}>
            {statsCards.map((card, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  sx={{
                    background: card.color,
                    color: 'white',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        mb: 1
                      }}
                    >
                      {card.count}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        mb: 2
                      }}
                    >
                      {card.desc}
                    </Typography>
                    <Link to={card.link} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        sx={{
                          color: 'white',
                          borderColor: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderColor: 'white'
                          }
                        }}
                      >
                        {card.btn}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Zoom>

        {/* Quick Actions */}
        <Fade in={animate} timeout={1200}>
          <Box mb={4}>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 3,
                textAlign: 'center',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              Quick Actions
            </Typography>
            
            <Grid container spacing={3}>
              {actionCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      background: card.gradient,
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease-in-out',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        height: 120,
                        overflow: 'hidden'
                      }}
                    >
                      <CardMedia
                        component="img"
                        src={card.image}
                        alt={card.title}
                        sx={{
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'brightness(0.7)'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white'
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          mb: 1,
                          color: theme.palette.text.primary
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          mb: 3
                        }}
                      >
                        {card.desc}
                      </Typography>
                      
                      <Link to={card.link} style={{ textDecoration: 'none' }}>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          sx={{
                            background: card.color,
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            '&:hover': {
                              background: card.color,
                              boxShadow: `0 4px 20px ${alpha(card.color, 0.4)}`
                            }
                          }}
                        >
                          {card.btn}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Performance Summary */}
        <Zoom in={animate} timeout={1400}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
              p: 4,
              mt: 4
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <TrendingUp sx={{ color: 'white', mr: 2, fontSize: 32 }} />
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Performance Summary
              </Typography>
            </Box>
            
            <Grid container spacing={3} textAlign="center">
              <Grid item xs={6} md={3}>
                <Typography variant="h4" sx={{ color: '#4facfe', fontWeight: 'bold' }}>
                  {chefs.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Active Chefs
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h4" sx={{ color: '#f5576c', fontWeight: 'bold' }}>
                  {items.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Menu Items
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 'bold' }}>
                  {deliveryBoys.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Delivery Team
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h4" sx={{ color: '#a8edea', fontWeight: 'bold' }}>
                  {eventsData.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Active Events
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Zoom>
      </Container>
    </Box>
  );
}

export default AdminPage;