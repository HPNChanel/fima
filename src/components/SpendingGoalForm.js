import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import SpendingGoalService from '../services/spending-goal.service';

const TRANSACTION_CATEGORIES = [
  'FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'UTILITIES', 'HOUSING', 
  'HEALTHCARE', 'EDUCATION', 'SHOPPING', 'OTHER'
];

const PERIODS = [
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' }
];

const SpendingGoalForm = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: '',
    amountLimit: '',
    period: 'MONTHLY'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.amountLimit || parseFloat(formData.amountLimit) <= 0) {
      newErrors.amountLimit = 'Please enter a valid amount greater than 0';
    }
    
    if (!formData.period) {
      newErrors.period = 'Please select a period';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await SpendingGoalService.createSpendingGoal({
        category: formData.category,
        amountLimit: parseFloat(formData.amountLimit),
        period: formData.period
      });
      
      setLoading(false);
      
      // Reset form
      setFormData({
        category: '',
        amountLimit: '',
        period: 'MONTHLY'
      });
      
      // Notify parent component
      if (onSave) {
        onSave(response.data);
      }
      
      // Close dialog
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to create spending goal. Please try again.');
      console.error('Error creating spending goal:', err);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Spending Goal</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {TRANSACTION_CATEGORIES.map(category => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0) + category.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </Select>
            {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
          </FormControl>
          
          <TextField
            name="amountLimit"
            label="Amount Limit"
            type="number"
            value={formData.amountLimit}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            error={!!errors.amountLimit}
            helperText={errors.amountLimit}
          />
          
          <FormControl fullWidth error={!!errors.period}>
            <InputLabel id="period-label">Period</InputLabel>
            <Select
              labelId="period-label"
              name="period"
              value={formData.period}
              onChange={handleChange}
              label="Period"
            >
              {PERIODS.map(period => (
                <MenuItem key={period.value} value={period.value}>
                  {period.label}
                </MenuItem>
              ))}
            </Select>
            {errors.period && <FormHelperText>{errors.period}</FormHelperText>}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpendingGoalForm;
