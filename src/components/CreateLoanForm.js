import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  InputAdornment,
  Alert,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AccountService from '../services/account.service';
import LoanService from '../services/LoanService';
import { useNavigate } from 'react-router-dom';

const CreateLoanForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interestRate: '',
    durationMonths: '',
    startDate: new Date(),
    destinationAccountId: ''
  });
  
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  const fetchAccounts = async () => {
    try {
      const response = await AccountService.getAccounts();
      setAccounts(response.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Failed to load accounts. Please try again later.');
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Loan name is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) 
      errors.amount = 'Please enter a valid amount greater than 0';
    if (!formData.interestRate || parseFloat(formData.interestRate) < 0) 
      errors.interestRate = 'Please enter a valid interest rate';
    if (!formData.durationMonths || parseInt(formData.durationMonths) <= 0) 
      errors.durationMonths = 'Duration must be at least 1 month';
    if (!formData.destinationAccountId) 
      errors.destinationAccountId = 'Please select a destination account';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleDateChange = (date) => {
    setFormData({ ...formData, startDate: date });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await LoanService.createLoan(formData);
      navigate('/app/loans');
    } catch (err) {
      console.error('Error creating loan:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create loan. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Create New Loan
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Loan Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={loading}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Loan Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              error={!!formErrors.amount}
              helperText={formErrors.amount}
              disabled={loading}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Interest Rate"
              name="interestRate"
              type="number"
              value={formData.interestRate}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              error={!!formErrors.interestRate}
              helperText={formErrors.interestRate}
              disabled={loading}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (months)"
              name="durationMonths"
              type="number"
              value={formData.durationMonths}
              onChange={handleInputChange}
              error={!!formErrors.durationMonths}
              helperText={formErrors.durationMonths}
              disabled={loading}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Start Date"
                inputFormat="MM/dd/yyyy"
                value={formData.startDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth disabled={loading} />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.destinationAccountId}>
              <InputLabel id="destination-account-label">Destination Account</InputLabel>
              <Select
                labelId="destination-account-label"
                name="destinationAccountId"
                value={formData.destinationAccountId}
                onChange={handleInputChange}
                disabled={loading}
                required
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} (${account.balance.toFixed(2)})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.destinationAccountId && (
                <Typography variant="caption" color="error">
                  {formErrors.destinationAccountId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/app/loans')}
                sx={{ mr: 1 }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Loan'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreateLoanForm;
