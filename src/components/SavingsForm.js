import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  MenuItem, 
  Grid, 
  Paper, 
  FormControl, 
  FormHelperText,
  InputLabel,
  Select,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import SavingsService from '../services/SavingsService';
import AccountService from '../services/account.service';

const SavingsForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    initialDeposit: '',
    interestRate: '',
    termType: '',
    tag: '',
    sourceAccountId: '',
    startDate: new Date()
  });
  
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  // Predefined interest rates for different term types
  const interestRatePresets = {
    DAILY_FLEXIBLE: 2.5,
    THREE_MONTH: 3.0,
    SIX_MONTH: 3.5,
    TWELVE_MONTH: 4.0
  };
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  const fetchAccounts = async () => {
    setFetchingAccounts(true);
    try {
      // Use getAccounts instead of getAllAccounts to match the method in account.service.js
      const response = await AccountService.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch accounts. Please try again.',
        type: 'error'
      });
    } finally {
      setFetchingAccounts(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error for this field when changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // Auto-set interest rate when term type changes
    if (name === 'termType' && value) {
      setFormData(prev => ({
        ...prev,
        interestRate: interestRatePresets[value]
      }));
    }
  };
  
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      startDate: date
    });
    
    if (errors.startDate) {
      setErrors({
        ...errors,
        startDate: null
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.initialDeposit || formData.initialDeposit <= 0) {
      newErrors.initialDeposit = 'Initial deposit must be greater than 0';
    }
    
    if (!formData.interestRate || formData.interestRate <= 0) {
      newErrors.interestRate = 'Interest rate must be greater than 0';
    }
    
    if (!formData.termType) {
      newErrors.termType = 'Term type is required';
    }
    
    if (!formData.sourceAccountId) {
      newErrors.sourceAccountId = 'Source account is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        startDate: format(formData.startDate, 'yyyy-MM-dd')
      };
      
      await SavingsService.createSavingsAccount(payload);
      
      setNotification({
        open: true,
        message: 'Savings account created successfully!',
        type: 'success'
      });
      
      setFormData({
        name: '',
        initialDeposit: '',
        interestRate: '',
        termType: '',
        tag: '',
        sourceAccountId: '',
        startDate: new Date()
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating savings account:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to create savings account';
      setNotification({
        open: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  const getSelectedAccountBalance = () => {
    if (!formData.sourceAccountId) return null;
    const account = accounts.find(acc => acc.id === formData.sourceAccountId);
    return account ? account.balance : null;
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h6" gutterBottom>
          Create New Savings Account
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Savings Account Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name || 'Enter a name for your savings account'}
              required
            />
          </Grid>
          
          {/* Tag */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tag (Optional)"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              helperText="e.g., Vacation Fund, Emergency Fund, etc."
              InputProps={{
                startAdornment: formData.tag ? (
                  <InputAdornment position="start">
                    <Chip 
                      label={formData.tag} 
                      size="small" 
                      sx={{ mr: 1 }}
                      onDelete={() => setFormData({...formData, tag: ''})}
                    />
                  </InputAdornment>
                ) : null,
              }}
            />
          </Grid>
          
          {/* Source Account */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.sourceAccountId} required>
              <InputLabel>Source Account</InputLabel>
              <Select
                name="sourceAccountId"
                value={formData.sourceAccountId}
                onChange={handleChange}
                label="Source Account"
                disabled={fetchingAccounts}
              >
                {fetchingAccounts ? (
                  <MenuItem value="" disabled>Loading accounts...</MenuItem>
                ) : accounts.length === 0 ? (
                  <MenuItem value="" disabled>No accounts available</MenuItem>
                ) : (
                  accounts.map(account => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name} (Balance: ${account.balance})
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>
                {errors.sourceAccountId || (fetchingAccounts ? 'Loading accounts...' : 'Select the account to withdraw funds from')}
              </FormHelperText>
            </FormControl>
          </Grid>
          
          {/* Initial Deposit */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Initial Deposit"
              name="initialDeposit"
              type="number"
              value={formData.initialDeposit}
              onChange={handleChange}
              error={!!errors.initialDeposit}
              helperText={
                errors.initialDeposit || 
                (getSelectedAccountBalance() !== null
                  ? `Available balance: $${getSelectedAccountBalance()}`
                  : 'Enter the amount to deposit')
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
            />
          </Grid>
          
          {/* Term Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.termType} required>
              <InputLabel>Term Type</InputLabel>
              <Select
                name="termType"
                value={formData.termType}
                onChange={handleChange}
                label="Term Type"
              >
                <MenuItem value="DAILY_FLEXIBLE">Flexible (Daily Interest)</MenuItem>
                <MenuItem value="THREE_MONTH">3 Month Fixed</MenuItem>
                <MenuItem value="SIX_MONTH">6 Month Fixed</MenuItem>
                <MenuItem value="TWELVE_MONTH">12 Month Fixed</MenuItem>
              </Select>
              <FormHelperText>
                {errors.termType || 'Select the term for your savings account'}
              </FormHelperText>
            </FormControl>
          </Grid>
          
          {/* Interest Rate */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Interest Rate"
              name="interestRate"
              type="number"
              value={formData.interestRate}
              onChange={handleChange}
              error={!!errors.interestRate}
              helperText={errors.interestRate || 'Annual interest rate (%)'}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              required
            />
          </Grid>
          
          {/* Start Date */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.startDate}
                    helperText={errors.startDate || 'Select when to start your savings account'}
                    required
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        
        {formData.termType && formData.initialDeposit > 0 && formData.interestRate > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Estimated Returns:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Daily Interest:
                </Typography>
                <Typography variant="body1">
                  ${((formData.initialDeposit * formData.interestRate) / 36500).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Monthly Interest:
                </Typography>
                <Typography variant="body1">
                  ${((formData.initialDeposit * formData.interestRate * 30) / 36500).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  {formData.termType === 'DAILY_FLEXIBLE' ? 'Annual' : 'Maturity'} Interest:
                </Typography>
                <Typography variant="body1">
                  ${
                    formData.termType === 'DAILY_FLEXIBLE' 
                    ? ((formData.initialDeposit * formData.interestRate) / 100).toFixed(2)
                    : (formData.initialDeposit * formData.interestRate * 
                      (formData.termType === 'THREE_MONTH' ? 90 : 
                       formData.termType === 'SIX_MONTH' ? 180 : 365)) / 36500
                  }
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Savings Account'}
          </Button>
        </Box>
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
    </Paper>
  );
};

export default SavingsForm;