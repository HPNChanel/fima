import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon,
  AccountBalance as AccountIcon,
  Info as InfoIcon,
  MonetizationOn as MoneyIcon,
  ArrowUpward as ArrowUpIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import SavingsService from '../services/SavingsService';

const SavingsList = ({ savings, onUpdate }) => {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedSavings, setSelectedSavings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  const handleWithdrawClick = (savingsAccount) => {
    setSelectedSavings(savingsAccount);
    setWithdrawDialogOpen(true);
  };
  
  const handleWithdrawConfirm = async () => {
    setLoading(true);
    try {
      await SavingsService.withdrawSavings(selectedSavings.id);
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
        return 'Flexible';
      case 'THREE_MONTH':
        return '3 Month';
      case 'SIX_MONTH':
        return '6 Month';
      case 'TWELVE_MONTH':
        return '12 Month';
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
  
  if (!savings || savings.length === 0) {
    return (
      <Card sx={{ mt: 2, p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          You don't have any savings accounts yet.
        </Typography>
        <Button 
          component={Link} 
          to="/app/savings/new" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Create a Savings Account
        </Button>
      </Card>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {savings.map((savingsAccount) => (
          <Grid item xs={12} md={6} lg={4} key={savingsAccount.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: (theme) => theme.palette.mode === 'dark' 
                    ? theme.palette.grey[800] 
                    : theme.palette.primary.light,
                  color: (theme) => theme.palette.mode === 'dark' 
                    ? theme.palette.common.white 
                    : theme.palette.primary.contrastText
                }}
              >
                <Typography variant="h6" component="div">
                  {savingsAccount.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <AccountIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {getTermText(savingsAccount.termType)} • {savingsAccount.interestRate}%
                  </Typography>
                </Box>
              </Box>
              
              {savingsAccount.tag && (
                <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Chip 
                    label={savingsAccount.tag} 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.08)'
                    }} 
                  />
                </Box>
              )}
              
              <LinearProgress 
                variant="determinate" 
                value={calculateProgress(savingsAccount.startDate, savingsAccount.maturityDate)}
                sx={{ height: 6 }}
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Principal:
                    </Typography>
                    <Typography variant="body1">
                      ${savingsAccount.initialDeposit}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Current Value:
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: savingsAccount.totalInterest > 0 ? 'success.main' : 'inherit'
                    }}>
                      ${savingsAccount.currentValue}
                      {savingsAccount.totalInterest > 0 && (
                        <Tooltip title={`Earned interest: $${savingsAccount.totalInterest}`}>
                          <ArrowUpIcon fontSize="small" color="success" sx={{ ml: 0.5 }} />
                        </Tooltip>
                      )}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Daily Earnings:
                    </Typography>
                    <Typography variant="body1">
                      ${savingsAccount.dailyInterest}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip 
                      label={savingsAccount.status} 
                      size="small" 
                      color={getStatusColor(savingsAccount.status)}
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {savingsAccount.status === 'ACTIVE' ? (
                        `${savingsAccount.daysRemaining} days left`
                      ) : savingsAccount.status === 'WITHDRAWN' ? (
                        `Withdrawn on ${format(new Date(savingsAccount.withdrawalDate), 'MMM d, yyyy')}`
                      ) : (
                        `Matured on ${format(new Date(savingsAccount.maturityDate), 'MMM d, yyyy')}`
                      )}
                    </Typography>
                  </Box>
                  
                  <Tooltip title="View details and projections">
                    <IconButton 
                      component={Link} 
                      to={`/app/savings/${savingsAccount.id}`}
                      size="small"
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                {savingsAccount.status === 'ACTIVE' && (
                  <Button 
                    variant="outlined" 
                    color="primary"
                    fullWidth
                    startIcon={<MoneyIcon />}
                    onClick={() => handleWithdrawClick(savingsAccount)}
                  >
                    Withdraw
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onClose={() => setWithdrawDialogOpen(false)}>
        <DialogTitle>Withdraw Savings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw this savings account?
            {selectedSavings && (
              <>
                <br /><br />
                <b>Account:</b> {selectedSavings.name}<br />
                <b>Current Value:</b> ${selectedSavings.currentValue}<br />
                <b>Earned Interest:</b> ${selectedSavings.totalInterest}<br />
                <br />
                {new Date(selectedSavings.maturityDate) > new Date() && (
                  <Box sx={{ color: 'warning.main' }}>
                    <b>Warning:</b> This account has not yet reached maturity.
                  </Box>
                )}
              </>
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

export default SavingsList;
