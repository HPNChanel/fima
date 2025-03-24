import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import AccountService from '../services/account.service';

const AccountTransferHistory = ({ accountId }) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransfers();
  }, [accountId]);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const response = await AccountService.getAccountTransferHistory(accountId);
      
      // Add additional validation to make sure we received valid data
      if (response.data && Array.isArray(response.data)) {
        // Filter out any potentially invalid transfers
        const validTransfers = response.data.filter(
          transfer => transfer && transfer.sourceAccount && transfer.destinationAccount
        );
        setTransfers(validTransfers);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Received invalid transfer data format from server');
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load transfer history. Please try again later.');
      console.error('Error fetching transfer history:', err);
      
      // Log more detailed error info
      if (err.response) {
        console.error('Server error details:', err.response.data);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading transfers...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (transfers.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
        No transfer history found for this account.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>From/To</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transfers.map((transfer) => {
            // Add null check for both accounts
            const sourceAccount = transfer.sourceAccount || {};
            const destinationAccount = transfer.destinationAccount || {};
            
            // Skip rendering this item if we don't have the required data
            if (!sourceAccount.id || !destinationAccount.id) {
              console.warn('Invalid transfer data:', transfer);
              return null;
            }
            
            const isOutgoing = sourceAccount.id.toString() === accountId.toString();
            const otherAccount = isOutgoing ? destinationAccount : sourceAccount;
            
            return (
              <TableRow key={transfer.id} hover>
                <TableCell>{formatDate(transfer.date)}</TableCell>
                <TableCell>{transfer.description || 'Transfer'}</TableCell>
                <TableCell>
                  {isOutgoing ? `To: ${otherAccount.name}` : `From: ${otherAccount.name}`}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: isOutgoing ? 'error.main' : 'success.main',
                    fontWeight: 'medium'
                  }}
                >
                  {isOutgoing ? '-' : '+'} {formatCurrency(transfer.amount)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccountTransferHistory;
