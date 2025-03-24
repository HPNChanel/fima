import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  Autocomplete,
  Chip,
  Typography
} from '@mui/material';
import {
  SentimentSatisfied as HappyIcon,
  SentimentDissatisfied as SadIcon,
  SentimentVeryDissatisfied as AngryIcon,
  SentimentNeutral as NeutralIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import JournalService from '../services/journal.service';

const JournalEntryForm = ({ entry, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: entry?.title || '',
    content: entry?.content || '',
    entryDate: entry?.entryDate ? new Date(entry.entryDate) : new Date(),
    mood: entry?.mood || '',
    tags: entry?.tags || []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Common tags suggestions
  const tagSuggestions = [
    'Personal',
    'Work',
    'Finance',
    'Health',
    'Family',
    'Friends',
    'Goals',
    'Learning',
    'Achievement',
    'Challenge',
    'Grateful',
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
        await JournalService.updateJournalEntry(entry.id, payload);
      } else {
        await JournalService.createJournalEntry(payload);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setError(err.response?.data?.message || 'Failed to save journal entry');
    } finally {
      setLoading(false);
    }
  };
  
  const getMoodIcon = (mood) => {
    switch(mood?.toLowerCase()) {
      case 'happy':
        return <HappyIcon color="success" />;
      case 'sad':
        return <SadIcon color="info" />;
      case 'angry':
        return <AngryIcon color="error" />;
      case 'neutral':
        return <NeutralIcon color="action" />;
      default:
        return null;
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
          <FormControl fullWidth>
            <InputLabel id="mood-select-label">Mood</InputLabel>
            <Select
              labelId="mood-select-label"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              label="Mood"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getMoodIcon(selected)}
                  <Typography sx={{ ml: 1 }}>{selected}</Typography>
                </Box>
              )}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Happy">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HappyIcon color="success" sx={{ mr: 1 }} />
                  Happy
                </Box>
              </MenuItem>
              <MenuItem value="Sad">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SadIcon color="info" sx={{ mr: 1 }} />
                  Sad
                </Box>
              </MenuItem>
              <MenuItem value="Angry">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AngryIcon color="error" sx={{ mr: 1 }} />
                  Angry
                </Box>
              </MenuItem>
              <MenuItem value="Neutral">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NeutralIcon color="action" sx={{ mr: 1 }} />
                  Neutral
                </Box>
              </MenuItem>
            </Select>
            <FormHelperText>How are you feeling today?</FormHelperText>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
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
            rows={10}
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

export default JournalEntryForm;
