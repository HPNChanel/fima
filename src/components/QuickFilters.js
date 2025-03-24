import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Grid,
  Tooltip,
  Collapse,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DateRange as DateRangeIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

/**
 * Quick filters component for transaction and report lists
 * 
 * @param {Object} filters - Current filter state
 * @param {Function} onFilterChange - Callback when filters change
 * @param {Function} onSearch - Callback when search is executed
 * @param {Array} categories - Available categories for filtering
 * @param {boolean} showAmountFilter - Whether to show amount filter fields
 * @param {boolean} showTypeFilter - Whether to show transaction type filter
 * @param {Array} additionalFilters - Optional additional filter components
 * @param {Array} actions - Optional actions to be rendered
 */
const QuickFilters = ({
  filters = {},
  onFilterChange,
  onSearch,
  categories = [],
  showAmountFilter = true,
  showTypeFilter = true,
  additionalFilters = null,
  actions = null // Add this prop 
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get currency symbol for amount inputs
  const currencySymbol = '$';
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };
  
  const handleDateChange = (field, date) => {
    onFilterChange({ ...filters, [field]: date });
  };
  
  const handleClearFilters = () => {
    const clearedFilters = {};
    Object.keys(filters).forEach(key => {
      clearedFilters[key] = '';
    });
    onFilterChange(clearedFilters);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  const handleApplyFilters = () => {
    onSearch();
  };
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(val => val !== '' && val !== null).length;

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      {/* Search box and expand/collapse button */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          mb: expanded ? 2 : 0
        }}
      >
        <TextField
          label="Search"
          name="search"
          value={filters.search || ''}
          onChange={handleFilterChange}
          variant="outlined"
          fullWidth={isMobile}
          size="small"
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: filters.search ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onFilterChange({ ...filters, search: '' })}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<FilterIcon />}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={handleExpandClick}
            variant={expanded ? 'contained' : 'outlined'}
            size="small"
            color={activeFilterCount > 0 ? 'primary' : 'inherit'}
            sx={{ minWidth: 120 }}
          >
            {expanded ? 'Hide Filters' : 'Filters'}
            {activeFilterCount > 0 && (
              <Chip
                label={activeFilterCount}
                size="small"
                color="secondary"
                sx={{ ml: 1, height: 20, minWidth: 20 }}
              />
            )}
          </Button>

          <Button
            variant="outlined"
            onClick={onSearch}
            size="small"
            sx={{ minWidth: 100 }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Expandable filter options */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            <FilterIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
            Filter Options
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {showTypeFilter && (
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                      labelId="type-label"
                      name="type"
                      value={filters.type || ''}
                      onChange={handleFilterChange}
                      label="Type"
                      startAdornment={
                        <CategoryIcon color="action" sx={{ mr: 1 }} fontSize="small" />
                      }
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="INCOME">Income</MenuItem>
                      <MenuItem value="EXPENSE">Expense</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {categories && categories.length > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      value={filters.category || ''}
                      onChange={handleFilterChange}
                      label="Category"
                      startAdornment={
                        <CategoryIcon color="action" sx={{ mr: 1 }} fontSize="small" />
                      }
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Date range filters */}
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate || null}
                  onChange={(date) => handleDateChange('startDate', date)}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <DateRangeIcon fontSize="small" />
                          </InputAdornment>
                        )
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate || null}
                  onChange={(date) => handleDateChange('endDate', date)}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <DateRangeIcon fontSize="small" />
                          </InputAdornment>
                        )
                      }
                    }
                  }}
                />
              </Grid>

              {/* Amount range filters */}
              {showAmountFilter && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Min Amount"
                      name="minAmount"
                      type="number"
                      value={filters.minAmount || ''}
                      onChange={handleFilterChange}
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Max Amount"
                      name="maxAmount"
                      type="number"
                      value={filters.maxAmount || ''}
                      onChange={handleFilterChange}
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Additional custom filters */}
              {additionalFilters && (
                <Grid item xs={12}>
                  {additionalFilters}
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Collapse>

      {/* This is the proper place for the action buttons */}
      {expanded && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 2,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleApplyFilters}
              startIcon={<FilterIcon />}
            >
              Apply Filters
            </Button>
            <Button 
              variant="text" 
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
            >
              Clear Filters
            </Button>
          </Box>
          
          {/* Render the actions here */}
          {actions && (
            <Box sx={{ mt: { xs: 2, md: 0 } }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default QuickFilters;
