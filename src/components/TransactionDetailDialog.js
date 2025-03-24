import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  useMediaQuery,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Edit as EditIcon,
  Close as CloseIcon,
  DeleteOutline as DeleteIcon,
  Add as AddIcon,
  Event as EventIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import TransactionService from '../services/transaction.service';

const TransactionDetailDialog = ({ open, onClose, transaction, onDuplicate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  if (!transaction) {
    return null;
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return format(date, 'MMMM dd, yyyy');
  };
  
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return format(date, 'h:mm a');
  };
  
  const formatCategory = (category) => {
    return category.charAt(0) + category.slice(1).toLowerCase();
  };
  
  const getTypeColor = (type) => {
    return type === 'INCOME' ? 'success' : 'error';
  };
  
  const handleAddSimilarTransaction = () => {
    // Create a similar transaction on the same date
    if (transaction) {
      const formattedDate = format(new Date(transaction.date), 'yyyy-MM-dd');
      window.location.href = `/app/transactions/add?date=${formattedDate}`; // Use /app prefix
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await TransactionService.deleteTransaction(transaction.id);
      setDeleteDialogOpen(false);
      onClose(); // Close the details dialog
      navigate('/app/transactions'); // Navigate back to transaction list with /app prefix
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Transaction Details
          </Typography>
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
              {transaction.description}
            </Typography>
            <Typography 
              variant="h4"
              color={transaction.type === 'INCOME' ? 'success.main' : 'error.main'}
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </Typography>
            
            <Chip 
              label={transaction.type} 
              color={getTypeColor(transaction.type)}
              sx={{ mr: 1 }}
            />
            <Chip 
              label={formatCategory(transaction.category)} 
              variant="outlined"
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Date
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1">
                {formatDate(transaction.date)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(transaction.date)}
              </Typography>
            </Grid>
            
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Account
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1">
                {transaction.accountName || 'Unknown Account'}
              </Typography>
            </Grid>
            
            {transaction.notes && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {transaction.notes}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, pt: 1.5 }}>
          <Button 
            startIcon={<DeleteIcon />} 
            color="error"
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
          <Button 
            startIcon={<ContentCopyIcon />}
            onClick={() => {
              onDuplicate(transaction);
              onClose();
            }}
          >
            Add Similar
          </Button>
          <Button 
            startIcon={<EditIcon />} 
            variant="contained"
            component={Link}
            to={`/app/transactions/edit/${transaction.id}`} // Fix URL path with /app prefix
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionDetailDialog;
