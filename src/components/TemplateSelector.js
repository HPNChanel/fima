import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  FormHelperText,
  Button
} from '@mui/material';
import TransactionTemplateService from '../services/transaction-template.service';

const TemplateSelector = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await TransactionTemplateService.getTemplates();
      setTemplates(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load templates');
      console.error('Error fetching templates:', err);
    }
  };

  const handleTemplateChange = (event) => {
    const templateId = event.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template && onTemplateSelect) {
        onTemplateSelect(template);
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedTemplate('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2">Loading templates...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="template-select-label">Use Template</InputLabel>
          <Select
            labelId="template-select-label"
            id="template-select"
            value={selectedTemplate}
            label="Use Template"
            onChange={handleTemplateChange}
          >
            <MenuItem value="">
              <em>Select a template</em>
            </MenuItem>
            {templates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {templates.length === 0 ? 'No saved templates' : 'Select a template to autofill fields'}
          </FormHelperText>
        </FormControl>
        
        {selectedTemplate && (
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleClearSelection}
            sx={{ mb: 2 }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TemplateSelector;
