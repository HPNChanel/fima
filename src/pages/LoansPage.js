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
import LoanService from '../services/LoanService';
import LoansList from '../components/LoansList';
// Remove or comment out the logging import if it doesn't exist
// import { logComponentMount } from '../utils/logging';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  useEffect(() => {
    // Comment out or remove the logging call
    // logComponentMount('LoansPage');
    console.log('LoansPage mounted'); // Use console.log instead
    fetchLoans();
  }, []);
  
  const fetchLoans = async () => {
    try {
      setLoading(true);
      console.log("Fetching loans...");
      const response = await LoanService.getAllLoans();
      console.log("Loans received:", response.data);
      setLoans(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Failed to load your loans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const filterLoansByStatus = (status) => {
    if (status === 'ALL') return loans;
    return loans.filter(loan => loan.status === status);
  };
  
  const getFilteredLoans = () => {
    switch (tabValue) {
      case 0:
        return filterLoansByStatus('ALL');
      case 1:
        return filterLoansByStatus('ACTIVE');
      case 2:
        return filterLoansByStatus('COMPLETED');
      case 3:
        return filterLoansByStatus('DEFAULTED');
      default:
        return loans;
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
            Loan Simulation
          </Typography>
          
          <Button 
            component={Link} 
            to="/app/loans/new"
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
          >
            New Loan
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
            <Tab label="Completed" />
            <Tab label="Defaulted" />
          </Tabs>
        </Paper>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <LoansList loans={getFilteredLoans()} />
        )}
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.type}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoansPage;
