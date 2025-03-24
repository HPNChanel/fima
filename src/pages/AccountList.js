import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  AccountBalance as BankIcon,
  AccountBalanceWallet as WalletIcon,
  AccountBalanceWallet,
  CreditCard as CreditCardIcon,
  Smartphone as EWalletIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import AccountService from '../services/account.service';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
    duration: 6000,
    action: null
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);
  
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await AccountService.getAccounts();
      setAccounts(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load accounts. Please try again later.');
      console.error('Error fetching accounts:', err);
    }
  };
  
  const handleDeleteClick = (id) => {
    // Find the account to delete for reference later
    const account = accounts.find(acc => acc.id === id);
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
  };
  
  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    
    try {
      await AccountService.deleteAccount(accountToDelete.id);
      setAccounts(accounts.filter(account => account.id !== accountToDelete.id));
      setSnackbar({
        open: true,
        message: 'Account deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      
      // Handle the specific case of transactions preventing deletion
      if (error.response && error.response.status === 400 && 
          error.response.data && error.response.data.message &&
          error.response.data.message.includes('transactions')) {
        // Show a more helpful message with action options
        setSnackbar({
          open: true,
          message: 'This account has transactions and cannot be deleted. Please delete or transfer the transactions first.',
          severity: 'warning',
          duration: 8000,
          action: (
            <React.Fragment>
              <Button 
                color="primary" 
                size="small"
                onClick={() => {
                  navigate(`/app/accounts/${accountToDelete.id}`);
                }}
              >
                View Transactions
              </Button>
            </React.Fragment>
          )
        });
      } else {
        // Generic error message for other errors
        setSnackbar({
          open: true,
          message: `Error deleting account: ${error.response?.data?.message || error.message}`,
          severity: 'error'
        });
      }
    } finally {
      setAccountToDelete(null);
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({...snackbar, open: false});
  };

  const handleEditClick = (id) => {
    navigate(`/app/accounts/edit/${id}`);
  };

  const getAccountTypeName = (type) => {
    switch (type) {
      case 'CASH':
        return 'Cash';
      case 'BANK':
        return 'Bank Account';
      case 'CREDIT_CARD':
        return 'Credit Card';
      case 'E_WALLET':
        return 'E-Wallet';
      default:
        return type;
    }
  };
  
  const getAccountIcon = (type) => {
    switch (type) {
      case 'CASH':
        return <WalletIcon />;
      case 'BANK':
        return <BankIcon />;
      case 'CREDIT_CARD':
        return <CreditCardIcon />;
      case 'E_WALLET':
        return <EWalletIcon />;
      default:
        return <AccountBalanceWallet />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading && accounts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading accounts...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          mb: 4,
          mt: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ fontSize: isMobile ? '1.75rem' : '2.125rem', mb: isMobile ? 2 : 0 }}
        >
          Financial Accounts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/app/accounts/add"
          size={isMobile ? 'medium' : 'large'}
        >
          Add Account
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your financial accounts such as cash, bank accounts, credit cards, and e-wallets.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {accounts.length === 0 && !loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 6
          }}
        >
          <Typography variant="h6" gutterBottom>
            No accounts found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create an account to start tracking your finances
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/app/accounts/add"
            sx={{ mt: 2 }}
          >
            Add Your First Account
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {accounts.map((account) => (
            <Grid item xs={12} sm={6} md={4} key={account.id}>
              <Card 
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Box 
                      sx={{
                        p: 1.5, 
                        borderRadius: 2, 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                        mr: 2
                      }}
                    >
                      {getAccountIcon(account.type)}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom noWrap>
                        {account.name}
                      </Typography>
                      <Chip 
                        label={getAccountTypeName(account.type)} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: account.balance >= 0 ? 'success.main' : 'error.main'
                    }}
                  >
                    {formatCurrency(account.balance)}
                  </Typography>
                  {account.accountNumber && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Account: {account.accountNumber}
                    </Typography>
                  )}
                  {account.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mt: 1, 
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {account.description}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}> 
                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<ViewIcon />}
                      component={Link}
                      to={`/app/accounts/${account.id}`}
                    >
                      Details
                    </Button>
                    <Box>
                      <Tooltip title="Edit account">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditClick(account.id)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete account">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(account.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Account Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this account? This action cannot be undone, and all transactions associated with this account will be affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration || 6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity || 'info'}
          sx={{ width: '100%' }}
          action={snackbar.action}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountList;