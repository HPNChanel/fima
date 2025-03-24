import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Typography,
  useMediaQuery,
  Checkbox,
  TableSortLabel,
  CircularProgress,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VisibilityOutlined as ViewIcon,
  PushPin as PushPinIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const TransactionTable = ({
  transactions = [],
  totalCount = 0,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  onDeleteClick,
  onViewHistoryClick, // Add this prop
  page = 0,
  rowsPerPage = 10,
  sortField = 'date',
  sortDirection = 'desc',
  rowsPerPageOptions = [5, 10, 25, 50],
  // Add new props for selection
  selectionMode = false,
  selected = [],
  onSelectTransaction = () => {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Add state for history dialog
  const [historyDialog, setHistoryDialog] = useState({
    open: false,
    transactionId: null,
    history: []
  });

  const handleRequestSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    onSortChange(field, isAsc ? 'desc' : 'asc');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(transactions.map(transaction => transaction.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  // Get appropriate color based on transaction type
  const getTypeColor = (type) => {
    return type === 'INCOME' ? 'success' : 'error';
  };

  // Create sorting label component
  const SortableTableCell = ({ id, label, disablePadding = false, align = 'left' }) => (
    <TableCell
      align={align}
      padding={disablePadding ? 'none' : 'normal'}
      sortDirection={sortField === id ? sortDirection : false}
    >
      <TableSortLabel
        active={sortField === id}
        direction={sortField === id ? sortDirection : 'asc'}
        onClick={() => handleRequestSort(id)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  // Handle history icon click
  const handleHistoryClick = (transactionId) => {
    if (onViewHistoryClick) {
      onViewHistoryClick(transactionId);
    }
  };

  return (
    <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
        <Table 
          stickyHeader 
          size={isMobile ? 'small' : 'medium'}
          aria-label="transactions table"
        >
          <TableHead>
            <TableRow>
              {/* Only show selection checkbox when in selection mode */}
              {/* {selectionMode && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < transactions.length}
                    checked={transactions.length > 0 && selected.length === transactions.length}
                    onChange={(event) => {
                      if (event.target.checked) {
                        const newSelected = transactions.map((n) => n.id);
                        onSelectTransaction(newSelected);
                      } else {
                        onSelectTransaction([]);
                      }
                    }}
                    inputProps={{
                      'aria-label': 'select all transactions',
                    }}
                  />
                </TableCell>
              )} */}
              <SortableTableCell id="description" label="Description" />
              <SortableTableCell id="amount" label="Amount" align="right" />
              {/* Category column - always visible on non-mobile */}
              {!isMobile && <SortableTableCell id="category" label="Category" />}
              <SortableTableCell id="date" label="Date" />
              {/* Account column - always visible on non-medium */}
              {!isMedium && <SortableTableCell id="accountId" label="Account" />}
              <SortableTableCell id="type" label="Type" />
              <TableCell align="right">Actions</TableCell>
              {/* Notes and History columns - always visible */}
              <TableCell align="center">Notes</TableCell>
              <TableCell align="center">History</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 5 : isMedium ? 6 : 7} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading transactions...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 5 : isMedium ? 6 : 7} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1" color="textSecondary">
                    No transactions found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Try adjusting your filters or create a new transaction
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => {
                const isItemSelected = selected.indexOf(transaction.id) !== -1;
                
                return (
                  <TableRow
                    key={transaction.id}
                    hover
                    selected={isItemSelected}
                    onClick={selectionMode ? () => onSelectTransaction(transaction.id) : undefined}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {/* Only show selection checkbox when in selection mode */}
                    {selectionMode && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelectTransaction(transaction.id);
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{
                        maxWidth: { xs: 100, sm: 200 },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      <Tooltip title={transaction.description}>
                        <Typography 
                          variant="body2" 
                          sx={{ fontWeight: 500 }}
                        >
                          {transaction.description}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right" sx={{ 
                        color: transaction.type === 'INCOME' ? 'success.main' : 'error.main',
                        fontWeight: 'medium',
                        whiteSpace: 'nowrap'
                    }}>
                      {transaction.type === 'INCOME' ? '+' : '-'} ${parseFloat(transaction.amount).toFixed(2)}
                    </TableCell>
                    {/* Category column - always visible on non-mobile */}
                    {!isMobile && (
                      <TableCell>
                        <Chip 
                          label={transaction.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                    )}
                    <TableCell sx={{ 
                      whiteSpace: 'nowrap'
                    }}>
                      <Typography variant="body2">
                        {formatDate(transaction.date)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatTime(transaction.date)}
                      </Typography>
                    </TableCell>
                    {/* Account column - always visible on non-medium */}
                    {!isMedium && (
                      <TableCell>{transaction.accountName || '-'}</TableCell>
                    )}
                    <TableCell>
                      <Chip 
                        label={transaction.type} 
                        size="small" 
                        color={getTypeColor(transaction.type)} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {isMobile ? (
                          <IconButton
                            component={Link}
                            to={`/app/transactions/edit/${transaction.id}`}
                            size="small"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          <>
                            <Tooltip title="Edit">
                              <IconButton
                                component={Link}
                                to={`/app/transactions/edit/${transaction.id}`}
                                size="small"
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDeleteClick(transaction.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                    {/* Notes and History columns - always visible */}
                    <TableCell align="center">
                      {transaction.notes && (
                        <Tooltip title={transaction.notes}>
                          <IconButton size="small" color="default">
                            <PushPinIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.hasHistory && (
                        <Tooltip title="View transaction history">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleHistoryClick(transaction.id)}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            {loading && transactions.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 5 : isMedium ? 6 : 7}
                  sx={{ p: 1, textAlign: 'center' }}
                >
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Standard pagination */}
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
        labelRowsPerPage="Rows per page:"
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
          native: true,
        }}
      />
    </Paper>
  );
};

export default TransactionTable;
