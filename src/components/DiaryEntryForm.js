import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid,
  InputAdornment,
  FormHelperText,
  Alert,
  CircularProgress,
  Autocomplete,
  Chip,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import DiaryService from '../services/diary.service';

const DiaryEntryForm = ({ entry, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: entry?.title || '',
    content: entry?.content || '',
    entryDate: entry?.entryDate ? new Date(entry.entryDate) : new Date(),
    relatedAmount: entry?.relatedAmount || '',
    financialGoal: entry?.financialGoal || '',
    lessonsLearned: entry?.lessonsLearned || '',
    tags: entry?.tags || []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Common financial goals suggestions
  const goalSuggestions = [
    'Emergency Fund',
    'Debt Repayment',
    'Retirement',
    'Home Purchase',
    'Education',
    'Vacation',
    'Car Purchase',
    'Business Investment',
    'Stock Market Investment',
    'Passive Income',
    'Reduce Expenses'
  ];
  
  // Common tags suggestions
  const tagSuggestions = [
    'Budgeting',
    'Saving',
    'Investing',
    'Spending',
    'Income',
    'Debt',
    'Success',
    'Challenge',
    'Goal',
    'Learning',
    'Progress',
    'Reflection'
  ];
  
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
  };
  
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      entryDate: date
    });
    
    if (errors.entryDate) {
      setErrors({
        ...errors,
        entryDate: null
      });
    }
  };
  
  const handleTagsChange = (event, newTags) => {
    setFormData({
      ...formData,
      tags: newTags
    });
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.entryDate) {
      newErrors.entryDate = 'Date is required';
    }
    
    // Additional validation for related amount if provided
    if (formData.relatedAmount && isNaN(Number(formData.relatedAmount))) {
      newErrors.relatedAmount = 'Amount must be a number';
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
    setError(null);
    
    try {
      const payload = {
        ...formData,
        entryDate: format(formData.entryDate, 'yyyy-MM-dd'),
        tags: formData.tags.join(',')
      };
      
      if (entry?.id) {
        await DiaryService.updateDiaryEntry(entry.id, payload);
      } else {
        await DiaryService.createDiaryEntry(payload);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error saving diary entry:', err);
      setError(err.response?.data?.message || 'Failed to save diary entry');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Entry Date"
              value={formData.entryDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.entryDate}
                  helperText={errors.entryDate}
                  required
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Related Amount (Optional)"
            name="relatedAmount"
            type="number"
            value={formData.relatedAmount}
            onChange={handleChange}
            error={!!errors.relatedAmount}
            helperText={errors.relatedAmount || "The financial amount this entry relates to"}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={goalSuggestions}
            value={formData.financialGoal}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                financialGoal: newValue
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Financial Goal (Optional)"
                name="financialGoal"
                onChange={handleChange}
                helperText="The financial goal this entry relates to"
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content}
            required
            multiline
            rows={6}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Lessons Learned (Optional)"
            name="lessonsLearned"
            value={formData.lessonsLearned}
            onChange={handleChange}
            multiline
            rows={3}
            helperText="What financial lessons did you learn?"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Autocomplete
            multiple
            freeSolo
            options={tagSuggestions}
            value={formData.tags}
            onChange={handleTagsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                helperText="Add tags to categorize your entry (press Enter after each tag)"
              />
            )}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button
          onClick={onCancel}
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
          {loading ? <CircularProgress size={24} /> : (entry?.id ? 'Update' : 'Save')}
        </Button>
      </Box>
    </Box>
  );
};

export default DiaryEntryForm;
