import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  useMediaQuery,
  Container,
  Chip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  alpha,
  IconButton,
  InputBase,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  Zoom
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Star,
  LocalShipping,
  Search,
  FilterList,
  CheckCircle,
  Schedule,
  OfflineBolt,
  Person,
  Phone,
  AssignmentTurnedIn
} from '@mui/icons-material';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const DeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [filteredBoys, setFilteredBoys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_API_URL}/deliveryboy/show`);
        if (!response.ok) {
          throw new Error('Failed to fetch delivery boy details');
        }
        const data = await response.json();
        setDeliveryBoys(data.deliverboys);
        setFilteredBoys(data.deliverboys);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryBoys();
  }, []);

  useEffect(() => {
    let filtered = deliveryBoys;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(db =>
        db.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        db.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        db.phone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(db => db.status === statusFilter);
    }

    setFilteredBoys(filtered);
  }, [searchTerm, statusFilter, deliveryBoys]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return theme.palette.success.main;
      case 'busy':
        return theme.palette.warning.main;
      case 'offline':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'busy':
        return <Schedule sx={{ fontSize: 16 }} />;
      case 'offline':
        return <OfflineBolt sx={{ fontSize: 16 }} />;
      default:
        return <Person sx={{ fontSize: 16 }} />;
    }
  };

  const calculatePerformance = (completedOrders) => {
    const ordersCount = completedOrders.length;
    if (ordersCount === 0) return 0;
    if (ordersCount < 10) return 30;
    if (ordersCount < 25) return 60;
    if (ordersCount < 50) return 80;
    return 100;
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 80) return theme.palette.success.main;
    if (performance >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.info.light, 0.1)} 100%)`
        }}
      >
        <Box textAlign="center">
          <LocalShipping 
            sx={{ 
              fontSize: 60, 
              color: theme.palette.primary.main,
              mb: 2 
            }} 
          />
          <Typography variant="h6" color="textSecondary">
            Loading delivery team...
          </Typography>
          <LinearProgress sx={{ mt: 2, width: 200, mx: 'auto' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
        pb: 6
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
          color: 'white',
          py: isMobile ? 6 : 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <LocalShipping 
                sx={{ 
                  fontSize: isMobile ? 50 : 70, 
                  mb: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }} 
              />
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Delivery Team
              </Typography>
              <Typography
                variant={isMobile ? 'body1' : 'h6'}
                sx={{ 
                  opacity: 0.9,
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 3
                }}
              >
                Meet our dedicated delivery partners committed to bringing your favorite meals with speed and care
              </Typography>
              
              {/* Stats Overview */}
              <Grid container spacing={3} sx={{ mt: 3, justifyContent: 'center' }}>
                <Grid item>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {deliveryBoys.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Partners
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {deliveryBoys.filter(db => db.status === 'available').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Available Now
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {deliveryBoys.reduce((acc, db) => acc + db.completedOrders.length, 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Deliveries
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Filters Section */}
      <Container maxWidth="lg" sx={{ mt: -3, position: 'relative', zIndex: 2 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'white',
            mb: 4
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  background: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <IconButton sx={{ p: '10px' }}>
                  <Search color="primary" />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search delivery partners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <FilterList color="primary" />
                <ToggleButtonGroup
                  value={statusFilter}
                  exclusive
                  onChange={(e, newFilter) => setStatusFilter(newFilter)}
                  aria-label="delivery boy status"
                  size="small"
                >
                  <ToggleButton value="all" sx={{ textTransform: 'none' }}>
                    All
                  </ToggleButton>
                  <ToggleButton value="available" sx={{ textTransform: 'none' }}>
                    Available
                  </ToggleButton>
                  <ToggleButton value="busy" sx={{ textTransform: 'none' }}>
                    Busy
                  </ToggleButton>
                  <ToggleButton value="offline" sx={{ textTransform: 'none' }}>
                    Offline
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Showing {filteredBoys.length} of {deliveryBoys.length} delivery partners
        </Typography>

        {/* Delivery Boys Grid */}
        <Grid container spacing={3}>
          {filteredBoys.map((db, index) => (
            <Grid item xs={12} sm={6} lg={4} key={db._id}>
              <Zoom in timeout={800 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease-in-out',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={db.imageURL}
                      alt={`${db.firstName} ${db.lastName}`}
                      sx={{
                        objectFit: 'cover',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16
                      }}
                    >
                      <Chip
                        icon={getStatusIcon(db.status)}
                        label={db.status.charAt(0).toUpperCase() + db.status.slice(1)}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getStatusColor(db.status), 0.9),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* Name and Rating */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {db.firstName} {db.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.warning.main }}>
                          <Star sx={{ fontSize: 20 }} />
                          <Typography variant="h6" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                            {db.rating}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                            ({db.completedOrders.length} deliveries)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Contact Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                      <Phone sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                      <Typography variant="body2" color="textSecondary">
                        {db.phone}
                      </Typography>
                    </Box>

                    {/* Performance Bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          Performance
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {calculatePerformance(db.completedOrders)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculatePerformance(db.completedOrders)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: alpha(theme.palette.grey[300], 0.5),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getPerformanceColor(calculatePerformance(db.completedOrders)),
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>

                    {/* Recent Activity */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip
                        icon={<AssignmentTurnedIn />}
                        label={`${db.completedOrders.length} orders`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                        <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                          <CheckCircle />
                        </Avatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <LocalShipping />
                        </Avatar>
                      </AvatarGroup>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredBoys.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LocalShipping sx={{ fontSize: 80, color: theme.palette.grey[300], mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No delivery partners found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DeliveryBoys;