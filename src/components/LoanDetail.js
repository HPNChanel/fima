import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  Button,
  LinearProgress,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import LoanService from '../services/LoanService';

const statusColors = {
  ACTIVE: 'primary',
  COMPLETED: 'success',
  DEFAULTED: 'error'
};

const paymentStatusColors = {
  PENDING: 'info',
  PAID: 'success',
  OVERDUE: 'error'
};

const LoanDetail = ({ loan, onUpdate }) => {
  const [confirmPaymentOpen, setConfirmPaymentOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [loading, setLoading] = useState(false);
  
  if (!loan) return null;
  
  const handlePaymentClick = (installment) => {
    setSelectedInstallment(installment);
    setConfirmPaymentOpen(true);
  };
  
  const handlePaymentConfirm = async () => {
    if (!selectedInstallment) return;
    
    setLoading(true);
    try {
      await LoanService.makePayment(loan.id, selectedInstallment.installmentNumber, onUpdate);
      setConfirmPaymentOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error making payment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              {loan.name}
            </Typography>
            <Chip 
              label={loan.status} 
              color={statusColors[loan.status] || 'default'} 
              size="small" 
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created on {format(new Date(loan.createdAt), 'MMM d, yyyy')}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} container direction="column" alignItems="flex-end">
            <Typography variant="subtitle1">
              Principal Amount: ${loan.amount.toFixed(2)}
            </Typography>
            <Typography variant="subtitle1">
              Interest Rate: {loan.interestRate}%
            </Typography>
            <Typography variant="subtitle1">
              Duration: {loan.durationMonths} months
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Loan Progress
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={loan.completionPercentage} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2">
                {Math.round(loan.completionPercentage)}%
              </Typography>
            </Box>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                <Typography variant="subtitle1">${loan.totalAmount?.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Total Interest</Typography>
                <Typography variant="subtitle1">${loan.totalInterest?.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Paid Amount</Typography>
                <Typography variant="subtitle1">${loan.paidAmount?.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Remaining Balance</Typography>
                <Typography variant="subtitle1">${loan.remainingBalance?.toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Schedule
        </Typography>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Principal</TableCell>
                <TableCell align="right">Interest</TableCell>
                <TableCell align="right">Remaining Balance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loan.payments?.map((payment) => (
                <TableRow key={payment.installmentNumber}>
                  <TableCell>{payment.installmentNumber}</TableCell>
                  <TableCell>{format(new Date(payment.dueDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell align="right">${payment.amount.toFixed(2)}</TableCell>
                  <TableCell align="right">${payment.principal.toFixed(2)}</TableCell>
                  <TableCell align="right">${payment.interest.toFixed(2)}</TableCell>
                  <TableCell align="right">${payment.remainingBalance.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.status} 
                      color={paymentStatusColors[payment.status] || 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {payment.status === 'PENDING' && (
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handlePaymentClick(payment)}
                      >
                        Pay Now
                      </Button>
                    )}
                    {payment.status === 'PAID' && payment.paymentDate && (
                      <Typography variant="caption" color="text.secondary">
                        Paid on {format(new Date(payment.paymentDate), 'MMM d, yyyy')}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Dialog
        open={confirmPaymentOpen}
        onClose={() => setConfirmPaymentOpen(false)}
      >
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to make payment for installment #{selectedInstallment?.installmentNumber}?
            {selectedInstallment && (
              <>
                <br /><br />
                Amount: ${selectedInstallment.amount.toFixed(2)}
                <br />
                Due Date: {format(new Date(selectedInstallment.dueDate), 'MMM d, yyyy')}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmPaymentOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handlePaymentConfirm} color="primary" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanDetail;
