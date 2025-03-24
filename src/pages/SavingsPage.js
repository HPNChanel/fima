import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  Button, 
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import SavingsService from '../services/SavingsService';
import SavingsList from '../components/SavingsList';
import { logComponentMount } from '../utils/debugUtils'; // Add this import

const SavingsPage = () => {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  useEffect(() => {
    logComponentMount('SavingsPage'); // Log when component mounts
    fetchSavings();
  }, []);
  
  const fetchSavings = async () => {
    try {
      setLoading(true);
      console.log("Fetching savings accounts..."); // Add logging for debugging
      const response = await SavingsService.getAllSavingsAccounts();
      console.log("Savings accounts received:", response.data);
      setSavings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching savings accounts:', err);
      setError('Failed to load your savings accounts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const filterSavingsByStatus = (status) => {
    if (status === 'ALL') return savings;
    return savings.filter(account => account.status === status);
  };
  
  const getFilteredSavings = () => {
    switch (tabValue) {
      case 0:
        return filterSavingsByStatus('ALL');
      case 1:
        return filterSavingsByStatus('ACTIVE');
      case 2:
        return filterSavingsByStatus('MATURED');
      case 3:
        return filterSavingsByStatus('WITHDRAWN');
      default:
        return savings;
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Savings Accounts
          </Typography>
          
          <Button 
            component={Link} 
            to="/app/savings/new"
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
          >
            New Savings
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All" />
            <Tab label="Active" />
            <Tab label="Matured" />
            <Tab label="Withdrawn" />
          </Tabs>
        </Paper>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <SavingsList 
            savings={getFilteredSavings()} 
            onUpdate={fetchSavings} 
          />
        )}
      </Box>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SavingsPage;
