import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  InputAdornment,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import AccountService from '../services/account.service';
import DateProvider from './DateProvider';

const TransactionFormDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  transaction = null, 
  mode = 'create' // 'create' or 'duplicate'
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE',
    category: '',
    date: new Date(),
    accountId: '',
    notes: ''
  });
  
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Fetch accounts on component mount
  useEffect(() => {
    if (open) {
      fetchAccounts();
    }
  }, [open]);
  
  // Update form data when transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount || '',
        type: transaction.type || 'EXPENSE',
        category: transaction.category || '',
        date: transaction.date ? new Date(transaction.date) : new Date(),
        accountId: transaction.accountId || '',
        notes: transaction.notes || ''
      });
    }
  }, [transaction]);
  
  const fetchAccounts = async () => {
    try {
      const response = await AccountService.getAccounts();
      setAccounts(response.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field changes
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };
  
  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
    
    if (validationErrors.date) {
      setValidationErrors({
        ...validationErrors,
        date: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    if (!formData.description || formData.description.trim() === '') {
      errors.description = 'Description is required';
      isValid = false;
    }
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0';
      isValid = false;
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
      isValid = false;
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
      isValid = false;
    }
    
    if (!formData.accountId) {
      errors.accountId = 'Account is required';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create a copy of the form data with the date correctly formatted for the API
    const submissionData = {
      ...formData,
      // Ensure date is a valid Date object that can be converted to ISO string
      date: formData.date instanceof Date ? formData.date : new Date(formData.date),
      amount: parseFloat(formData.amount)
    };
    
    // Adjust date to prevent timezone issues
    if (submissionData.date instanceof Date) {
      // Set the time to noon to avoid timezone day shifts
      const adjustedDate = new Date(submissionData.date);
      adjustedDate.setHours(12, 0, 0, 0);
      submissionData.date = adjustedDate;
    }
    
    // Log the data being submitted
    console.log('Submitting transaction with adjusted date:', submissionData.date);
    
    onSubmit(submissionData);
  };
  
  // Get dialog title based on mode
  const getDialogTitle = () => {
    if (mode === 'create') {
      return 'Create New Transaction';
    } else if (mode === 'duplicate') {
      return 'Create Similar Transaction';
    }
    return 'Transaction';
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{getDialogTitle()}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
              margin="normal"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              error={!!validationErrors.amount}
              helperText={validationErrors.amount}
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Transaction Type"
              >
                <MenuItem value="INCOME">Income</MenuItem>
                <MenuItem value="EXPENSE">Expense</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" required error={!!validationErrors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="FOOD">Food</MenuItem>
                <MenuItem value="TRANSPORT">Transport</MenuItem>
                <MenuItem value="ENTERTAINMENT">Entertainment</MenuItem>
                <MenuItem value="UTILITIES">Utilities</MenuItem>
                <MenuItem value="HOUSING">Housing</MenuItem>
                <MenuItem value="HEALTHCARE">Healthcare</MenuItem>
                <MenuItem value="EDUCATION">Education</MenuItem>
                <MenuItem value="SHOPPING">Shopping</MenuItem>
                <MenuItem value="SALARY">Salary</MenuItem>
                <MenuItem value="INVESTMENT">Investment</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
              {validationErrors.category && (
                <Typography variant="caption" color="error">
                  {validationErrors.category}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DateProvider>
              <DateTimePicker
                label="Date & Time"
                value={formData.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    required: true,
                    error: !!validationErrors.date,
                    helperText: validationErrors.date
                  }
                }}
              />
            </DateProvider>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" required error={!!validationErrors.accountId}>
              <InputLabel>Account</InputLabel>
              <Select
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                label="Account"
              >
                {accounts.map(account => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} (${parseFloat(account.balance).toFixed(2)})
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.accountId && (
                <Typography variant="caption" color="error">
                  {validationErrors.accountId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes (Optional)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              placeholder="Add any additional details about this transaction"
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? 'Saving...' : 'Save Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionFormDialog;
