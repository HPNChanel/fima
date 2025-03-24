import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import TransactionTemplateService from '../services/transaction-template.service';

const SaveTemplateDialog = ({ open, onClose, transaction }) => {
  const [templateName, setTemplateName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTemplateName('');
      setError('');
      setNameError('');
    }
  }, [open]);

  const handleSave = async () => {
    // Validate template name
    if (!templateName.trim()) {
      setNameError('Template name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Make sure to convert amount to number if it's a string
      const amount = typeof transaction.amount === 'string' 
        ? parseFloat(transaction.amount) 
        : transaction.amount;
      
      const templateData = {
        name: templateName.trim(),
        description: transaction.description,
        amount: amount,
        type: transaction.type,
        category: transaction.category,
        accountId: transaction.accountId,
        notes: transaction.notes
      };
      
      console.log('Saving template with data:', templateData);
      await TransactionTemplateService.createTemplate(templateData);
      setLoading(false);
      onClose(true); // Pass true to indicate success
    } catch (err) {
      setLoading(false);
      setError(`Failed to save template: ${err.response?.data?.message || err.message}`);
      console.error('Error saving template:', err);
    }
  };

  const handleNameChange = (e) => {
    setTemplateName(e.target.value);
    setNameError('');
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Save as Template</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            fullWidth
            value={templateName}
            onChange={handleNameChange}
            error={!!nameError}
            helperText={nameError || "Enter a name to identify this template"}
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : 'Save Template'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveTemplateDialog;
