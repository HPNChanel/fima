import React, { forwardRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell,
  Grid,
  Divider,
  Card
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import logo from '../assets/logo.png';
import { 
  AttachMoney as MoneyIcon,
  TrendingDown as ExpenseIcon,
  TrendingUp as IncomeIcon,
  Balance as BalanceIcon,
  DateRange as DateIcon
} from '@mui/icons-material';

// Create styled components for PDF report
const ReportHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  marginBottom: theme.spacing(4),
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1]
}));

const ReportTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(0.5),
  color: theme.palette.primary.main
}));

const ReportSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

const ReportSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[1]
}));

const ReportSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center', 
  gap: theme.spacing(1),
  color: theme.palette.primary.main
}));

const StyledTable = styled(Table)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& th': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold'
  }
}));

const ReportFooter = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderTop: `2px solid ${theme.palette.primary.main}`,
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius
}));

const StatCard = styled(Card)(({ theme, color }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderTop: `3px solid ${color || theme.palette.primary.main}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}));

const PageNumber = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5)
}));

/**
 * Enhanced PDF Report Template component
 * 
 * This component provides a professional layout for PDF reports
 * with header, summary statistics, transaction details, and footer.
 */
const ReportPdfTemplate = forwardRef(({ 
  title, 
  subtitle,
  dateRange,
  companyInfo = {
    name: 'Financial Management System',
    logo: logo,
    address: '123 Finance Street',
    email: 'finance@example.com',
    phone: '+1 (555) 123-4567'
  },
  summaryData = {},
  transactionData = [],
  transactionColumns = [], 
  charts = [],
  showSummary = true,
  showTransactions = true,
  showCharts = true,
  currentPage = 1,
  totalPages = 1,
  creator = "System User",
  currency = "$",
  exportOptions = {}
}, ref) => {

  // Format currency amounts
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Helper to determine trend color
  const getTrendColor = (value) => {
    if (value > 0) return '#4caf50'; // green
    if (value < 0) return '#f44336'; // red
    return '#757575'; // grey
  };

  return (
    <Paper 
      ref={ref} 
      sx={{ 
        p: 4, 
        backgroundColor: '#f5f5f5',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        minHeight: '1100px' // Roughly A4 height
      }}
    >
      {/* Report Header */}
      <ReportHeader>
        <Box>
          <ReportTitle variant="h4">
            {title || 'Financial Report'}
          </ReportTitle>
          
          <ReportSubtitle variant="h6">
            {subtitle || 'Detailed Transaction Report'}
          </ReportSubtitle>
          
          {dateRange && (
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DateIcon fontSize="small" color="primary" />
              Period: {dateRange}
            </Typography>
          )}
        </Box>
        
        {/* Logo and Company Info */}
        <Box sx={{ textAlign: 'right' }}>
          {companyInfo.logo && (
            <Box 
              component="img" 
              src={companyInfo.logo} 
              alt="Company Logo"
              sx={{ height: 60, mb: 1 }}
            />
          )}
          <Typography variant="subtitle1" fontWeight="bold">
            {companyInfo.name}
          </Typography>
        </Box>
      </ReportHeader>
      
      {/* Summary Section */}
      {showSummary && Object.keys(summaryData).length > 0 && (
        <ReportSection>
          <ReportSectionTitle variant="h6">
            <MoneyIcon color="primary" />
            Financial Summary
          </ReportSectionTitle>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <StatCard color="#4caf50">
                <Typography variant="subtitle2" gutterBottom color="textSecondary">
                  Total Income
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <IncomeIcon color="success" />
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    {formatCurrency(summaryData.totalIncome || 0)}
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <StatCard color="#f44336">
                <Typography variant="subtitle2" gutterBottom color="textSecondary">
                  Total Expenses
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <ExpenseIcon color="error" />
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    {formatCurrency(summaryData.totalExpense || 0)}
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <StatCard color={getTrendColor(summaryData.netBalance || 0)}>
                <Typography variant="subtitle2" gutterBottom color="textSecondary">
                  Net Balance
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <BalanceIcon color={summaryData.netBalance >= 0 ? "success" : "error"} />
                  <Typography variant="h5" fontWeight="bold" color={summaryData.netBalance >= 0 ? "success.main" : "error.main"}>
                    {formatCurrency(summaryData.netBalance || 0)}
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
          </Grid>
          
          {/* Additional summary info */}
          {summaryData.additionalStats && (
            <Grid container spacing={2}>
              {Object.entries(summaryData.additionalStats).map(([key, value], index) => (
                <Grid item xs={12} sm={3} key={key}>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {key}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {typeof value === 'number' ? formatCurrency(value) : value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </ReportSection>
      )}
      
      {/* Charts Section */}
      {showCharts && charts && charts.length > 0 && (
        <ReportSection>
          <ReportSectionTitle variant="h6">
            Financial Analytics
          </ReportSectionTitle>
          
          <Grid container spacing={3}>
            {charts.map((chart, index) => (
              <Grid item xs={12} md={chart.fullWidth ? 12 : 6} key={index}>
                <Box sx={{ p: 2, height: chart.height || 300 }}>
                  {chart.component}
                </Box>
              </Grid>
            ))}
          </Grid>
        </ReportSection>
      )}
      
      {/* Transaction Details Section */}
      {showTransactions && transactionData && transactionData.length > 0 && (
        <ReportSection>
          <ReportSectionTitle variant="h6">
            Transaction Details
          </ReportSectionTitle>
          
          <StyledTable size="small">
            <TableHead>
              <TableRow>
                {transactionColumns.map((column, index) => (
                  <TableCell key={index} align={column.align || 'left'}>
                    {column.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionData.map((transaction, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  sx={{
                    backgroundColor: rowIndex % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  {transactionColumns.map((column, colIndex) => (
                    <TableCell 
                      key={colIndex} 
                      align={column.align || 'left'}
                      sx={{
                        color: column.field === 'amount' 
                          ? transaction.type === 'INCOME' 
                            ? 'success.main' 
                            : 'error.main'
                          : 'inherit',
                        fontWeight: column.field === 'amount' ? 'bold' : 'normal'
                      }}
                    >
                      {column.render 
                        ? column.render(transaction[column.field], transaction) 
                        : transaction[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
          
          {/* Page totals */}
          {exportOptions.showPageTotals && (
            <Box sx={{ mb: 2, mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Page Totals
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs>
                  <Box sx={{ p: 1, bgcolor: 'success.light', borderRadius: 1, color: 'success.contrastText' }}>
                    <Typography variant="body2">Income: {formatCurrency(
                      transactionData
                        .filter(t => t.type === 'INCOME')
                        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                    )}</Typography>
                  </Box>
                </Grid>
                <Grid item xs>
                  <Box sx={{ p: 1, bgcolor: 'error.light', borderRadius: 1, color: 'error.contrastText' }}>
                    <Typography variant="body2">Expense: {formatCurrency(
                      transactionData
                        .filter(t => t.type === 'EXPENSE')
                        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                    )}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </ReportSection>
      )}
      
      {/* Report Footer */}
      <ReportFooter>
        <Typography variant="caption">
          Generated by: {creator}
        </Typography>
        <Typography variant="caption">
          Generated on: {format(new Date(), 'MMMM dd, yyyy, h:mm a')}
        </Typography>
        <Typography variant="caption">
          {companyInfo.name} | {companyInfo.email}
        </Typography>
      </ReportFooter>
      
      {/* Page Numbers */}
      {totalPages > 1 && (
        <PageNumber>
          Page {currentPage} of {totalPages}
        </PageNumber>
      )}
    </Paper>
  );
});

export default ReportPdfTemplate;
