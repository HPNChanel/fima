import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  useMediaQuery,
  Chip,
  Grid,
  Button,
  Menu,
  Popover,
  Stack,
  Fade,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import TransactionService from '../services/transaction.service';
import TransactionDetailDialog from '../components/TransactionDetailDialog';
import { format } from 'date-fns';
import { 
  CalendarMonth as CalendarIcon, 
  FilterList as FilterIcon,
  Add as AddIcon,
  Today as TodayIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Event as EventIcon,
  ViewDay as ViewDayIcon,
  EventNote as EventNoteIcon,
  CalendarViewMonth as CalendarViewMonthIcon,
  Search as SearchIcon,
  ViewWeek as ViewWeekIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import TransactionFormDialog from '../components/TransactionFormDialog';

const TransactionCalendar = () => {
  const [transactions, setTransactions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, INCOME, EXPENSE
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [selectedDateTransactions, setSelectedDateTransactions] = useState([]);
  const [dateDetailDialogOpen, setDateDetailDialogOpen] = useState(false);
  const [yearMonthPickerOpen, setYearMonthPickerOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  
  // Add a ref to access the calendar component
  const calendarRef = useRef(null);
  
  // Add new state variables for the transaction form dialog
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [transactionTemplate, setTransactionTemplate] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'duplicate'
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    fetchTransactions();
  }, [currentMonth, typeFilter]);
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await TransactionService.getTransactionsForCalendar(currentMonth);
      let filteredTransactions = response.data || [];
      
      // Apply type filter
      if (typeFilter !== 'ALL') {
        filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
      }
      
      setTransactions(filteredTransactions);
      
      // Generate calendar events from transactions - fixed date handling
      const calendarEvents = filteredTransactions.map(transaction => ({
        id: transaction.id,
        title: formatEventTitle(transaction),
        start: new Date(transaction.date), // Ensure proper Date object
        allDay: true,
        backgroundColor: getEventColor(transaction),
        borderColor: getEventColor(transaction),
        textColor: '#ffffff',
        transaction: transaction // Store the full transaction for reference
      }));
      
      setEvents(calendarEvents);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load transactions. Please try again.');
      console.error('Error fetching transactions for calendar:', err);
    }
  };
  
  // New function to fetch transactions for a specific date
  const fetchTransactionsForDate = (date) => {
    if (!date || !transactions.length) return [];
    
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return format(transactionDate, 'yyyy-MM-dd') === selectedDateStr;
    });
  };
  
  const formatEventTitle = (transaction) => {
    const amount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(transaction.amount);
    
    return `${transaction.type === 'INCOME' ? '+' : '-'}${amount} - ${transaction.description.substring(0, 15)}${transaction.description.length > 15 ? '...' : ''}`;
  };
  
  const getEventColor = (transaction) => {
    if (transaction.type === 'INCOME') {
      return theme.palette.success.main;
    } else {
      // For expenses, color by category
      switch (transaction.category) {
        case 'FOOD':
          return '#FF9800'; // Orange
        case 'TRANSPORT':
          return '#3F51B5'; // Indigo
        case 'HOUSING':
          return '#9C27B0'; // Purple
        case 'HEALTHCARE':
          return '#E91E63'; // Pink
        case 'ENTERTAINMENT':
          return '#673AB7'; // Deep Purple
        case 'SHOPPING':
          return '#F44336'; // Red
        case 'UTILITIES':
          return '#2196F3'; // Blue
        case 'EDUCATION':
          return '#4CAF50'; // Green
        default:
          return theme.palette.error.main; // Default red for other expenses
      }
    }
  };
  
  const handleEventClick = (clickInfo) => {
    const transaction = clickInfo.event.extendedProps.transaction;
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };
  
  // Fix the handleDateClick function to show a popover for empty days
  const handleDateClick = (arg) => {
    // Get the clicked date
    const clickedDate = new Date(arg.date);
    setSelectedDate(clickedDate);
    
    // Find transactions for this date
    const dateTransactions = fetchTransactionsForDate(clickedDate);
    setSelectedDateTransactions(dateTransactions);
    
    // If there are transactions for this date, show the detailed dialog
    if (dateTransactions.length > 0) {
      setDateDetailDialogOpen(true);
    } else {
      // Show popover with "No transactions" message and an "Add Transaction" button
      setDateAnchorEl(arg.dayEl); // Set the clicked day element as anchor for the popover
    }
  };
  
  // Handler for creating a new transaction
  const handleCreateTransaction = (date) => {
    setTransactionTemplate({
      description: '',
      amount: '',
      type: 'EXPENSE',
      category: '',
      date: date || new Date(),
      accountId: '',
      notes: ''
    });
    setFormMode('create');
    setTransactionFormOpen(true);
    // Close any other open dialogs
    setDateAnchorEl(null);
    setDateDetailDialogOpen(false);
  };
  
  // Handler for duplicating a transaction
  const handleDuplicateTransaction = (transaction) => {
    setTransactionTemplate({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: selectedDate || new Date(transaction.date),
      accountId: transaction.accountId,
      notes: transaction.notes || ''
    });
    setFormMode('duplicate');
    setTransactionFormOpen(true);
    // Close any other open dialogs
    setDialogOpen(false);
    setDateDetailDialogOpen(false);
  };
  
  // Update the handleTransactionFormSubmit function to ensure date is properly formatted
  const handleTransactionFormSubmit = async (transactionData) => {
    try {
      // Ensure the date is preserved correctly
      const formattedData = {
        ...transactionData,
        // Use noon time to avoid timezone issues
        date: transactionData.date instanceof Date ? 
          (() => {
            const date = new Date(transactionData.date);
            date.setHours(12, 0, 0, 0);
            return date;
          })() : 
          new Date(transactionData.date)
      };
      
      console.log('Creating transaction with formatted date:', 
        formattedData.date, 
        'day of month:', formattedData.date.getDate());
      
      await TransactionService.createTransaction(formattedData);
      // Refresh transactions after successful creation
      fetchTransactions();
      setTransactionFormOpen(false);
      
      // Show success notification (you can add this functionality later)
    } catch (err) {
      console.error('Error creating transaction:', err);
      // Show error notification (you can add this functionality later)
    }
  };
  
  // Handler for transaction form close
  const handleTransactionFormClose = () => {
    setTransactionFormOpen(false);
  };
  
  // Modify the existing handleAddTransaction function
  const handleAddTransaction = () => {
    // Open the form dialog instead of redirecting
    handleCreateTransaction(selectedDate);
    // Close the popover
    handlePopoverClose();
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTransaction(null);
  };
  
  const handleMonthChange = (info) => {
    // Store the current view date when FullCalendar changes the visible dates
    const newViewDate = info.view.currentStart;
    setViewDate(newViewDate);
    
    // Format for API call
    const year = newViewDate.getFullYear();
    const month = String(newViewDate.getMonth() + 1).padStart(2, '0');
    const newMonth = `${year}-${month}`;
    
    // Only update if month has actually changed to avoid duplicate API calls
    if (newMonth !== currentMonth) {
      console.log(`Changing month from ${currentMonth} to ${newMonth}`);
      setCurrentMonth(newMonth);
    }
  };
  
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };
  
  const handlePopoverClose = () => {
    setDateAnchorEl(null);
  };
  
  // Update handlers for direct navigation to use the ref
  const goToToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setViewDate(new Date());
    }
  };
  
  const goToPrevMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      // Update viewDate accordingly
      const newDate = new Date(viewDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setViewDate(newDate);
    }
  };
  
  const goToNextMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      // Update viewDate accordingly
      const newDate = new Date(viewDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setViewDate(newDate);
    }
  };
  
  // Fix the handleViewChange function to maintain the current date when changing views
  const handleViewChange = (newView) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      
      // Store the current date before changing view
      const currentDate = calendarApi.getDate();
      
      // Change to the new view
      calendarApi.changeView(newView);
      
      // Then navigate back to the stored date to maintain position
      calendarApi.gotoDate(currentDate);
      
      setCalendarView(newView);
    }
  };
  
  // Handler for year/month picker
  const handleYearMonthChange = (date) => {
    if (calendarRef.current && date) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date);
      setViewDate(date);
      setYearMonthPickerOpen(false);
    }
  };
  
  // Close date detail dialog
  const handleDateDetailDialogClose = () => {
    setDateDetailDialogOpen(false);
  };
  
  // Format amount with currency symbol
  const formatAmount = (amount, type) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
    
    return type === 'INCOME' ? `+${formatted}` : `-${formatted}`;
  };
  
  // Calculate total income and expense for selected date
  const dateFinancialSummary = useMemo(() => {
    if (!selectedDateTransactions.length) return { totalIncome: 0, totalExpense: 0, net: 0 };
    
    const totalIncome = selectedDateTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
    const totalExpense = selectedDateTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
    return {
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense
    };
  }, [selectedDateTransactions]);
  
  // Render calendar legend to explain color coding
  const renderLegend = () => (
    <Box sx={{ mt: 2, borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>Legend:</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip 
          size="small" 
          label="Income" 
          sx={{ backgroundColor: theme.palette.success.main, color: 'white' }} 
        />
        <Chip 
          size="small" 
          label="Food" 
          sx={{ backgroundColor: '#FF9800', color: 'white' }} 
        />
        <Chip 
          size="small" 
          label="Transport" 
          sx={{ backgroundColor: '#3F51B5', color: 'white' }} 
        />
        <Chip 
          size="small" 
          label="Housing" 
          sx={{ backgroundColor: '#9C27B0', color: 'white' }} 
        />
        <Chip 
          size="small" 
          label="Healthcare" 
          sx={{ backgroundColor: '#E91E63', color: 'white' }} 
        />
        <Chip 
          size="small" 
          label="Entertainment" 
          sx={{ backgroundColor: '#673AB7', color: 'white' }} 
        />
        <Chip 
          size="small" 
          label="Shopping" 
          sx={{ backgroundColor: '#F44336', color: 'white' }} 
        />
        <Chip 
          size="small" 
          label="Utilities" 
          sx={{ backgroundColor: '#2196F3', color: 'white' }} 
        />
        <Chip 
          size="small" 
          label="Education" 
          sx={{ backgroundColor: '#4CAF50', color: 'white' }} 
        />
      </Box>
    </Box>
  );
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md>
            <Typography variant="h4" component="h1" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: isMobile ? '1.75rem' : '2.125rem' 
            }}>
              <CalendarIcon fontSize="large" sx={{ mr: 1.5 }} />
              Transaction Calendar
            </Typography>
          </Grid>
          <Grid item xs={12} md="auto">
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Calendar Navigation Controls */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<TodayIcon />}
                  onClick={goToToday}
                >
                  Today
                </Button>
                <Tooltip title="Previous Month">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={goToPrevMonth}
                    aria-label="Previous Month"
                  >
                    <PrevIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Next Month">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={goToNextMonth}
                    aria-label="Next Month"
                  >
                    <NextIcon />
                  </Button>
                </Tooltip>
                
                {/* Year/Month Picker Button */}
                <Tooltip title="Choose Month/Year">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setYearMonthPickerOpen(true)}
                  >
                    {format(viewDate, 'MMM yyyy')}
                  </Button>
                </Tooltip>
                
                {/* View Selector Buttons */}
                <Tooltip title="Month View">
                  <Button
                    variant={calendarView === 'dayGridMonth' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handleViewChange('dayGridMonth')}
                  >
                    <CalendarViewMonthIcon fontSize="small" />
                  </Button>
                </Tooltip>
                <Tooltip title="Week View">
                  <Button
                    variant={calendarView === 'dayGridWeek' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handleViewChange('dayGridWeek')}
                  >
                    <ViewWeekIcon fontSize="small" />
                  </Button>
                </Tooltip>
                <Tooltip title="Day View">
                  <Button
                    variant={calendarView === 'dayGridDay' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handleViewChange('dayGridDay')}
                  >
                    <ViewDayIcon fontSize="small" />
                  </Button>
                </Tooltip>
              </Stack>
              
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="type-filter-label">Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  id="type-filter"
                  value={typeFilter}
                  label="Type"
                  onChange={handleTypeFilterChange}
                  startAdornment={<FilterIcon sx={{ mr: 0.5, ml: -0.5 }} fontSize="small" />}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="INCOME">Income</MenuItem>
                  <MenuItem value="EXPENSE">Expense</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                component="a" 
                href="/app/transactions/add"
              >
                Add Transaction
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 1 }}>
          View your transactions in a monthly calendar. Click on a date to add a transaction or click on an existing transaction to see details.
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 2, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FullCalendar
              ref={calendarRef} // Add the ref here
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView={calendarView}
              initialDate={viewDate}
              events={events}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              datesSet={handleMonthChange}
              headerToolbar={{
                left: '', // Remove default navigation buttons
                center: 'title',
                right: ''  // Remove default navigation buttons
              }}
              height="auto"
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              fixedWeekCount={false}
              navLinks={true}
              selectable={true}
              selectMirror={true}
              firstDay={1} // Start week on Monday
              dayMaxEvents={3} // Limit visible events per day
              moreLinkClick="popover" // Show a popover with more events
              duration={{ months: 1, weeks: 1, days: 1 }} // Specify durations for each view
              views={{
                dayGridMonth: {
                  titleFormat: { year: 'numeric', month: 'long' },
                  duration: { months: 1 }
                },
                dayGridWeek: {
                  titleFormat: { year: 'numeric', month: 'short', day: '2-digit' },
                  duration: { weeks: 1 }
                },
                dayGridDay: {
                  titleFormat: { year: 'numeric', month: 'long', day: '2-digit', weekday: 'long' },
                  duration: { days: 1 }
                }
              }}
            />
            
            {renderLegend()}
          </>
        )}
      </Paper>
      
      {/* Transaction detail dialog */}
      <TransactionDetailDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        transaction={selectedTransaction}
        onDuplicate={handleDuplicateTransaction} // Add this new prop
      />
      
      {/* Date selection popover */}
      <Popover
        open={Boolean(dateAnchorEl)}
        anchorEl={dateAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: { p: 2, width: 250 }
        }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No transactions on this day yet
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTransaction}
          >
            Add Transaction
          </Button>
        </Stack>
      </Popover>
      
      {/* Year/Month Picker Dialog */}
      <Dialog
        open={yearMonthPickerOpen}
        onClose={() => setYearMonthPickerOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Select Month and Year
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={['year', 'month']}
              value={viewDate}
              onChange={handleYearMonthChange}
              renderInput={(params) => 
                <TextField {...params} margin="normal" fullWidth />
              }
              autoFocus
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setYearMonthPickerOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Date Detail Dialog - Shows transactions for selected date */}
      <Dialog
        open={dateDetailDialogOpen}
        onClose={handleDateDetailDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </Typography>
            <MuiIconButton edge="end" onClick={handleDateDetailDialogClose} aria-label="close">
              <CloseIcon />
            </MuiIconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Financial Summary for the Day */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Income
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatAmount(dateFinancialSummary.totalIncome, 'INCOME')}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Expense
                </Typography>
                <Typography variant="h6" color="error.main">
                  {formatAmount(dateFinancialSummary.totalExpense, 'EXPENSE')}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Net
                </Typography>
                <Typography 
                  variant="h6" 
                  color={dateFinancialSummary.net >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatAmount(Math.abs(dateFinancialSummary.net), dateFinancialSummary.net >= 0 ? 'INCOME' : 'EXPENSE')}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          {/* List of Transactions */}
          <List sx={{ pt: 0 }}>
            {selectedDateTransactions.map(transaction => (
              <ListItem 
                key={transaction.id} 
                alignItems="flex-start"
                sx={{ 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      {transaction.description}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span" color="text.secondary">
                        {transaction.accountName} • {format(new Date(transaction.date), 'h:mm a')}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        component="div"
                        sx={{ mt: 0.5 }}
                      >
                        <Chip 
                          size="small" 
                          label={transaction.category} 
                          color="primary" 
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          size="small" 
                          label={transaction.type} 
                          color={transaction.type === 'INCOME' ? 'success' : 'error'} 
                        />
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: transaction.type === 'INCOME' ? 'success.main' : 'error.main',
                      fontWeight: 'medium',
                      mb: 1
                    }}
                  >
                    {formatAmount(transaction.amount, transaction.type)}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <MuiIconButton 
                        edge="end" 
                        size="small"
                        component={Link}
                        to={`/app/transactions/edit/${transaction.id}`}
                      >
                        <EditIcon fontSize="small" />
                      </MuiIconButton>
                    </Tooltip>
                    
                    <Tooltip title="Add Similar">
                      <MuiIconButton 
                        edge="end" 
                        size="small"
                        onClick={() => handleDuplicateTransaction(transaction)}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </MuiIconButton>
                    </Tooltip>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<AddIcon />} onClick={handleAddTransaction}>
            Add Transaction
          </Button>
          <Button 
            variant="contained" 
            onClick={handleDateDetailDialogClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add the new TransactionFormDialog component */}
      <TransactionFormDialog
        open={transactionFormOpen}
        onClose={handleTransactionFormClose}
        onSubmit={handleTransactionFormSubmit}
        transaction={transactionTemplate}
        mode={formMode}
      />
    </Container>
  );
};

export default TransactionCalendar;