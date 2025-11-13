import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  alpha,
  useTheme
} from '@mui/material';
import {
  Restaurant,
  LocationOn,
  CalendarToday,
  People,
  CheckCircle
} from '@mui/icons-material';
import BranchSelection from './BranchSelection';
import DateTimeSelection from './DateTimeSelection';
import GuestDetails from './GuestDetails';
import Confirmation from './Confirmation';
import { useNavigate } from 'react-router-dom';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;


const ReservationPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [reservationData, setReservationData] = useState({
    branch: null,
    date: null,
    time: null,
    partySize: 2,
    customer: {
      name: '',
      email: '',
      phone: ''
    },
    specialRequests: ''
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const steps = [
    { label: 'Select Branch', icon: <LocationOn /> },
    { label: 'Date & Time', icon: <CalendarToday /> },
    { label: 'Guest Details', icon: <People /> },
    { label: 'Confirmation', icon: <CheckCircle /> }
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReservationDataChange = (newData) => {
    setReservationData(prev => ({ ...prev, ...newData }));
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleReservationSubmit = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reservationData,
          tableNumber: selectedTable.tableNumber,
          branch: reservationData.branch._id
        }),
      });

      if (response.ok) {
        const result = await response.json();
        handleNext(); // Move to confirmation step
      } else {
        throw new Error('Failed to create reservation');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Failed to create reservation. Please try again.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BranchSelection
            reservationData={reservationData}
            onDataChange={handleReservationDataChange}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <DateTimeSelection
            reservationData={reservationData}
            onDataChange={handleReservationDataChange}
            onTableSelect={handleTableSelect}
            availableTables={availableTables}
            setAvailableTables={setAvailableTables}
            selectedTable={selectedTable}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <GuestDetails
            reservationData={reservationData}
            onDataChange={handleReservationDataChange}
            selectedTable={selectedTable}
            onNext={handleReservationSubmit}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Confirmation
            reservationData={reservationData}
            selectedTable={selectedTable}
            onBackToHome={() => navigate('/')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
        py: 4
      }}
    >
      <Container maxWidth="lg">
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
            <Restaurant sx={{ fontSize: 40, color: 'white' }} />
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
            Table Reservation
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Reserve your perfect dining experience in just a few steps
          </Typography>
        </Box>

        {/* Stepper */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            mb: 4,
            background: 'white'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: activeStep >= index ? theme.palette.primary.main : theme.palette.grey[300],
                          color: activeStep >= index ? 'white' : theme.palette.grey[500]
                        }}
                      >
                        {step.icon}
                      </Box>
                    )}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={activeStep === index ? 'bold' : 'normal'}
                      color={activeStep === index ? 'primary' : 'textSecondary'}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            {getStepContent(activeStep)}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ReservationPage;