import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  Snackbar,
  Checkbox,
  Toolbar,
  Fade,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  DeleteSweep as DeleteSweepIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import TransactionService from '../services/transaction.service';
import AccountService from '../services/account.service';
import TransactionTable from '../components/TransactionTable';
import QuickFilters from '../components/QuickFilters';
import TransactionHistoryDialog from '../components/TransactionHistoryDialog';
import { useTranslation } from '../components/TranslationProvider';

const TransactionList = () => {
  // State variables
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Pagination and sorting state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    accountId: '',
    startDate: null,
    endDate: null,
    minAmount: '',
    maxAmount: ''
  });
  
  // Add state for history dialog
  const [historyDialog, setHistoryDialog] = useState({
    open: false,
    transactionId: null
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Add new state for selection
  const [selected, setSelected] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  
  // Add state for batch delete dialog
  const [batchDeleteDialog, setBatchDeleteDialog] = useState({ open: false });
  
  const t = useTranslation();

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);
  
  // Apply filters when they change or when data changes
  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await TransactionService.getTransactions();
      
      // Extract unique categories from transactions
      const uniqueCategories = [...new Set(response.data.map(t => t.category))].filter(Boolean);
      setCategories(uniqueCategories);
      
      // Check for transactions with history
      const transactionsWithHistory = await Promise.all(
        response.data.map(async (transaction) => {
          try {
            const historyResponse = await TransactionService.hasTransactionHistory(transaction.id);
            return {
              ...transaction,
              hasHistory: historyResponse.data.hasHistory
            };
          } catch (err) {
            console.error(`Error checking history for transaction ${transaction.id}:`, err);
            return {
              ...transaction,
              hasHistory: false
            };
          }
        })
      );
      
      setTransactions(transactionsWithHistory);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch transactions. Please try again later.');
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await AccountService.getAccounts();
      setAccounts(response.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };
  
  const applyFilters = () => {
    let result = [...transactions];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      result = result.filter(t => t.type === filters.type);
    }
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(t => t.category === filters.category);
    }
    
    // Apply account filter
    if (filters.accountId) {
      result = result.filter(t => t.accountId === filters.accountId);
    }
    
    // Apply date range filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      result = result.filter(t => new Date(t.date) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.date) <= endDate);
    }
    
    // Apply amount filters
    if (filters.minAmount && !isNaN(filters.minAmount)) {
      result = result.filter(t => parseFloat(t.amount) >= parseFloat(filters.minAmount));
    }
    
    if (filters.maxAmount && !isNaN(filters.maxAmount)) {
      result = result.filter(t => parseFloat(t.amount) <= parseFloat(filters.maxAmount));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle special sort fields
      if (sortField === 'date') {
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      } else if (sortField === 'amount') {
        aValue = parseFloat(a.amount);
        bValue = parseFloat(b.amount);
      }
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredTransactions(result);
  };
  
  // Add account names for display
  const getTransactionsWithAccountNames = () => {
    const accountMap = {};
    accounts.forEach(account => {
      accountMap[account.id] = account.name;
    });
    
    // Apply pagination
    const startIdx = page * rowsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIdx, startIdx + rowsPerPage);
    
    return paginatedTransactions.map(transaction => ({
      ...transaction,
      accountName: accountMap[transaction.accountId] || '-',
      selected: isSelected(transaction.id) // Add selected property
    }));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
    applyFilters();
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
      await TransactionService.deleteTransaction(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Transaction deleted successfully',
        severity: 'success'
      });
      
      // Remove the deleted transaction from local state
      // This ensures UI is updated immediately even if backend call fails
      setTransactions(prev => prev.filter(t => t.id !== deleteDialog.id));
      setFilteredTransactions(prev => prev.filter(t => t.id !== deleteDialog.id));
      
      // Also refresh data from server to ensure everything is in sync
      await fetchTransactions();
    } catch (err) {
      setLoading(false);
      
      // Convert to a more user-friendly error message
      let errorMessage = 'Failed to delete transaction. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      console.error('Error deleting transaction:', err);
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  const handleSearch = () => {
    applyFilters();
  };

  // Handle view history click
  const handleViewHistoryClick = (transactionId) => {
    setHistoryDialog({
      open: true,
      transactionId
    });
  };

  // Handle history dialog close
  const handleHistoryDialogClose = () => {
    setHistoryDialog({
      open: false,
      transactionId: null
    });
  };

  // Add handler for closing snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Handler for selecting a single transaction
  const handleSelectTransaction = (id) => {
    const newSelected = [...selected];
    
    if (newSelected.includes(id)) {
      // Remove if already selected
      const index = newSelected.indexOf(id);
      newSelected.splice(index, 1);
    } else {
      // Add if not selected
      newSelected.push(id);
    }
    
    setSelected(newSelected);
    
    // Exit selection mode if nothing is selected
    if (newSelected.length === 0) {
      setSelectionMode(false);
    }
  };

  // Handler for selecting all transactions on the current page
  const handleSelectAllTransactions = (event) => {
    if (event.target.checked) {
      // Get IDs of all transactions on current page
      const startIdx = page * rowsPerPage;
      const paginatedTransactions = filteredTransactions.slice(startIdx, startIdx + rowsPerPage);
      const newSelected = paginatedTransactions.map(t => t.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
      setSelectionMode(false);
    }
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    if (selectionMode) {
      // Exit selection mode
      setSelectionMode(false);
      setSelected([]);
    } else {
      // Enter selection mode
      setSelectionMode(true);
    }
  };

  // Open batch delete dialog
  const handleBatchDeleteClick = () => {
    setBatchDeleteDialog({ open: true });
  };

  // Cancel batch delete
  const handleBatchDeleteCancel = () => {
    setBatchDeleteDialog({ open: false });
  };

  // Confirm batch delete
  const handleBatchDeleteConfirm = async () => {
    try {
      setLoading(true);
      await TransactionService.deleteMultipleTransactions(selected);
      setBatchDeleteDialog({ open: false });
      
      // Show success message
      setSnackbar({
        open: true,
        message: `${selected.length} transactions deleted successfully`,
        severity: 'success'
      });
      
      // Remove deleted transactions from local state
      setTransactions(prev => prev.filter(t => !selected.includes(t.id)));
      setFilteredTransactions(prev => prev.filter(t => !selected.includes(t.id)));
      
      // Exit selection mode and clear selection
      setSelectionMode(false);
      setSelected([]);
      
      // Also refresh to ensure everything is in sync
      await fetchTransactions();
    } catch (err) {
      setLoading(false);
      
      let errorMessage = 'Failed to delete transactions. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      console.error('Error deleting transactions:', err);
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if a transaction is selected
  const isSelected = (id) => selected.includes(id);

  return (
    <Container maxWidth="xl" disableGutters>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          mb: isMobile ? 2 : 3,
          gap: isMobile ? 1 : 0
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontSize: isMobile ? '1.5rem' : '2.125rem' }}>
          {t('transactions.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
          <Button
            variant="outlined"
            startIcon={<CalendarIcon />}
            component={Link}
            to="/app/transactions/calendar"
            fullWidth={isMobile}
          >
            Calendar View
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/app/transactions/add"
            fullWidth={isMobile}
            size={isMobile ? 'medium' : 'large'}
          >
            {t('transactions.add')}
          </Button>
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your income and expenses.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Add Selection Toolbar that appears when in selection mode */}
      <Fade in={selectionMode}>
        <Paper 
          sx={{ 
            mb: 2, 
            position: 'sticky', 
            top: 0, 
            zIndex: 5,
            display: selectionMode ? 'block' : 'none'
          }}
          elevation={3}
        >
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 }
            }}
          >
            <Checkbox
              color="primary"
              indeterminate={selected.length > 0 && selected.length < Math.min(filteredTransactions.length, rowsPerPage)}
              checked={filteredTransactions.length > 0 && selected.length === Math.min(filteredTransactions.length, rowsPerPage)}
              onChange={handleSelectAllTransactions}
              inputProps={{ 'aria-label': 'select all transactions' }}
            />
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} selected
            </Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={handleBatchDeleteClick}
              disabled={selected.length === 0}
            >
              Delete Selected
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={toggleSelectionMode}
            >
              Cancel
            </Button>
          </Toolbar>
        </Paper>
      </Fade>

      <QuickFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        categories={categories}
        showAmountFilter={true}
        showTypeFilter={true}
        additionalFilters={
          accounts.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="account-label">Account</InputLabel>
                  <Select
                    labelId="account-label"
                    name="accountId"
                    value={filters.accountId || ''}
                    onChange={(e) => handleFilterChange({...filters, accountId: e.target.value})}
                    label="Account"
                  >
                    <MenuItem value="">All Accounts</MenuItem>
                    {accounts.map(account => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          ) : null
        }
        actions={
          <Button
            variant="outlined"
            onClick={toggleSelectionMode}
            sx={{ ml: { xs: 0, md: 2 }, mt: { xs: 2, md: 0 }, width: { xs: '100%', md: 'auto' } }}
          >
            Select Multiple
          </Button>
        }
      />

      <TransactionTable
        transactions={getTransactionsWithAccountNames()}
        totalCount={filteredTransactions.length}
        loading={loading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortChange={handleSortChange}
        onDeleteClick={handleDeleteClick}
        onViewHistoryClick={handleViewHistoryClick}
        page={page}
        rowsPerPage={rowsPerPage}
        sortField={sortField}
        sortDirection={sortDirection}
        selectionMode={selectionMode}
        selected={selected}
        onSelectTransaction={handleSelectTransaction}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this transaction? This action cannot be undone.
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

      <TransactionHistoryDialog
        open={historyDialog.open}
        onClose={handleHistoryDialogClose}
        transactionId={historyDialog.transactionId}
      />

      {/* Add Batch Delete Dialog */}
      <Dialog
        open={batchDeleteDialog.open}
        onClose={handleBatchDeleteCancel}
        aria-labelledby="batch-delete-dialog-title"
        aria-describedby="batch-delete-dialog-description"
      >
        <DialogTitle id="batch-delete-dialog-title">Delete multiple transactions</DialogTitle>
        <DialogContent>
          <DialogContentText id="batch-delete-dialog-description">
            Are you sure you want to delete {selected.length} transactions? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBatchDeleteCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleBatchDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TransactionList;
