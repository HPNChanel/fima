import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container,
  Card, 
  Typography, 
  Button, 
  Tabs, 
  Tab,
  Grid, 
  Box, 
  Paper, 
  CircularProgress,
  LinearProgress, 
  Alert, 
  Divider, 
  Breadcrumbs,
  Stack, 
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  AccountBalance as BankIcon, 
  SwapHoriz as SwapIcon, 
  Edit as EditIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import AccountService from '../services/account.service';
import TransactionService from '../services/transaction.service';
import SpendingGoalService from '../services/spending-goal.service';
import AccountTransferHistory from '../components/AccountTransferHistory';

const AccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [spendingGoals, setSpendingGoals] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch account details
        const response = await AccountService.getAccount(id);
        setAccount(response.data);
        
        // Fetch account transactions
        const transactionsResponse = await AccountService.getAccountTransactions(id);
        const allTransactions = transactionsResponse.data;
        setTransactions(allTransactions);
        
        // Get the 5 most recent transactions
        const sortedTransactions = [...allTransactions].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRecentTransactions(sortedTransactions.slice(0, 5));
        
        // Fetch spending goals
        await fetchSpendingGoals();
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Failed to load account details. Please try again later.');
        console.error('Failed to load account details:', error);
      }
    };

    fetchAccountDetails();
  }, [id]);
  
  const fetchSpendingGoals = async () => {
    try {
      const response = await SpendingGoalService.getSpendingGoals();
      setSpendingGoals(response.data);
    } catch (err) {
      console.error('Error fetching spending goals:', err);
    }
  };
  
  // Find spending goal for a category
  const getSpendingGoalByCategory = (category) => {
    return spendingGoals.find(goal => 
      goal.category === category && goal.period === 'MONTHLY'
    );
  };
  
  // Format percentage
  const formatPercentage = (percentage) => {
    return `${Math.round(percentage)}%`;
  };
  
  // Determine color based on percentage
  const getColorByPercentage = (percentage) => {
    if (percentage >= 100) return theme.palette.error.main;
    if (percentage >= 80) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2 
    }).format(amount);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // Calculate category summaries from transactions
  const categorySummary = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }
    
    // Get only expense transactions
    const expenses = transactions.filter(t => t.type === 'EXPENSE');
    
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    // Group by category and sum amounts
    const summaries = {};
    expenses.forEach(transaction => {
      const category = transaction.category;
      const amount = parseFloat(transaction.amount);
      
      if (!summaries[category]) {
        summaries[category] = { amount: 0 };
      }
      
      summaries[category].amount += amount;
    });
    
    // After computing category summaries, add spending goal info
    return Object.keys(summaries).map(category => {
      const summary = summaries[category];
      const goal = getSpendingGoalByCategory(category);
      
      return {
        ...summary,
        category,
        hasGoal: !!goal,
        goalLimit: goal?.amountLimit || 0,
        goalPercentage: goal ? 
          Math.min(100, (summary.amount / goal.amountLimit) * 100) : 0,
        totalExpenses
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [transactions, spendingGoals]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading account details...
        </Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/app/accounts"
        >
          Back to Accounts
        </Button>
      </Box>
    );
  }

  if (!account) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Account not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/app/accounts"
          sx={{ mt: 2 }}
        >
          Back to Accounts
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Breadcrumbs sx={{ mb: 2, mt: 2 }}>
        <Typography 
          component={Link} 
          to="/app" 
          color="inherit" 
          sx={{ textDecoration: 'none' }}
        >
          Dashboard
        </Typography>
        <Typography 
          component={Link} 
          to="/app/accounts" 
          color="inherit" 
          sx={{ textDecoration: 'none' }}
        >
          Accounts
        </Typography>
        <Typography color="text.primary">{account.name}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.lighter',
                    color: 'primary.main'
                  }}
                >
                  <BankIcon sx={{ fontSize: 40 }} />
                </Box>
              </Grid>
              
              <Grid item xs>
                <Typography variant="h4" component="h1">
                  {account.name}
                </Typography>
                <Chip 
                  label={account.type.replace('_', ' ')} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              
              <Grid item>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: parseFloat(account.balance) >= 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {formatCurrency(account.balance)}
                </Typography>
              </Grid>
              
              <Grid item>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="contained" 
                    startIcon={<SwapIcon />} 
                    onClick={() => navigate(`/app/transfers?sourceAccount=${account.id}`)}
                  >
                    Transfer
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    onClick={() => navigate(`/app/accounts/edit/${account.id}`)}
                  >
                    Edit
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            
            {account.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  {account.description}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Recent Transactions" />
              <Tab label="Transfer History" />
              <Tab label="Category Spending" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Recent Transactions</Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<PaymentIcon />}
                      component={Link}
                      to={`/app/transactions/add?accountId=${account.id}`}
                    >
                      New Transaction
                    </Button>
                  </Box>
                  
                  {recentTransactions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ my: 3, textAlign: 'center' }}>
                      No transactions found for this account.
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Type</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recentTransactions.map((transaction) => (
                            <TableRow key={transaction.id} hover>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={transaction.category} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>{formatDate(transaction.date)}</TableCell>
                              <TableCell 
                                align="right"
                                sx={{ 
                                  color: transaction.type === 'INCOME' ? 'success.main' : 'error.main',
                                  fontWeight: 'medium'
                                }}
                              >
                                {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={transaction.type} 
                                  size="small" 
                                  color={transaction.type === 'INCOME' ? 'success' : 'error'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  
                  <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button 
                      component={Link} 
                      to="/app/transactions" 
                      color="primary"
                    >
                      View All Transactions
                    </Button>
                  </Box>
                </>
              )}
              
              {tabValue === 1 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Transfer History
                  </Typography>
                  <AccountTransferHistory accountId={id} />
                </>
              )}
              
              {tabValue === 2 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Expense Categories
                  </Typography>
                  
                  {categorySummary.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ my: 3, textAlign: 'center' }}>
                      No expense transactions found for this account.
                    </Typography>
                  ) : (
                    <Box sx={{ mt: 2 }}>
                      {categorySummary.map((item, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {item.category}
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formatCurrency(item.amount)}
                              {item.hasGoal && (
                                <Typography 
                                  component="span" 
                                  variant="caption" 
                                  sx={{ ml: 1 }}
                                  color={getColorByPercentage(item.goalPercentage)}
                                >
                                  ({formatPercentage(item.goalPercentage)})
                                </Typography>
                              )}
                            </Typography>
                          </Box>
                          
                          {item.hasGoal && (
                            <LinearProgress 
                              variant="determinate" 
                              value={item.goalPercentage} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 5,
                                mb: 1,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getColorByPercentage(item.goalPercentage)
                                }
                              }} 
                            />
                          )}
                          
                          <Typography variant="caption" color="text.secondary">
                            {((item.amount / item.totalExpenses) * 100).toFixed(1)}% of total expenses
                            {item.hasGoal && ` • Goal: ${formatCurrency(item.goalLimit)}`}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Account Information</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Account Number</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {account.accountNumber || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Type</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {account.type.replace('_', ' ')}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Income
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(
                      transactions
                        .filter(t => t.type === 'INCOME')
                        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                    )}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="error.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Expenses
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {formatCurrency(
                      transactions
                        .filter(t => t.type === 'EXPENSE')
                        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <Button 
                variant="outlined"
                fullWidth
                startIcon={<PaymentIcon />}
                component={Link}
                to={`/app/transactions/add?accountId=${account.id}`}
              >
                Add Transaction
              </Button>
              
              <Button 
                variant="outlined"
                fullWidth
                startIcon={<SwapIcon />}
                component={Link}
                to={`/app/transfers?sourceAccount=${account.id}`}
              >
                Transfer Money
              </Button>
              
              <Button 
                variant="outlined"
                fullWidth
                startIcon={<EditIcon />}
                component={Link}
                to={`/app/accounts/edit/${account.id}`}
              >
                Edit Account
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountDetail;
