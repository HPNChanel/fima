import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Tooltip,
  Typography,
  useMediaQuery,
  TableSortLabel,
  CircularProgress,
  TablePagination
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';

/**
 * ReportTable component for displaying transaction reports with pagination
 * 
 * @param {Array} data - Report data
 * @param {number} totalCount - Total number of records
 * @param {boolean} loading - Loading state
 * @param {Function} onPageChange - Page change handler
 * @param {Function} onRowsPerPageChange - Rows per page change handler
 * @param {Function} onSortChange - Sort change handler
 * @param {number} page - Current page
 * @param {number} rowsPerPage - Rows per page
 * @param {string} sortField - Field to sort by
 * @param {string} sortDirection - Sort direction ('asc' or 'desc')
 * @param {Array} columns - Column configuration
 * @param {Array} rowsPerPageOptions - Available options for rows per page
 */
const ReportTable = ({
  data = [],
  totalCount = 0,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  page = 0,
  rowsPerPage = 10,
  sortField = 'date',
  sortDirection = 'desc',
  columns = [],
  rowsPerPageOptions = [5, 10, 25, 50, 100]
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  const handleRequestSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    onSortChange(field, isAsc ? 'desc' : 'asc');
  };

  // Responsible for rendering the appropriate value for each cell
  const renderCellValue = (column, row) => {
    const value = row[column.field];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    // Default rendering for common field types
    if (column.type === 'date') {
      return format(new Date(value), column.format || 'MMM dd, yyyy');
    }
    
    if (column.type === 'currency') {
      return `$${parseFloat(value).toFixed(2)}`;
    }
    
    if (column.type === 'chip') {
      return (
        <Chip 
          label={value} 
          size="small" 
          color={column.getColor ? column.getColor(value, row) : 'default'} 
          variant={column.variant || 'filled'}
        />
      );
    }
    
    // Default string rendering with ellipsis for long content
    if (column.type === 'string' || !column.type) {
      return (
        <Tooltip title={value} placement="top">
          <Typography 
            variant="body2" 
            noWrap 
            sx={{ 
              maxWidth: column.maxWidth || 150,
              fontWeight: column.bold ? 500 : 400
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      );
    }
    
    return value;
  };

  // Create sorting label component
  const SortableTableCell = ({ column }) => (
    <TableCell
      align={column.align || 'left'}
      padding={column.disablePadding ? 'none' : 'normal'}
      sortDirection={sortField === column.field ? sortDirection : false}
      sx={column.sx}
    >
      {column.sortable !== false ? (
        <TableSortLabel
          active={sortField === column.field}
          direction={sortField === column.field ? sortDirection : 'asc'}
          onClick={() => handleRequestSort(column.field)}
        >
          {column.header}
        </TableSortLabel>
      ) : (
        column.header
      )}
    </TableCell>
  );

  // Filter columns based on screen size
  const visibleColumns = columns.filter(column => {
    if (column.responsive === 'mobile') return true;
    if (column.responsive === 'tablet') return !isMobile;
    if (column.responsive === 'desktop') return !isMobile && !isMedium;
    return true; // Default to visible if not specified
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 650, overflowX: 'auto' }}>
        <Table 
          stickyHeader 
          size={isMobile ? 'small' : 'medium'}
          aria-label="reports table"
        >
          <TableHead>
            <TableRow>
              {visibleColumns.map((column, index) => (
                <SortableTableCell key={column.field || index} column={column} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading data...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1" color="textSecondary">
                    No data found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Try adjusting your filters or date range
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {visibleColumns.map((column, colIndex) => (
                    <TableCell 
                      key={column.field || colIndex}
                      align={column.align || 'left'}
                      sx={column.cellSx}
                    >
                      {renderCellValue(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
            {loading && data.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  sx={{ p: 1, textAlign: 'center' }}
                >
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
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
        labelRowsPerPage="Rows:"
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
          native: true,
        }}
      />
    </Paper>
  );
};

export default ReportTable;
