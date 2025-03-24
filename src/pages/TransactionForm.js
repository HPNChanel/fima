import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Grid,
  Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert, Breadcrumbs, Link as MuiLink,
  InputAdornment, FormHelperText, useMediaQuery,
  Divider, Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  BookmarkBorder as TemplateIcon,
  Bookmark as SavedTemplateIcon
} from '@mui/icons-material';
import TransactionService from '../services/transaction.service';
import AccountSelector from '../components/AccountSelector';
import TemplateSelector from '../components/TemplateSelector';
import SaveTemplateDialog from '../components/SaveTemplateDialog';

const TransactionForm = () => {
  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE',
    category: '',
    date: new Date(),
    accountId: '',
    notes: '' // Add notes field
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!id;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get date from URL query parameters if available
  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get('date');

  // Fix the initial form data setup to properly handle date from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accountId = params.get('accountId');
    const dateParam = params.get('date');
    
    if (isEdit) {
      fetchTransaction();
      return;
    } 
    // Check if we have template data passed from the TemplateList page
    else if (location.state?.template) {
      const template = location.state.template;
      setTransaction({
        description: template.description || '',
        amount: template.amount || '',
        type: template.type || 'EXPENSE',
        category: template.category || '',
        date: new Date(), // Always use current date
        accountId: template.accountId || '',
        notes: template.notes || ''
      });
    }
    // Handle date parameter separately
    if (dateParam) {
      try {
        // Create a date at noon on the selected day to avoid timezone issues
        const selectedDate = new Date(`${dateParam}T12:00:00`);
        
        if (!isNaN(selectedDate.getTime())) { // Verify the date is valid
          // Update only the date field in the transaction
          setTransaction(prev => ({
            ...prev,
            date: selectedDate,
            accountId: accountId || prev.accountId
          }));
        }
      } catch (e) {
        console.error("Error parsing date parameter:", e);
      }
    } else if (accountId) {
      // If only accountId is specified
      setTransaction(prev => ({
        ...prev,
        accountId: accountId
      }));
    }
  }, [isEdit, location.state, location.search]);

  const fetchTransaction = async () => {
    try {
      setLoadingData(true);
      const response = await TransactionService.getTransaction(id);
      const data = response.data;
      
      setTransaction({
        description: data.description,
        amount: parseFloat(data.amount),
        type: data.type,
        category: data.category,
        date: new Date(data.date),
        accountId: data.accountId,
        notes: data.notes || '' // Initialize notes field
      });
      
      setLoadingData(false);
    } catch (err) {
      setLoadingData(false);
      setError('Failed to fetch transaction. Please try again later.');
      console.error('Error fetching transaction:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
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
    
    // Reset template saved state when form changes
    setTemplateSaved(false);
  };

  const handleDateChange = (newDate) => {
    setTransaction(prev => ({
      ...prev,
      date: newDate
    }));
    
    if (validationErrors.date) {
      setValidationErrors({
        ...validationErrors,
        date: null
      });
    }
    
    // Reset template saved state when form changes
    setTemplateSaved(false);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    if (!transaction.description || transaction.description.trim() === '') {
      errors.description = 'Description is required';
      isValid = false;
    }
    
    if (!transaction.amount || isNaN(transaction.amount) || parseFloat(transaction.amount) <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0';
      isValid = false;
    }
    
    if (!transaction.category) {
      errors.category = 'Category is required';
      isValid = false;
    }
    
    if (!transaction.date) {
      errors.date = 'Date is required';
      isValid = false;
    }
    
    if (!transaction.accountId) {
      errors.accountId = 'Account is required';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  // Fix the handleSubmit function to properly format dates
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Ensure date is in ISO format for the API
      const transactionData = {
        description: transaction.description,
        amount: parseFloat(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date.toISOString(), // Convert to ISO string
        accountId: transaction.accountId,
        notes: transaction.notes || ''
      };
      
      console.log("Submitting transaction with date:", transactionData.date);
      
      if (isEdit) {
        await TransactionService.updateTransaction(id, transactionData);
      } else {
        await TransactionService.createTransaction(transactionData);
      }
      
      navigate('/app/transactions');
    } catch (err) {
      setLoading(false);
      setError(`Failed to ${isEdit ? 'update' : 'create'} transaction. Please try again.`);
      console.error(`Error ${isEdit ? 'updating' : 'creating'} transaction:`, err);
    }
  };

  const handleTemplateSelect = (template) => {
    setTransaction({
      description: template.description || '',
      amount: template.amount || '',
      type: template.type || 'EXPENSE',
      category: template.category || '',
      date: new Date(), // Always use current date
      accountId: template.accountId || '',
      notes: template.notes || ''
    });
    
    // Clear any validation errors
    setValidationErrors({});
  };

  const handleSaveAsTemplate = () => {
    // Check if we have required fields for a template
    if (!transaction.description) {
      setValidationErrors(prev => ({
        ...prev,
        description: 'Description is required for saving a template'
      }));
      return;
    }
    
    if (!transaction.amount || isNaN(parseFloat(transaction.amount)) || parseFloat(transaction.amount) <= 0) {
      setValidationErrors(prev => ({
        ...prev,
        amount: 'Please enter a valid amount for saving a template'
      }));
      return;
    }
    
    if (!transaction.category) {
      setValidationErrors(prev => ({
        ...prev,
        category: 'Category is required for saving a template'
      }));
      return;
    }
    
    // If all required fields are filled, open the template dialog
    setSaveTemplateOpen(true);
  };

  const handleSaveTemplateClose = (success) => {
    setSaveTemplateOpen(false);
    if (success) {
      setTemplateSaved(true);
    }
  };

  if (loadingData) {
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
        <MuiLink component={Link} to="/app/transactions" underline="hover" color="inherit">
          Transactions
        </MuiLink>
        <Typography color="text.primary">
          {isEdit ? 'Edit Transaction' : 'Add Transaction'}
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ fontSize: isMobile ? '1.5rem' : '2.125rem' }}>
          {isEdit ? 'Edit Transaction' : 'Add Transaction'}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}>
          <Button
            variant="outlined"
            component={Link}
            to="/app/templates"
            size={isMobile ? "small" : "medium"}
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            Manage Templates
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/app/transactions"
            size={isMobile ? "small" : "medium"}
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            Back to Transactions
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {!isEdit && (
          <>
            <TemplateSelector onTemplateSelect={handleTemplateSelect} />
            <Divider sx={{ my: 2 }} />
          </>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={transaction.description}
                onChange={handleChange}
                required
                error={!!validationErrors.description}
                helperText={validationErrors.description}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={transaction.amount}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                error={!!validationErrors.amount}
                helperText={validationErrors.amount}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="type-label">Transaction Type</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={transaction.type}
                  onChange={handleChange}
                  label="Transaction Type"
                >
                  <MenuItem value="INCOME">Income</MenuItem>
                  <MenuItem value="EXPENSE">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!validationErrors.category}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={transaction.category}
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
                  <FormHelperText>{validationErrors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Date & Time"
                value={transaction.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!validationErrors.date,
                    helperText: validationErrors.date
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <AccountSelector
                value={transaction.accountId}
                onChange={(e) => handleChange({ target: { name: 'accountId', value: e.target.value } })}
                error={!!validationErrors.accountId}
                helperText={validationErrors.accountId}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (Optional)"
                name="notes"
                value={transaction.notes || ''}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                placeholder="Add any additional details about this transaction"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 2,
                flexDirection: isMobile ? 'column' : 'row',
                gap: 1
              }}>
                <Box>
                  <Tooltip title="Save this transaction as a template for future use">
                    <Button
                      type="button"
                      variant="outlined"
                      color={templateSaved ? "success" : "primary"}
                      onClick={handleSaveAsTemplate}
                      startIcon={templateSaved ? <SavedTemplateIcon /> : <TemplateIcon />}
                      sx={{ mr: 1 }}
                    >
                      {templateSaved ? "Template Saved" : "Save as Template"}
                    </Button>
                  </Tooltip>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  flexDirection: isMobile ? 'column' : 'row',
                  width: isMobile ? '100%' : 'auto'
                }}>
                  <Button
                    type="button"
                    variant="outlined"
                    component={Link}
                    to="/app/transactions"
                    sx={{ width: isMobile ? '100%' : 'auto' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{ width: isMobile ? '100%' : 'auto' }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : isEdit ? (
                      'Update Transaction'
                    ) : (
                      'Save Transaction'
                    )}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <SaveTemplateDialog
        open={saveTemplateOpen}
        onClose={handleSaveTemplateClose}
        transaction={transaction}
      />
    </Box>
  );
};

export default TransactionForm;
