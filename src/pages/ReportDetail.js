import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Card,
  CardContent,
  Tab,
  Tabs
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import ReportService from '../services/report.service';
import TransactionService from '../services/transaction.service';
import { format, parseISO } from 'date-fns';
import ExportReportsToolbar from '../components/ExportReportsToolbar';
import ReportTable from '../components/ReportTable';
import ReportPdfTemplate from '../components/ReportPdfTemplate';
import ReportCategoryChart from '../components/charts/ReportCategoryChart';
import ReportTimeSeriesChart from '../components/charts/ReportTimeSeriesChart';
import ExportService from '../services/export.service';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef(null);
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [exportView, setExportView] = useState('hidden');
  
  // Prepare transaction table columns
  const transactionColumns = [
    {
      field: 'date',
      header: 'Date',
      type: 'date',
      responsive: 'mobile',
      render: (value) => format(new Date(value), 'MM/dd/yyyy')
    },
    {
      field: 'category',
      header: 'Category',
      responsive: 'mobile',
      type: 'chip',
      getColor: (value) => 'primary'
    },
    {
      field: 'description',
      header: 'Description',
      responsive: 'mobile',
      maxWidth: 200
    },
    {
      field: 'amount',
      header: 'Amount',
      responsive: 'mobile',
      align: 'right',
      type: 'currency',
      render: (value, row) => {
        const formattedValue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
        return row.type === 'INCOME' 
          ? `+${formattedValue}` 
          : `-${formattedValue}`;
      }
    },
    {
      field: 'type',
      header: 'Type',
      responsive: 'tablet',
      type: 'chip',
      getColor: (value) => value === 'INCOME' ? 'success' : 'error'
    },
    {
      field: 'accountName',
      header: 'Account',
      responsive: 'desktop'
    }
  ];
  
  useEffect(() => {
    fetchReportData();
  }, [id]);
  
  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch report details
      const reportResponse = await ReportService.getReport(id);
      setReport(reportResponse.data);
      
      // Fetch transactions for the report period
      const transactionsResponse = await ReportService.getReportTransactions(id);
      setTransactions(transactionsResponse.data);
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load report data. Please try again later.');
      console.error('Error fetching report data:', err);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Format currency amounts
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Calculate category totals for charts
  const getCategoryData = () => {
    const categoryMap = new Map();
    
    if (!transactions) return [];
    
    transactions.forEach(transaction => {
      const { category, amount, type } = transaction;
      if (!category) return;
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { 
          category,
          incomeAmount: 0,
          expenseAmount: 0
        });
      }
      
      const categoryData = categoryMap.get(category);
      if (type === 'INCOME') {
        categoryData.incomeAmount += parseFloat(amount);
      } else {
        categoryData.expenseAmount += parseFloat(amount);
      }
    });
    
    // Convert Map to Array and sort
    return Array.from(categoryMap.values());
  };
  
  // Prepare time series data for charts
  const getTimeSeriesData = () => {
    if (!transactions || transactions.length === 0) return [];
    
    // Group transactions by date
    const dateMap = new Map();
    
    transactions.forEach(transaction => {
      const date = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          date: format(new Date(transaction.date), 'MM/dd'),
          income: 0,
          expense: 0,
          balance: 0
        });
      }
      
      const dateData = dateMap.get(date);
      if (transaction.type === 'INCOME') {
        dateData.income += parseFloat(transaction.amount);
      } else {
        dateData.expense += parseFloat(transaction.amount);
      }
      
      dateData.balance = dateData.income - dateData.expense;
    });
    
    // Convert Map to Array and sort by date
    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  // Handle export to PDF
  const handleExportPdf = async (exportOptions) => {
    try {
      // Prepare date range for PDF
      if (!report) return;
      
      // Make export template visible
      setExportView('visible');
      
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const element = reportRef.current;
      if (!element) {
        throw new Error('PDF template not found');
      }
      
      const pdf = await ExportService.generatePDF(element, {
        title: exportOptions.title || report.title,
        orientation: exportOptions.orientation || 'portrait',
        format: exportOptions.pageSize || 'a4',
        companyInfo: {
          name: exportOptions.companyName || 'Financial Management System'
        },
        dateRange: `${format(parseISO(report.fromDate), 'MMM dd, yyyy')} - ${format(parseISO(report.toDate), 'MMM dd, yyyy')}`
      });
      
      // Save the PDF
      const filename = `${report.title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      pdf.save(filename);
      
      // Hide export template
      setExportView('hidden');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setExportView('hidden');
    }
  };
  
  // Handle export to CSV
  const handleExportCsv = async () => {
    try {
      const filename = `${report?.title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      
      ExportService.exportToCSV(transactions, transactionColumns, filename);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };
  
  // Handle export to Excel
  const handleExportExcel = async () => {
    try {
      const filename = `${report?.title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      
      ExportService.exportToExcel(transactions, transactionColumns, filename, report?.title);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };
  
  // Handle print
  const handlePrint = async () => {
    try {
      // Make export template visible for printing
      setExportView('visible');
      
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const element = reportRef.current;
      if (!element) {
        throw new Error('PDF template not found');
      }
      
      ExportService.printElement(element, {
        title: report?.title
      });
      
      // Hide export template
      setExportView('hidden');
    } catch (error) {
      console.error('Error printing:', error);
      setExportView('hidden');
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/app/reports"
        >
          Back to Reports
        </Button>
      </Box>
    );
  }
  
  if (!report) {
    return (
      <Box p={3}>
        <Alert severity="warning">Report not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/app/reports"
          sx={{ mt: 2 }}
        >
          Back to Reports
        </Button>
      </Box>
    );
  }
  
  // Calculate totals for summary
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
  const netBalance = totalIncome - totalExpense;
  
  // Prepare category data for charts
  const categoryData = getCategoryData();
  const incomeCategories = categoryData
    .filter(c => c.incomeAmount > 0)
    .map(c => ({ category: c.category, amount: c.incomeAmount }));
    
  const expenseCategories = categoryData
    .filter(c => c.expenseAmount > 0)
    .map(c => ({ category: c.category, amount: c.expenseAmount }));
  
  // Prepare time series data
  const timeSeriesData = getTimeSeriesData();
  
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link to="/app/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            Dashboard
          </Link>
          <Link to="/app/reports" style={{ textDecoration: 'none', color: 'inherit' }}>
            Reports
          </Link>
          <Typography color="text.primary">{report.title}</Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {report.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip
                label={report.type}
                color="primary"
                sx={{ mr: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {format(parseISO(report.fromDate), 'MMM dd, yyyy')} - {format(parseISO(report.toDate), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchReportData}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              component={Link}
              to={`/app/reports/edit/${report.id}`}
            >
              Edit
            </Button>
          </Box>
        </Box>
        
        {/* Export Toolbar */}
        <ExportReportsToolbar
          onExportPdf={handleExportPdf}
          onExportCsv={handleExportCsv}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          defaultValues={{
            title: report.title,
            subtitle: `${report.type} Report`
          }}
          report={report}
        />
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderTop: '4px solid #4caf50' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Income
                </Typography>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalIncome)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {transactions.filter(t => t.type === 'INCOME').length} transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderTop: '4px solid #f44336' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalExpense)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {transactions.filter(t => t.type === 'EXPENSE').length} transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderTop: `4px solid ${netBalance >= 0 ? '#4caf50' : '#f44336'}` }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Net Balance
                </Typography>
                <Typography variant="h4" color={netBalance >= 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(netBalance)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {netBalance >= 0 ? 'Surplus' : 'Deficit'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Transactions" />
            <Tab label="Charts & Analytics" />
          </Tabs>
        </Box>
        
        {/* Tab Content */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Transactions
            </Typography>
            
            {transactions.length === 0 ? (
              <Alert severity="info">No transactions found for this report period.</Alert>
            ) : (
              <ReportTable
                data={transactions}
                totalCount={transactions.length}
                columns={transactionColumns}
                page={0}
                rowsPerPage={25}
                sortField="date"
                sortDirection="desc"
              />
            )}
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Charts & Analytics
            </Typography>
            
            {transactions.length === 0 ? (
              <Alert severity="info">No data available for analysis.</Alert>
            ) : (
              <Grid container spacing={3}>
                {/* Income/Expense Over Time Chart */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <ReportTimeSeriesChart 
                      data={timeSeriesData}
                      chartType="area"
                      height={350}
                    />
                  </Paper>
                </Grid>
                
                {/* Top Expense Categories */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <ReportCategoryChart 
                      data={expenseCategories}
                      type="expense"
                      height={350}
                      limit={5}
                    />
                  </Paper>
                </Grid>
                
                {/* Top Income Categories */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <ReportCategoryChart 
                      data={incomeCategories}
                      type="income"
                      height={350}
                      limit={5}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Box>
      
      {/* Hidden PDF Export Template */}
      <Box sx={{ 
        position: 'absolute', 
        left: '-9999px',
        visibility: exportView,
        width: '1000px'
      }}>
        <ReportPdfTemplate
          ref={reportRef}
          title={report?.title}
          subtitle={`${report?.type} Report`}
          dateRange={report ? `${format(parseISO(report.fromDate), 'MMM dd, yyyy')} - ${format(parseISO(report.toDate), 'MMM dd, yyyy')}` : ''}
          summaryData={{
            totalIncome,
            totalExpense,
            netBalance,
            additionalStats: {
              'Total Transactions': transactions.length,
              'Income Transactions': transactions.filter(t => t.type === 'INCOME').length,
              'Expense Transactions': transactions.filter(t => t.type === 'EXPENSE').length,
              'Average Transaction': transactions.length > 0 ? 
                formatCurrency((totalIncome + totalExpense) / transactions.length) : 
                formatCurrency(0)
            }
          }}
          transactionData={transactions}
          transactionColumns={transactionColumns}
          charts={[
            {
              component: <ReportTimeSeriesChart 
                data={timeSeriesData}
                chartType="area"
                height={250}
              />,
              fullWidth: true,
              height: 250
            },
            {
              component: <ReportCategoryChart 
                data={expenseCategories}
                type="expense"
                height={250}
                limit={5}
              />,
              fullWidth: false,
              height: 250
            },
            {
              component: <ReportCategoryChart 
                data={incomeCategories}
                type="income"
                height={250}
                limit={5}
              />,
              fullWidth: false,
              height: 250
            }
          ]}
          showSummary={true}
          showTransactions={true}
          showCharts={true}
          creator="Financial Management App"
        />
      </Box>
    </>
  );
};

export default ReportDetail;
