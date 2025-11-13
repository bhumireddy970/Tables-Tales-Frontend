import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  alpha,
  CircularProgress,
  Paper,
  Radio,
  FormControlLabel,
  TextField,
  MenuItem
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Group,
  Chair
} from '@mui/icons-material';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const DateTimeSelection = ({
  reservationData,
  onDataChange,
  onTableSelect,
  availableTables,
  setAvailableTables,
  selectedTable,
  onNext,
  onBack
}) => {
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    generateTimeSlots();
  }, []);

  useEffect(() => {
    if (reservationData.date && reservationData.time && reservationData.partySize) {
      checkAvailability();
    }
  }, [reservationData.date, reservationData.time, reservationData.partySize]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    setTimeSlots(slots);
  };

  const checkAvailability = async () => {
    if (!reservationData.branch || !reservationData.date || !reservationData.time) return;

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/reservations/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch: reservationData.branch._id,
          date: reservationData.date,
          time: reservationData.time,
          partySize: reservationData.partySize
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableTables(data.suitableTables || []);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
    onDataChange({ date: event.target.value });
    onTableSelect(null);
  };

  const handleTimeChange = (event) => {
    onDataChange({ time: event.target.value });
    onTableSelect(null);
  };

  const handlePartySizeChange = (size) => {
    onDataChange({ partySize: size });
    onTableSelect(null);
  };

  const getTableTypeColor = (type) => {
    const colors = {
      'indoor': 'primary',
      'outdoor': 'success',
      'private': 'secondary',
      'bar': 'warning'
    };
    return colors[type] || 'default';
  };

  const isNextDisabled = !reservationData.date || !reservationData.time || !selectedTable;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Select Date & Time
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Choose when you'd like to dine with us
        </Typography>

        <Grid container spacing={4}>
          {/* Date & Time Selection */}
          <Grid item xs={12} md={6}>
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday /> Select Date
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={reservationData.date || ''}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime /> Select Time
              </Typography>
              <TextField
                fullWidth
                select
                value={reservationData.time || ''}
                onChange={handleTimeChange}
                label="Select Time"
              >
                {timeSlots.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Group /> Party Size
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                  <Chip
                    key={size}
                    label={`${size} ${size === 1 ? 'person' : 'people'}`}
                    onClick={() => handlePartySizeChange(size)}
                    color={reservationData.partySize === size ? 'primary' : 'default'}
                    variant={reservationData.partySize === size ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Available Tables */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chair /> Available Tables
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
              </Box>
            ) : availableTables.length > 0 ? (
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {availableTables.length} tables available for your selection
                </Typography>
                <Grid container spacing={2}>
                  {availableTables.map((table) => (
                    <Grid item xs={12} key={table.tableNumber}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: selectedTable?.tableNumber === table.tableNumber ? `2px solid ${alpha('#000', 0.8)}` : '1px solid',
                          borderColor: selectedTable?.tableNumber === table.tableNumber ? 'primary.main' : 'grey.300',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: selectedTable?.tableNumber === table.tableNumber ? alpha('#000', 0.02) : 'white',
                          '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: alpha('#000', 0.02)
                          }
                        }}
                        onClick={() => onTableSelect(table)}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <FormControlLabel
                            control={
                              <Radio
                                checked={selectedTable?.tableNumber === table.tableNumber}
                                onChange={() => onTableSelect(table)}
                                color="primary"
                              />
                            }
                            label=""
                          />
                          <Box flex={1}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="h6" fontWeight="bold">
                                Table {table.tableNumber}
                              </Typography>
                              <Chip
                                label={table.tableType}
                                color={getTableTypeColor(table.tableType)}
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                              Capacity: {table.capacity} people
                            </Typography>
                            {table.features && table.features.length > 0 && (
                              <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                                {table.features.map((feature, index) => (
                                  <Chip
                                    key={index}
                                    label={feature.replace('-', ' ')}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  {reservationData.date && reservationData.time
                    ? 'No tables available for the selected date and time. Please try different options.'
                    : 'Please select a date and time to see available tables.'}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button variant="outlined" onClick={onBack}>
            Back to Branches
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={onNext}
            disabled={isNextDisabled}
            sx={{ px: 4 }}
          >
            Continue to Guest Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DateTimeSelection;