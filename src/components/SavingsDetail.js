import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { 
  AccountBalance as AccountIcon,
  CalendarToday as CalendarIcon,
  ArrowUpward as ArrowUpIcon,
  MonetizationOn as MoneyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import SavingsService from '../services/SavingsService';

const SavingsDetail = ({ savings, onUpdate }) => {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  if (!savings) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        No savings account data available.
      </Paper>
    );
  }
  
  const handleWithdrawClick = () => {
    setWithdrawDialogOpen(true);
  };
  
  const handleWithdrawConfirm = async () => {
    setLoading(true);
    try {
      await SavingsService.withdrawSavings(savings.id);
      setNotification({
        open: true,
        message: 'Savings withdrawn successfully!',
        type: 'success'
      });
      setWithdrawDialogOpen(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error withdrawing savings:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to withdraw savings',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Helper to get term in a readable format
  const getTermText = (termType) => {
    switch (termType) {
      case 'DAILY_FLEXIBLE':
        return 'Flexible (Daily Interest)';
      case 'THREE_MONTH':
        return '3 Month Fixed Term';
      case 'SIX_MONTH':
        return '6 Month Fixed Term';
      case 'TWELVE_MONTH':
        return '12 Month Fixed Term';
      default:
        return termType;
    }
  };
  
  // Helper to get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'MATURED':
        return 'primary';
      case 'WITHDRAWN':
        return 'default';
      default:
        return 'default';
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (startDate, maturityDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(maturityDate).getTime();
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };
  
  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              {savings.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccountIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {getTermText(savings.termType)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Chip 
              label={savings.status} 
              color={getStatusColor(savings.status)} 
              size="small"
              sx={{ mb: 1 }}
            />
            {savings.tag && (
              <Chip 
                label={savings.tag} 
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Principal Amount
                </Typography>
                <Typography variant="h5">
                  ${savings.initialDeposit}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  From: {savings.sourceAccountName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Current Value
                </Typography>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                  ${savings.currentValue}
                  {savings.totalInterest > 0 && (
                    <ArrowUpIcon fontSize="small" color="success" sx={{ ml: 0.5 }} />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Interest Earned: ${savings.totalInterest}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Interest Rate
                </Typography>
                <Typography variant="h5">
                  {savings.interestRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Daily Earnings: ${savings.dailyInterest}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <CalendarIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Started: {format(new Date(savings.startDate), 'MMMM d, yyyy')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Matures: {format(new Date(savings.maturityDate), 'MMMM d, yyyy')}
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress(savings.startDate, savings.maturityDate)}
            sx={{ height: 8, borderRadius: 1 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {savings.status === 'WITHDRAWN' ? (
                `Withdrawn on ${format(new Date(savings.withdrawalDate), 'MMMM d, yyyy')}`
              ) : (
                savings.daysRemaining > 0 ? 
                `${savings.daysRemaining} days remaining` : 
                'Matured'
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {savings.status === 'ACTIVE' ? 
                `${calculateProgress(savings.startDate, savings.maturityDate)}% complete` :
                (savings.status === 'MATURED' ? 'Term completed' : 'Withdrawn')}
            </Typography>
          </Box>
        </Box>
        
        {savings.status === 'ACTIVE' && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined"
              color="primary"
              startIcon={<MoneyIcon />}
              onClick={handleWithdrawClick}
            >
              Withdraw Savings
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onClose={() => setWithdrawDialogOpen(false)}>
        <DialogTitle>Withdraw Savings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw this savings account?
            <br /><br />
            <b>Account:</b> {savings.name}<br />
            <b>Current Value:</b> ${savings.currentValue}<br />
            <b>Earned Interest:</b> ${savings.totalInterest}<br />
            <br />
            {new Date(savings.maturityDate) > new Date() && (
              <Box sx={{ color: 'warning.main' }}>
                <b>Warning:</b> This account has not yet reached maturity.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleWithdrawConfirm} color="primary" disabled={loading}>
            {loading ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SavingsDetail;
