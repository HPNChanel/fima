import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import TransactionService from '../services/transaction.service';

const TransactionHistoryDialog = ({ open, onClose, transactionId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (open && transactionId) {
      fetchTransactionHistory();
    }
  }, [open, transactionId]);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      // For deleted transactions, the ID might not work anymore
      // Consider adding a "fetchDeletedTransactionHistory" endpoint
      // But for now, let's handle potential errors gracefully
      const response = await TransactionService.getTransactionHistory(transactionId);
      setHistory(response.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
      setError('Could not load transaction history. The transaction may have been deleted.');
    } finally {
      setLoading(false);
    }
  };

  // Function to parse JSON values
  const parseJsonValue = (jsonString) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return null;
    }
  };

  // Function to format date
  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Function to highlight changes between old and new value
  const highlightChanges = (oldObj, newObj) => {
    if (!oldObj || !newObj) return [];
    
    const changes = [];
    
    for (const key in oldObj) {
      if (oldObj[key] !== newObj[key]) {
        changes.push({
          field: key,
          oldValue: oldObj[key],
          newValue: newObj[key]
        });
      }
    }
    
    return changes;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        <Typography variant="h6">
          Transaction History
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : history.length === 0 ? (
          <Typography sx={{ py: 2 }}>
            No history records found for this transaction.
          </Typography>
        ) : (
          <Box>
            {history.map((record, index) => {
              const oldValue = parseJsonValue(record.oldValue);
              const newValue = parseJsonValue(record.newValue);
              const changes = record.changeType === 'UPDATE' 
                ? highlightChanges(oldValue, newValue) 
                : [];
              
              return (
                <Box key={record.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Chip 
                        color={record.changeType === 'UPDATE' ? 'primary' : 'error'} 
                        label={record.changeType} 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" component="span">
                        by {record.changedBy} on {formatDateTime(record.changedAt)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {record.changeType === 'UPDATE' ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Field</TableCell>
                            <TableCell>Old Value</TableCell>
                            <TableCell>New Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {changes.map((change, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                <Typography variant="body2">
                                  {change.field}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                    p: 0.5,
                                    borderRadius: 1
                                  }}
                                >
                                  {String(change.oldValue)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                                    p: 0.5,
                                    borderRadius: 1
                                  }}
                                >
                                  {String(change.newValue)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="warning">
                      This transaction was deleted.
                    </Alert>
                  )}
                  
                  {index < history.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionHistoryDialog;
