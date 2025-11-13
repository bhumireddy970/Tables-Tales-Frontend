import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  List, 
  ListItem, 
  ListItemText,
  Paper,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Event as EventIcon,
  CalendarToday,
  CheckCircle,
  Schedule,
  Analytics,
  Palette
} from '@mui/icons-material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from '../components/Layout/Layout';
import { useUser } from '../contextAPI/context';
import { useNavigate } from 'react-router-dom';
const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;
// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const EventAnalysis = () => {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { role } = useUser();
  const navigate = useNavigate();



  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/catering/getEvents`);
        if (response.ok) {
          const data = await response.json();
          setEventsData(data.events || []);
        } else {
          const error = await response.json();
          console.error("Error occurred", error.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (eventsData.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          No events data available for analysis
        </Alert>
      </Container>
    );
  }

  // Get current date for comparison
  const currentDate = new Date();

  // Separate events into completed and not completed
  const completedEvents = eventsData.filter(event => new Date(event.eventDate) < currentDate);
  const notCompletedEvents = eventsData.filter(event => new Date(event.eventDate) >= currentDate);

  // Aggregate data for charts
  const eventTypeCount = eventsData.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {});

  // Professional color palette
  const getColor = (index) => {
    const colors = [
      '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0',
      '#4895ef', '#560bad', '#b5179e', '#f15bb5', '#00bbf9'
    ];
    return colors[index % colors.length];
  };

  // Chart options for consistent styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      }
    }
  };

  // Bar chart data
  const barChartData = {
    labels: Object.keys(eventTypeCount),
    datasets: [
      {
        label: 'Number of Events',
        data: Object.values(eventTypeCount),
        backgroundColor: Object.keys(eventTypeCount).map((_, index) => getColor(index)),
        borderColor: Object.keys(eventTypeCount).map((_, index) => getColor(index)),
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  // Pie chart data
  const pieChartData = {
    labels: Object.keys(eventTypeCount),
    datasets: [
      {
        data: Object.values(eventTypeCount),
        backgroundColor: Object.keys(eventTypeCount).map((_, index) => getColor(index)),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Extract booked dates
  const bookedDates = eventsData.map(event => {
    const eventDate = new Date(event.eventDate);
    return eventDate.getTime() ? eventDate.toISOString().split('T')[0] : null;
  }).filter(date => date !== null);

  // Handle date change
  const handleDateChange = date => {
    setSelectedDate(date);
  };

  // Event card component
  const EventCard = ({ event, isCompleted }) => (
    <Card 
      sx={{ 
        mb: 2, 
        borderLeft: `4px solid ${isCompleted ? '#4caf50' : '#ff9800'}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" fontWeight="600">
            {event.eventName}
          </Typography>
          <Chip 
            icon={isCompleted ? <CheckCircle /> : <Schedule />}
            label={isCompleted ? 'Completed' : 'Upcoming'}
            color={isCompleted ? 'success' : 'warning'}
            size="small"
          />
        </Box>
        
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
              <CalendarToday fontSize="small" />
              {new Date(event.eventDate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Type:</strong> {event.eventType}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Guests:</strong> {event.numberOfGuests}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Days:</strong> {event.noOfDays}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  // Color legend component
  const ColorLegend = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
        <Palette />
        Event Type Legend
      </Typography>
      <List dense>
        {Object.keys(eventTypeCount).map((eventType, index) => (
          <ListItem key={eventType} sx={{ px: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: getColor(index),
                borderRadius: 1,
                mr: 2,
                flexShrink: 0
              }}
            />
            <ListItemText 
              primary={eventType} 
              secondary={`${eventTypeCount[eventType]} event(s)`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography 
          variant="h4" 
          fontWeight="700" 
          color="primary.main"
          gutterBottom
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Analytics fontSize="large" />
          Catering Event Analytics Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Comprehensive analysis and insights for catering events management
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <EventIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="700">{eventsData.length}</Typography>
            <Typography variant="h6">Total Events</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="700">{completedEvents.length}</Typography>
            <Typography variant="h6">Completed</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
            <Schedule sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="700">{notCompletedEvents.length}</Typography>
            <Typography variant="h6">Upcoming</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Charts Section */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Bar Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '400px' }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Events by Type
                </Typography>
                <Bar data={barChartData} options={chartOptions} height={300} />
              </Paper>
            </Grid>

            {/* Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '400px' }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Event Distribution
                </Typography>
                <Pie data={pieChartData} options={chartOptions} height={300} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Calendar and Legend Section */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Calendar */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom display="flex" alignItems="center" gap={1}>
                  <CalendarToday />
                  Event Calendar
                </Typography>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileClassName={({ date, view }) => {
                    if (view === 'month' && bookedDates.includes(date.toISOString().split('T')[0])) {
                      return 'highlighted';
                    }
                    return '';
                  }}
                />
              </Paper>
            </Grid>

            {/* Legend */}
            <Grid item xs={12}>
              <ColorLegend />
            </Grid>
          </Grid>
        </Grid>

        {/* Events Lists */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom display="flex" alignItems="center" gap={1}>
              <Schedule color="warning" />
              Upcoming Events ({notCompletedEvents.length})
            </Typography>
            {notCompletedEvents.length > 0 ? (
              notCompletedEvents.map(event => (
                <EventCard key={event._id} event={event} isCompleted={false} />
              ))
            ) : (
              <Alert severity="info">No upcoming events scheduled</Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom display="flex" alignItems="center" gap={1}>
              <CheckCircle color="success" />
              Completed Events ({completedEvents.length})
            </Typography>
            {completedEvents.length > 0 ? (
              completedEvents.map(event => (
                <EventCard key={event._id} event={event} isCompleted={true} />
              ))
            ) : (
              <Alert severity="info">No completed events found</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Custom CSS for calendar highlights */}
      <style>
        {`
          .highlighted {
            background-color: #4361ee !important;
            color: white !important;
            border-radius: 50%;
          }
          .react-calendar {
            border: none;
            width: 100%;
          }
          .react-calendar__tile--active {
            background: #3a0ca3;
          }
        `}
      </style>
    </Container>
  );
};

export default EventAnalysis;
