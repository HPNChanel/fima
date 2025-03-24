import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
  Button,
  InputAdornment,
  Typography,
  useMediaQuery,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  AccountBalance as BankIcon,
  AccountBalanceWallet as WalletIcon,
  CreditCard as CreditCardIcon,
  Smartphone as EWalletIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom'; // Ensure proper imports
import AccountService from '../services/account.service';

const AccountSelector = ({ value, onChange, error, helperText, fullWidth = true, required = true }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      console.error('Error fetching accounts:', err);
      setLoading(false);
    }
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'CASH':
        return <WalletIcon fontSize={isMobile ? "small" : "medium"} />;
      case 'BANK':
        return <BankIcon fontSize={isMobile ? "small" : "medium"} />;
      case 'CREDIT_CARD':
        return <CreditCardIcon fontSize={isMobile ? "small" : "medium"} />;
      case 'E_WALLET':
        return <EWalletIcon fontSize={isMobile ? "small" : "medium"} />;
      default:
        return <WalletIcon fontSize={isMobile ? "small" : "medium"} />;
    }
  };

  // Format balance with color based on amount
  const formatBalance = (balance) => {
    const color = balance >= 0 ? 'success.main' : 'error.main';
    return (
      <Typography 
        variant={isMobile ? "caption" : "body2"} 
        color={color} 
        component="span"
        sx={{ 
          fontWeight: 'medium',
          whiteSpace: 'nowrap'
        }}
      >
        ${parseFloat(balance).toFixed(2)}
      </Typography>
    );
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (accounts.length === 0) {
    return (
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        alignItems={isMobile ? "stretch" : "center"}
        sx={{ my: 1 }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: isMobile ? 1 : 0 }}
        >
          No accounts available.
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          component={Link}
          to="/app/accounts/add"
          fullWidth={isMobile}
        >
          Add Account
        </Button>
        <Button
          component={Link}
          to="/app/accounts"
        >
        </Button>
      </Stack>
    );
  }

  // Fix: Use a simple name value handler to ensure proper event propagation
  const handleAccountChange = (event) => {
    if (onChange) {
      onChange({
        target: {
          name: 'accountId',
          value: event.target.value
        }
      });
    }
  };

  return (
    <FormControl 
      fullWidth={fullWidth} 
      required={required} 
      error={!!error}
      size={isMobile ? "small" : "medium"}
    >
      <InputLabel id="account-select-label">Account</InputLabel>
      <Select
        labelId="account-select-label"
        id="account-select"
        value={value || ''}
        onChange={handleAccountChange}
        label="Account"
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              width: 'auto'
            }
          }
        }}
        renderValue={(selected) => {
          const account = accounts.find(a => a.id === selected);
          if (!account) return '';
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1 }}>{getAccountIcon(account.type)}</Box>
              <Typography
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {account.name}
              </Typography>
            </Box>
          );
        }}
      >
        {accounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              width: '100%',
              flexWrap: isMobile ? 'wrap' : 'nowrap'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                minWidth: 0, // Needed for text truncation
                flex: 1
              }}>
                <Box sx={{ mr: 1, color: 'primary.main' }}>{getAccountIcon(account.type)}</Box>
                <Typography sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {account.name}
                </Typography>
              </Box>
              {formatBalance(account.balance)}
            </Box>
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default AccountSelector;
