import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Divider,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Delete as DeleteIcon,
  Create as CreateTransactionIcon,
  Description as DescriptionIcon,
  AccountBalance as AccountIcon,
  Category as CategoryIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import TransactionTemplateService from '../services/transaction-template.service';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await TransactionTemplateService.getTemplates();
      setTemplates(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch templates. Please try again later.');
      console.error('Error fetching templates:', err);
    }
  };
  
  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, id: null });
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await TransactionTemplateService.deleteTemplate(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      fetchTemplates();
    } catch (err) {
      setLoading(false);
      setError('Failed to delete template. Please try again.');
      console.error('Error deleting template:', err);
      setDeleteDialog({ open: false, id: null });
    }
  };
  
  const handleCreateTransaction = (template) => {
    navigate('/app/transactions/add', { 
      state: { template } 
    });
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2 
    }).format(amount);
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        mb: 3,
        mt: 2
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ fontSize: isMobile ? '1.75rem' : '2.125rem' }}
        >
          Transaction Templates
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: isMobile ? 2 : 0,
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            component={Link}
            to="/app/transactions/add"
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            Back to Add Transaction
          </Button>
        </Box>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your saved transaction templates for quicker data entry
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading && templates.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : templates.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Templates Found
          </Typography>
          <Typography variant="body1" paragraph>
            You haven't saved any transaction templates yet.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/transactions/add"
            startIcon={<CreateTransactionIcon />}
          >
            Add Transaction
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Tooltip title="Delete template">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteClick(template.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <DescriptionIcon color="primary" fontSize="small" />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {template.description || 'No description'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <CategoryIcon color="primary" fontSize="small" />
                      <Typography variant="body2">
                        {template.category || '-'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <AccountIcon color="primary" fontSize="small" />
                      <Typography variant="body2">
                        {template.accountName || 'Any account'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      color={template.type === 'INCOME' ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(template.amount)}
                    </Typography>
                    <Chip 
                      label={template.type || 'EXPENSE'} 
                      size="small" 
                      color={template.type === 'INCOME' ? 'success' : 'error'} 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  
                  {template.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Notes: {template.notes}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleCreateTransaction(template)}
                    startIcon={<CreateTransactionIcon />}
                  >
                    Create Transaction
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this template? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TemplateList;
