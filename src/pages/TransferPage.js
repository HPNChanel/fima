import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Snackbar,
  Breadcrumbs
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AccountService from '../services/account.service';

const TransferPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const sourceAccountId = queryParams.get('sourceAccount');

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fromAccount: sourceAccountId || '',
    toAccount: '',
    amount: '',
    description: 'Transfer between accounts'
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    // Update fromAccount when sourceAccountId is available
    if (sourceAccountId && formData.fromAccount === '') {
      setFormData(prev => ({
        ...prev,
        fromAccount: sourceAccountId
      }));
    }
  }, [sourceAccountId, formData.fromAccount]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await AccountService.getAccounts();
      setAccounts(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load accounts. Please try again later.');
      console.error('Error fetching accounts:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear errors on change
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const errors = {};
    if (!formData.fromAccount) errors.fromAccount = 'Source account is required';
    if (!formData.toAccount) errors.toAccount = 'Destination account is required';
    if (formData.fromAccount === formData.toAccount) 
      errors.toAccount = 'Source and destination accounts cannot be the same';
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) 
      errors.amount = 'A valid positive amount is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      
      // Format the transfer data for the API
      // Ensure data types are correct - backend expects numbers, not strings
      const transferData = {
        fromAccountId: parseInt(formData.fromAccount),
        toAccountId: parseInt(formData.toAccount),
        amount: parseFloat(formData.amount),
        description: formData.description || 'Transfer between accounts'
      };
      
      console.log('Sending transfer request:', transferData);
      
      // Call the transfer API
      const result = await AccountService.transferMoney(transferData);
      
      // Check if there was a partial success (transfer worked but transactions weren't created)
      const hasWarning = result.message && result.message.includes("Transaction records were not created");
      
      setSnackbar({
        open: true,
        message: hasWarning 
          ? 'Transfer completed, but transaction records could not be created due to a system issue.'
          : 'Transfer completed successfully',
        severity: hasWarning ? 'warning' : 'success'
      });
      
      // Still navigate back since the primary action (transfer) succeeded
      setTimeout(() => {
        navigate('/app/accounts');
      }, 2000);
    } catch (error) {
      console.error('Transfer error:', error);
      let errorMessage = 'An error occurred during the transfer';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 'Server error: ' + error.response.status;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: `Error: ${errorMessage}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2 
    }).format(amount);
  };

  // Find account details by ID
  const getAccountById = (id) => {
    return accounts.find(account => account.id.toString() === id.toString());
  };

  return (
    <Container maxWidth="md">
      <Breadcrumbs sx={{ mb: 2, mt: 2 }}>
        <Typography 
          component={Link} 
          to="/app" 
          color="inherit" 
          sx={{ textDecoration: 'none' }}
        >
          Dashboard
        </Typography>
        <Typography 
          component={Link} 
          to="/app/accounts" 
          color="inherit" 
          sx={{ textDecoration: 'none' }}
        >
          Accounts
        </Typography>
        <Typography color="text.primary">Transfer Money</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Transfer Money Between Accounts
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.fromAccount}>
                <InputLabel>From Account</InputLabel>
                <Select
                  name="fromAccount"
                  value={formData.fromAccount}
                  onChange={handleChange}
                  label="From Account"
                >
                  {accounts.map(account => (
                    <MenuItem key={account.id} value={account.id.toString()}>
                      {account.name} ({formatCurrency(account.balance)})
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.fromAccount && (
                  <Typography variant="caption" color="error">
                    {formErrors.fromAccount}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.toAccount}>
                <InputLabel>To Account</InputLabel>
                <Select
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleChange}
                  label="To Account"
                >
                  {accounts.map(account => (
                    <MenuItem 
                      key={account.id} 
                      value={account.id.toString()}
                      disabled={account.id.toString() === formData.fromAccount}
                    >
                      {account.name} ({formatCurrency(account.balance)})
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.toAccount && (
                  <Typography variant="caption" color="error">
                    {formErrors.toAccount}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                <Box sx={{ flex: 1, textAlign: 'right', pr: 2 }}>
                  {formData.fromAccount && (
                    <Typography variant="body1" fontWeight="medium">
                      {getAccountById(formData.fromAccount)?.name || 'Source Account'}
                    </Typography>
                  )}
                </Box>
                <ArrowForwardIcon color="primary" />
                <Box sx={{ flex: 1, pl: 2 }}>
                  {formData.toAccount && (
                    <Typography variant="body1" fontWeight="medium">
                      {getAccountById(formData.toAccount)?.name || 'Destination Account'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                error={!!formErrors.amount}
                helperText={formErrors.amount}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  component={Link}
                  to="/app/accounts"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  Complete Transfer
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TransferPage;
