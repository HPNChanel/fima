import React from 'react';
import {
  Box,
  TablePagination as MuiTablePagination,
  useMediaQuery,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage
} from '@mui/icons-material';

/**
 * Customized table pagination component
 * 
 * @param {number} count - Total number of rows
 * @param {number} page - Current page (0-indexed)
 * @param {number} rowsPerPage - Number of rows per page
 * @param {Function} onPageChange - Function to call when page changes
 * @param {Function} onRowsPerPageChange - Function to call when rows per page changes
 * @param {Array} rowsPerPageOptions - Available options for rows per page
 * @param {boolean} loading - Whether data is loading
 */
const TablePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
  loading = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      p: { xs: 1, sm: 2 },
      gap: isMobile ? 2 : 0
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        width: isMobile ? '100%' : 'auto'
      }}>
        <FormControl 
          variant="outlined" 
          size="small" 
          sx={{ 
            minWidth: 120,
            mr: 1
          }}
        >
          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
          <Select
            labelId="rows-per-page-label"
            id="rows-per-page-select"
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
            label="Rows per page"
            disabled={loading}
          >
            {rowsPerPageOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        width: isMobile ? '100%' : 'auto',
        justifyContent: isMobile ? 'space-between' : 'flex-end'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          {loading ? 'Loading...' : `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, count)} of ${count}`}
        </Typography>

        <Box sx={{ display: 'flex' }}>
          <Tooltip title="First page">
            <span>
              <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0 || loading}
                aria-label="first page"
                size="small"
              >
                <FirstPage />
              </IconButton>
            </span>
          </Tooltip>
          
          <Tooltip title="Previous page">
            <span>
              <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0 || loading}
                aria-label="previous page"
                size="small"
              >
                <KeyboardArrowLeft />
              </IconButton>
            </span>
          </Tooltip>
          
          <Tooltip title="Next page">
            <span>
              <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1 || loading}
                aria-label="next page"
                size="small"
              >
                <KeyboardArrowRight />
              </IconButton>
            </span>
          </Tooltip>
          
          <Tooltip title="Last page">
            <span>
              <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1 || loading}
                aria-label="last page"
                size="small"
              >
                <LastPage />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default TablePagination;
