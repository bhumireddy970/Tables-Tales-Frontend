import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Avatar,
  alpha,
  CircularProgress,
  Radio,
  FormControlLabel,
  Paper
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Wifi,
  LocalParking,
  MusicNote,
  Pool,
  ChildCare,
  WheelchairPickup,
  Restaurant  // This was missing
} from '@mui/icons-material';

const BACKEND_API_URL = import.meta.env.VITE_BASE_URL;

const BranchSelection = ({ reservationData, onDataChange, onNext }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/branches`);
      if (response.ok) {
        const data = await response.json();
        setBranches(data.data);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    onDataChange({ branch });
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'wifi': <Wifi />,
      'parking': <LocalParking />,
      'valet': <LocalParking />,
      'live-music': <MusicNote />,
      'pool-side': <Pool />,
      'kids-zone': <ChildCare />,
      'wheelchair-accessible': <WheelchairPickup />
    };
    return icons[amenity] || <Wifi />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Select a Restaurant Branch
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Choose your preferred Table Tales location
        </Typography>

        <Grid container spacing={3}>
          {branches.map((branch) => (
            <Grid item xs={12} key={branch._id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: selectedBranch?._id === branch._id ? `2px solid ${alpha('#000', 0.8)}` : '1px solid',
                  borderColor: selectedBranch?._id === branch._id ? 'primary.main' : 'grey.300',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedBranch?._id === branch._id ? alpha('#000', 0.02) : 'white',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: alpha('#000', 0.02)
                  }
                }}
                onClick={() => handleBranchSelect(branch)}
              >
                <Box display="flex" alignItems="flex-start" gap={3}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedBranch?._id === branch._id}
                        onChange={() => handleBranchSelect(branch)}
                        color="primary"
                      />
                    }
                    label=""
                    sx={{ mt: 0 }}
                  />
                  
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: 'primary.main'
                        }}
                        src={branch.images[0]?.url}
                      >
                        <Restaurant /> {/* This line was causing the error */}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {branch.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="textSecondary">
                            {branch.address.street}, {branch.address.city}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="textSecondary">
                            {branch.operatingHours.open} - {branch.operatingHours.close}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Amenities */}
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      {branch.amenities.map((amenity) => (
                        <Chip
                          key={amenity}
                          icon={getAmenityIcon(amenity)}
                          label={amenity.replace('-', ' ')}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    {/* Tables Summary */}
                    <Typography variant="body2" color="textSecondary">
                      {branch.tables.length} tables available • Capacity: 2-{Math.max(...branch.tables.map(t => t.capacity))} people
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="contained"
            size="large"
            onClick={onNext}
            disabled={!selectedBranch}
            sx={{ px: 4 }}
          >
            Continue to Date & Time
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BranchSelection;