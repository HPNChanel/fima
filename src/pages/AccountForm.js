import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  useMediaQuery,
  FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import AccountService from '../services/account.service';

const AccountForm = () => {
  const [account, setAccount] = useState({
    name: '',
    type: 'BANK',
    balance: '',
    accountNumber: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = !!id;
  
  useEffect(() => {
    if (isEdit) {
      fetchAccount();
    }
  }, [isEdit, id]);
  
  const fetchAccount = async () => {
    try {
      setFetchLoading(true);
      const response = await AccountService.getAccount(id);
      const accountData = response.data;
      
      setAccount({
        name: accountData.name,
        type: accountData.type,
        balance: accountData.balance,
        accountNumber: accountData.accountNumber || '',
        description: accountData.description || ''
      });
      
      setFetchLoading(false);
    } catch (err) {
      setFetchLoading(false);
      setError('Failed to fetch account details. Please try again later.');
      console.error('Error fetching account:', err);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when field changes
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    if (!account.name || account.name.trim() === '') {
      errors.name = 'Account name is required';
      isValid = false;
    }
    
    if (!account.type) {
      errors.type = 'Account type is required';
      isValid = false;
    }
    
    if (account.balance === '' || isNaN(account.balance)) {
      errors.balance = 'Please enter a valid balance amount';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Ensure balance is converted to a numeric value
      const accountData = {
        name: account.name.trim(),
        type: account.type,
        balance: parseFloat(account.balance),
        accountNumber: account.accountNumber || '',
        description: account.description || ''
      };
      
      console.log('Submitting account data:', accountData);
      
      if (isEdit) {
        await AccountService.updateAccount(id, accountData);
      } else {
        await AccountService.createAccount(accountData);
      }
      
      // After successful submission, navigate to accounts list
      navigate('/app/accounts');
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} account. Please try again.`;
      setError(errorMessage);
      console.error(`Error ${isEdit ? 'updating' : 'creating'} account:`, err);
    }
  };
  
  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ mb: 4 }}>
      <Breadcrumbs 
        aria-label="breadcrumb" 
        sx={{ mb: 2 }}
        maxItems={isMobile ? 2 : 3}
        itemsBeforeCollapse={0}
        itemsAfterCollapse={2}
      >
        <MuiLink component={Link} to="/app" underline="hover" color="inherit">
          Dashboard
        </MuiLink>
        <MuiLink component={Link} to="/app/accounts" underline="hover" color="inherit">
          Accounts
        </MuiLink>
        <Typography color="text.primary">
          {isEdit ? 'Edit Account' : 'Add Account'}
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Edit Account' : 'Add Account'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/app/accounts"
        >
          Back to Accounts
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Name"
                name="name"
                value={account.name}
                onChange={handleChange}
                required
                error={!!validationErrors.name}
                helperText={validationErrors.name}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!validationErrors.type}>
                <InputLabel id="type-label">Account Type</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={account.type}
                  onChange={handleChange}
                  label="Account Type"
                >
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="BANK">Bank Account</MenuItem>
                  <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                  <MenuItem value="E_WALLET">E-Wallet</MenuItem>
                </Select>
                {validationErrors.type && (
                  <FormHelperText>{validationErrors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Balance"
                name="balance"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={account.balance}
                onChange={handleChange}
                required
                error={!!validationErrors.balance}
                helperText={validationErrors.balance}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Number (Optional)"
                name="accountNumber"
                value={account.accountNumber}
                onChange={handleChange}
                placeholder="For your reference only"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={account.description}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Add notes about this account"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  component={Link}
                  to="/app/accounts"
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : isEdit ? (
                    'Update Account'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AccountForm;
