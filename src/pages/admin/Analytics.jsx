import React, { useState, useEffect } from 'react';
import {
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  alpha,
  useTheme,
  Chip,
  Avatar,
  LinearProgress,
  Container
} from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area 
} from 'recharts';
import {
  TrendingUp,
  Restaurant,
  LocalShipping,
  Star,
  People,
  AttachMoney,
  Schedule,
  CheckCircle,
  Cancel,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

import { useUser } from '../../contextAPI/context';
import { useNavigate } from 'react-router-dom';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const SalesAndItemsAnalysis = () => {
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [largestStatus, setLargestStatus] = useState('');
  const [largestValue, setLargestValue] = useState(0);
  const [ratingsData, setRatingsData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  
  const { role } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();


  // Fetch data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [ordersRes, menuRes, ratingsRes] = await Promise.all([
          fetch(`${BACKEND_API_URL}/orders/deliveryboy/showorders`),
          fetch(`${BACKEND_API_URL}/item/menu-items`),
          fetch(`${BACKEND_API_URL}/reviews/showreviews`)
        ]);

        if (!ordersRes.ok || !menuRes.ok || !ratingsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [ordersData, menuData, ratingsData] = await Promise.all([
          ordersRes.json(),
          menuRes.json(),
          ratingsRes.json()
        ]);

        // Process orders
        const updatedOrders = ordersData.order.map(order => ({
          ...order,
          status: order.status === 'completed' ? 'delivered' : order.status,
        }));
        setOrders(updatedOrders);

        // Process menu items
        setMenuItems(menuData);

        // Process ratings
        setRatingsData(ratingsData);

        // Filter today's orders
        const today = new Date().toLocaleDateString();
        const filteredTodayOrders = updatedOrders.filter(order => {
          const orderDate = new Date(order.createdAt).toLocaleDateString();
          return orderDate === today;
        });
        setTodayOrders(filteredTodayOrders);

        setLoading(false);
      } catch (err) {
        console.error("Error occurred while fetching data:", err);
        setError("Failed to load analytics data.");
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Analyze ratings
  useEffect(() => {
    const analyzeRatings = () => {
      if (!ratingsData || ratingsData.length === 0) return;

      const totalRatings = ratingsData.length;
      const totalScore = ratingsData.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalScore / totalRatings;

      const ratingDistribution = ratingsData.reduce((acc, review) => {
        const rating = review.rating;
        acc[rating] = acc[rating] ? acc[rating] + 1 : 1;
        return acc;
      }, {});

      const formattedRatingDistribution = Object.keys(ratingDistribution).map(rating => ({
        rating: `⭐ ${rating}`,
        count: ratingDistribution[rating],
        percentage: ((ratingDistribution[rating] / totalRatings) * 100).toFixed(1)
      }));

      setAverageRating(averageRating);
      setRatingDistribution(formattedRatingDistribution);
    };

    analyzeRatings();
  }, [ratingsData]);

  // Analyze sales
  useEffect(() => {
    const analyzeSales = () => {
      const salesByDate = orders.reduce((acc, order) => {
        if (!order.createdAt || !order.totalAmount) return acc;

        const date = new Date(order.createdAt).toLocaleDateString();
        const total = order.totalAmount;

        if (acc[date]) {
          acc[date].totalSales += total;
          acc[date].orderCount += 1;
        } else {
          acc[date] = { date, totalSales: total, orderCount: 1 };
        }

        return acc;
      }, {});

      const formattedSalesData = Object.values(salesByDate).slice(-30); // Last 30 days
      setSalesData(formattedSalesData);
    };

    if (orders.length > 0) {
      analyzeSales();
    }
  }, [orders]);

  // Analyze items
  useEffect(() => {
    const analyzeItems = () => {
      if (!orders || orders.length === 0 || !menuItems || menuItems.length === 0) return;

      const itemCount = orders.reduce((acc, order) => {
        if (!order.items || order.items.length === 0) return acc;

        order.items.forEach((item) => {
          const itemId = item.menuId;
          const quantity = item.quantity;

          if (!itemId) return acc;

          const menuItem = menuItems.find(m => m._id === itemId);
          const itemName = menuItem ? menuItem.name : null;

          if (!itemName || quantity == null) return acc;

          if (acc[itemName]) {
            acc[itemName].quantity += quantity;
            acc[itemName].revenue += (menuItem.price * quantity);
          } else {
            acc[itemName] = { 
              itemId: itemName, 
              quantity,
              revenue: menuItem.price * quantity
            };
          }
        });

        return acc;
      }, {});

      const formattedItemsData = Object.values(itemCount)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10); // Top 10 items

      setItemsData(formattedItemsData);
    };

    if (orders.length > 0 && menuItems.length > 0) {
      analyzeItems();
    }
  }, [orders, menuItems]);

  // Analyze status
  useEffect(() => {
    const analyzeStatus = () => {
      const statusCount = orders.reduce((acc, order) => {
        const status = order.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const formattedStatusData = Object.keys(statusCount).map((status) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: statusCount[status],
        percentage: ((statusCount[status] / orders.length) * 100).toFixed(1)
      }));

      setStatusData(formattedStatusData);

      // Find largest status
      const largest = formattedStatusData.reduce((max, item) => 
        item.value > max.value ? item : max, { value: 0 }
      );
      setLargestStatus(largest.name);
      setLargestValue(largest.value);
    };

    if (orders.length > 0) {
      analyzeStatus();
    }
  }, [orders]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return theme.palette.success.main;
      case 'pending': return theme.palette.warning.main;
      case 'canceled': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle />;
      case 'pending': return <Schedule />;
      case 'canceled': return <Cancel />;
      default: return <LocalShipping />;
    }
  };

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
          <AnalyticsIcon 
            sx={{ 
              fontSize: 60, 
              color: theme.palette.primary.main,
              mb: 2 
            }} 
          />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Loading Analytics Dashboard...
          </Typography>
          <CircularProgress size={40} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    );
  }

  const COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
        py: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              mb: 3
            }}
          >
            <AnalyticsIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2
            }}
          >
            Analytics Dashboard
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Comprehensive insights into your restaurant performance
          </Typography>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              title: 'Total Revenue',
              value: `$${totalRevenue.toLocaleString()}`,
              icon: <AttachMoney sx={{ fontSize: 40 }} />,
              color: theme.palette.success.main,
              subtitle: `${orders.length} total orders`
            },
            {
              title: 'Average Order Value',
              value: `$${avgOrderValue.toFixed(2)}`,
              icon: <TrendingUp sx={{ fontSize: 40 }} />,
              color: theme.palette.primary.main,
              subtitle: 'Per order average'
            },
            {
              title: 'Customer Rating',
              value: averageRating.toFixed(1),
              icon: <Star sx={{ fontSize: 40 }} />,
              color: theme.palette.warning.main,
              subtitle: `${ratingsData.length} reviews`
            },
            {
              title: 'Today Orders',
              value: todayOrders.length,
              icon: <Restaurant sx={{ fontSize: 40 }} />,
              color: theme.palette.info.main,
              subtitle: `${todayOrders.reduce((acc, order) => acc + order.totalAmount, 0).toLocaleString()} revenue`
            }
          ].map((kpi, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${alpha(kpi.color, 0.1)} 0%, ${alpha(kpi.color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(kpi.color, 0.2)}`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${alpha(kpi.color, 0.15)}`
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        background: alpha(kpi.color, 0.1)
                      }}
                    >
                      {React.cloneElement(kpi.icon, { sx: { color: kpi.color } })}
                    </Box>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: kpi.color }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {kpi.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {kpi.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs Navigation */}
        <Paper
          sx={{
            borderRadius: 3,
            mb: 3,
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 60
              }
            }}
          >
            <Tab icon={<TrendingUp />} iconPosition="start" label="Sales Analytics" />
            <Tab icon={<Restaurant />} iconPosition="start" label="Menu Performance" />
            <Tab icon={<LocalShipping />} iconPosition="start" label="Order Status" />
            <Tab icon={<Schedule />} iconPosition="start" label="Today's Activity" />
            <Tab icon={<Star />} iconPosition="start" label="Customer Feedback" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box>
          {/* Sales Analytics */}
          {currentTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Revenue Trend (Last 30 Days)
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.grey[500], 0.3)} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Revenue']}
                          contentStyle={{ borderRadius: 8 }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="totalSales" 
                          stroke={theme.palette.primary.main} 
                          fill={alpha(theme.palette.primary.main, 0.3)} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Sales Summary
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {salesData.slice(-7).map((day, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{day.date}</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              ${day.totalSales}
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={(day.totalSales / Math.max(...salesData.map(d => d.totalSales))) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: alpha(theme.palette.primary.main, 0.2),
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: 3
                              }
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Menu Performance */}
          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Top Performing Menu Items
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={itemsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.grey[500], 0.3)} />
                        <XAxis dataKey="itemId" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [name === 'quantity' ? value : `$${value}`, name === 'quantity' ? 'Quantity Sold' : 'Revenue']}
                          contentStyle={{ borderRadius: 8 }}
                        />
                        <Bar dataKey="quantity" fill={theme.palette.primary.main} name="Quantity Sold" />
                        <Bar dataKey="revenue" fill={theme.palette.success.main} name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Order Status */}
          {currentTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Order Status Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Status Overview
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {statusData.map((status, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: alpha(getStatusColor(status.name), 0.1) }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {getStatusIcon(status.name)}
                            <Typography variant="body1" fontWeight="bold" sx={{ ml: 1 }}>
                              {status.name}
                            </Typography>
                          </Box>
                          <Typography variant="h5" color={getStatusColor(status.name)}>
                            {status.value} orders
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {status.percentage}% of total
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Today's Activity */}
          {currentTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Today's Orders Overview
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Order ID</strong></TableCell>
                            <TableCell><strong>Customer</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Items</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {todayOrders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {order._id.slice(-8)}
                                </Typography>
                              </TableCell>
                              <TableCell>{order.customerName}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={`$${order.totalAmount}`} 
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={getStatusIcon(order.status)}
                                  label={order.status}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(getStatusColor(order.status), 0.1),
                                    color: getStatusColor(order.status),
                                    border: `1px solid ${getStatusColor(order.status)}`
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {order.items?.length || 0} items
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {todayOrders.length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Schedule sx={{ fontSize: 60, color: theme.palette.grey[300], mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">
                          No orders today
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Customer Feedback */}
          {currentTab === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Rating Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={ratingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.grey[500], 0.3)} />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, 'Reviews']} />
                        <Bar dataKey="count" fill={theme.palette.warning.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.primary.main} 100%)`
                        }}
                      >
                        <Star sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h3" fontWeight="bold" color="warning.main">
                        {averageRating.toFixed(1)}
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        Average Rating
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Based on {ratingsData.length} customer reviews
                      </Typography>
                    </Box>
                    <Box>
                      {ratingDistribution.map((rating, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" sx={{ width: 80 }}>
                            {rating.rating}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={rating.percentage}
                            sx={{
                              flex: 1,
                              height: 8,
                              borderRadius: 4,
                              mr: 2,
                              backgroundColor: alpha(theme.palette.warning.main, 0.2),
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: theme.palette.warning.main,
                                borderRadius: 4
                              }
                            }}
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {rating.count}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Summary Card */}
        <Card
          sx={{
            mt: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon color="primary" />
              Performance Insights
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  <strong>📈 Sales Performance:</strong> Your restaurant has generated <strong>${totalRevenue.toLocaleString()}</strong> in total revenue from <strong>{totalOrders}</strong> orders, with an average order value of <strong>${avgOrderValue.toFixed(2)}</strong>.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>🍽️ Menu Insights:</strong> {itemsData[0]?.itemId} is your top-performing item with {itemsData[0]?.quantity} units sold, generating ${itemsData[0]?.revenue?.toLocaleString()} in revenue.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  <strong>🚚 Order Management:</strong> Most orders (<strong>{largestValue}</strong>) are currently in <strong>{largestStatus}</strong> status, indicating efficient delivery operations.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>⭐ Customer Satisfaction:</strong> With an average rating of <strong>{averageRating.toFixed(1)}/5</strong> from {ratingsData.length} reviews, your service quality is {averageRating >= 4 ? 'excellent' : averageRating >= 3 ? 'good' : 'needing improvement'}.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SalesAndItemsAnalysis;