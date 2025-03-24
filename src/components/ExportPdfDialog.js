import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Divider,
  CircularProgress,
  Alert,
  RadioGroup,
  Radio,
  FormLabel,
  Chip,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  PictureAsPdf as PdfIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

/**
 * Dialog component for configuring PDF export options
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Function to call when dialog is closed
 * @param {function} onExport - Function to call when export is confirmed
 * @param {Object} defaultValues - Default values for export options
 * @param {string[]} categories - Available categories for filtering
 * @param {Object} filters - Current report filters
 */
const ExportPdfDialog = ({ 
  open, 
  onClose, 
  onExport, 
  defaultValues = {}, 
  categories = [],
  filters = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Default export options
  const defaultOptions = {
    title: defaultValues.title || 'Financial Report',
    subtitle: defaultValues.subtitle || '',
    exportFormat: 'pdf',
    orientation: 'portrait',
    pageSize: 'a4',
    includeCompanyHeader: true,
    includeCharts: true,
    includeTables: true,
    startDate: filters.startDate ? new Date(filters.startDate) : new Date(new Date().setDate(1)),
    endDate: filters.endDate ? new Date(filters.endDate) : new Date(),
    selectedCategories: filters.category ? [filters.category] : [],
    transactionType: filters.type || 'all',
    exportAll: true,
    companyName: 'Financial Management System',
    includeFooter: true
  };
  
  const [options, setOptions] = useState(defaultOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (name, date) => {
    setOptions(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleCategoryToggle = (category) => {
    setOptions(prev => {
      if (prev.selectedCategories.includes(category)) {
        return {
          ...prev,
          selectedCategories: prev.selectedCategories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          selectedCategories: [...prev.selectedCategories, category]
        };
      }
    });
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Format dates
      const formattedStartDate = format(options.startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(options.endDate, 'yyyy-MM-dd');
      
      // Prepare export settings
      const exportSettings = {
        ...options,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        dateRange: `${format(options.startDate, 'MMM dd, yyyy')} - ${format(options.endDate, 'MMM dd, yyyy')}`
      };
      
      // Call export function
      await onExport(exportSettings);
      
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to export report. Please try again.');
      console.error('Export error:', err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <PdfIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Export Report</Typography>
          </Box>
          {!loading && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Document Options Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Document Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="title"
              label="Report Title"
              value={options.title}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              disabled={loading}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="subtitle"
              label="Subtitle (optional)"
              value={options.subtitle}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="e.g., Quarterly Financial Summary"
              disabled={loading}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel id="orientation-label">Page Orientation</InputLabel>
              <Select
                labelId="orientation-label"
                name="orientation"
                value={options.orientation}
                onChange={handleChange}
                label="Page Orientation"
                disabled={loading}
              >
                <MenuItem value="portrait">Portrait</MenuItem>
                <MenuItem value="landscape">Landscape</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel id="pageSize-label">Page Size</InputLabel>
              <Select
                labelId="pageSize-label"
                name="pageSize"
                value={options.pageSize}
                onChange={handleChange}
                label="Page Size"
                disabled={loading}
              >
                <MenuItem value="a4">A4</MenuItem>
                <MenuItem value="letter">Letter</MenuItem>
                <MenuItem value="legal">Legal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="companyName"
              label="Company Name"
              value={options.companyName}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              disabled={loading}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  name="includeCompanyHeader"
                  checked={options.includeCompanyHeader}
                  onChange={handleChange}
                  disabled={loading}
                />
              }
              label="Include Company Header"
            />
            <FormControlLabel
              control={
                <Switch
                  name="includeFooter"
                  checked={options.includeFooter}
                  onChange={handleChange}
                  disabled={loading}
                />
              }
              label="Include Footer"
            />
          </Grid>
          
          {/* Content Options Section */}
          <Grid item xs={12} mt={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Content Options
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} display="flex" flexWrap="wrap" gap={2}>
            <FormControlLabel
              control={
                <Switch
                  name="includeCharts"
                  checked={options.includeCharts}
                  onChange={handleChange}
                  disabled={loading}
                />
              }
              label="Include Charts"
            />
            <FormControlLabel
              control={
                <Switch
                  name="includeTables"
                  checked={options.includeTables}
                  onChange={handleChange}
                  disabled={loading}
                />
              }
              label="Include Data Tables"
            />
            <FormControlLabel
              control={
                <Switch
                  name="exportAll"
                  checked={options.exportAll}
                  onChange={handleChange}
                  disabled={loading}
                />
              }
              label="Export Current View Only"
            />
          </Grid>
          
          {/* Date Range Section */}
          <Grid item xs={12} mt={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Date Range
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={options.startDate}
              onChange={(date) => handleDateChange('startDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  disabled: loading,
                  size: isMobile ? "small" : "medium"
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={options.endDate}
              onChange={(date) => handleDateChange('endDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  disabled: loading,
                  size: isMobile ? "small" : "medium"
                }
              }}
            />
          </Grid>
          
          {/* Filter Options Section */}
          <Grid item xs={12} mt={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Filter Options
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth component="fieldset">
              <FormLabel component="legend">Transaction Type</FormLabel>
              <RadioGroup
                name="transactionType"
                value={options.transactionType}
                onChange={handleChange}
                row
              >
                <FormControlLabel 
                  value="all" 
                  control={<Radio size={isMobile ? "small" : "medium"} />} 
                  label="All" 
                  disabled={loading}
                />
                <FormControlLabel 
                  value="INCOME" 
                  control={<Radio size={isMobile ? "small" : "medium"} />} 
                  label="Income" 
                  disabled={loading}
                />
                <FormControlLabel 
                  value="EXPENSE" 
                  control={<Radio size={isMobile ? "small" : "medium"} />} 
                  label="Expense" 
                  disabled={loading}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              Categories (select to filter)
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 0.5,
              maxHeight: '100px',
              overflowY: 'auto'
            }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryToggle(category)}
                  color={options.selectedCategories.includes(category) ? 'primary' : 'default'}
                  variant={options.selectedCategories.includes(category) ? 'filled' : 'outlined'}
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
        <Box>
          <Button
            variant="contained"
            onClick={handleExport}
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
          >
            {loading ? 'Generating...' : 'Export'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ExportPdfDialog;
