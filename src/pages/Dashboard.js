import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useMediaQuery,
  Container,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalance as BalanceIcon,
  DonutLarge as DonutIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import DashboardBarChart from "../charts/DashboardBarChart";
import DashboardPieChart from "../charts/DashboardPieChart";
import DashboardLineChart from "../charts/DashboardLineChart";
import TransactionService from "../services/transaction.service";
import AccountService from "../services/account.service";
import {
  format,
  subMonths,
  subWeeks,
  subYears,
  differenceInDays,
} from "date-fns";
import { chartColors, formatCurrency } from "../charts/ChartConfig";
import SpendingAlert from '../components/SpendingAlert';
import { AppContext } from '../App';
import { createTranslator } from '../utils/translations';

/**
 * Dashboard component to show financial overview
 * Displays income/expense summary and various visualizations
 */
const Dashboard = () => {
  // Get current user from context
  const { currentUser, language } = useContext(AppContext);
  
  // Create translator function directly
  const t = createTranslator(language);
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    income: [],
    expense: [],
  });
  
  // Add new state for total account balance
  const [totalAccountBalance, setTotalAccountBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // UI control states
  const [categoryView, setCategoryView] = useState("all"); // 'all', 'income', 'expense'
  const [chartType, setChartType] = useState("bar"); // 'bar', 'pie'
  const [timeRange, setTimeRange] = useState("month"); // 'week', 'month', 'quarter', 'year'
  const [tabValue, setTabValue] = useState(0); // 0 = Summary, 1 = Trends

  // Responsive design helpers
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Load transactions and account balance on component mount
  useEffect(() => {
    fetchTransactions();
    fetchTotalAccountBalance();
  }, []);

  // Process data when transactions load or filters change
  useEffect(() => {
    if (transactions.length > 0) {
      processChartData();
      processTimeSeriesData();
    }
  }, [transactions, categoryView, timeRange, chartType]); // Only reprocess when these values change

  // Process data for category charts (bar/pie)
  const processChartData = () => {
    if (categoryData.length === 0) return; // Skip if no data

    if (categoryData.length > 0) {
      // Filter data based on selected category view
      const filteredData =
        categoryView === "all"
          ? categoryData
          : categoryData.filter((cat) =>
              categoryView === "income" ? cat.income > 0 : cat.expense > 0
            );

      // Process data differently based on chart type and category view
      if (chartType === "pie") {
        // For pie chart, we need one dataset for the selected category type
        if (categoryView === "income" || categoryView === "all") {
          const incomeData = filteredData
            .filter((cat) => cat.income > 0)
            .map((cat) => ({
              label: cat.category,
              value: cat.income,
              color: chartColors.income,
              type: "Income",
            }));
          if (incomeData.length > 0) {
            setChartData(incomeData);
          } else if (categoryView === "all") {
            // If no income data, try expense data for 'all' view
            const expenseData = filteredData
              .filter((cat) => cat.expense > 0)
              .map((cat) => ({
                label: cat.category,
                value: cat.expense,
                color: chartColors.expense,
                type: "Expense",
              }));
            setChartData(expenseData);
          }
        } else {
          // Expense view
          const expenseData = filteredData
            .filter((cat) => cat.expense > 0)
            .map((cat) => ({
              label: cat.category,
              value: cat.expense,
              color: chartColors.expense,
              type: "Expense",
            }));
          setChartData(expenseData);
        }
      } else {
        // For bar charts
        const transformedData = [];

        // Add income data if showing all or income
        if (categoryView === "all" || categoryView === "income") {
          filteredData.forEach((cat) => {
            if (cat.income > 0) {
              transformedData.push({
                label: cat.category,
                value: cat.income,
                color: chartColors.income,
                category: cat.category,
                type: "Income",
              });
            }
          });
        }

        // Add expense data if showing all or expenses
        if (categoryView === "all" || categoryView === "expense") {
          filteredData.forEach((cat) => {
            if (cat.expense > 0) {
              transformedData.push({
                label: cat.category,
                value: cat.expense,
                color: chartColors.expense,
                category: cat.category,
                type: "Expense",
              });
            }
          });
        }

        setChartData(transformedData);
      }
    }
  };

  // Process data for time series chart
  const processTimeSeriesData = () => {
    if (transactions.length === 0) return; // Skip if no transactions

    // Get date range based on selected time period
    let periodStart = new Date();
    let periodLabels = [];

    switch (timeRange) {
      case "week":
        periodStart = subWeeks(new Date(), 1);
        // Daily labels for the past week
        periodLabels = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(new Date(), 6 - i);
          return format(date, "EEE");
        });
        break;
      case "month":
        periodStart = subMonths(new Date(), 1);
        // Weekly labels for the past month
        periodLabels = Array.from({ length: 4 }, (_, i) => {
          return `Week ${i + 1}`;
        });
        break;
      case "quarter":
        periodStart = subMonths(new Date(), 3);
        // Monthly labels for the past quarter
        periodLabels = Array.from({ length: 3 }, (_, i) => {
          const date = subMonths(new Date(), 2 - i);
          return format(date, "MMM");
        });
        break;
      case "year":
        periodStart = subYears(new Date(), 1);
        // Monthly labels for the past year
        periodLabels = Array.from({ length: 12 }, (_, i) => {
          const date = subMonths(new Date(), 11 - i);
          return format(date, "MMM");
        });
        break;
      default:
        periodStart = subMonths(new Date(), 1);
        // Default to monthly view with weekly labels
        periodLabels = Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`);
        break;
    }

    // Filter transactions for the selected period
    const periodTransactions = transactions.filter(
      (t) => new Date(t.date) >= periodStart
    );

    // Initialize arrays for income and expense data
    const incomeByPeriod = new Array(periodLabels.length).fill(0);
    const expenseByPeriod = new Array(periodLabels.length).fill(0);

    // Group transactions by period
    periodTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      let periodIndex = 0;

      switch (timeRange) {
        case "week":
          // Determine which day of the week (0-6)
          periodIndex =
            6 -
            differenceInDays(
              new Date(),
              new Date(transactionDate.setHours(0, 0, 0, 0))
            );
          break;
        case "month":
          // Determine which week of the month (0-3)
          periodIndex = Math.min(
            3,
            Math.floor(
              differenceInDays(
                new Date(),
                new Date(transactionDate.setHours(0, 0, 0, 0))
              ) / 7
            )
          );
          break;
        case "quarter":
          // Determine which month of the quarter (0-2)
          periodIndex = Math.min(
            2,
            Math.floor(
              differenceInDays(
                new Date(),
                new Date(transactionDate.setHours(0, 0, 0, 0))
              ) / 30
            )
          );
          break;
        case "year":
          // Determine which month of the year (0-11)
          periodIndex = Math.min(
            11,
            Math.floor(
              differenceInDays(
                new Date(),
                new Date(transactionDate.setHours(0, 0, 0, 0))
              ) / 30
            )
          );
          break;
      }

      // Add value to appropriate period
      if (periodIndex >= 0 && periodIndex < periodLabels.length) {
        if (transaction.type === "INCOME") {
          incomeByPeriod[periodIndex] += parseFloat(transaction.amount);
        } else {
          expenseByPeriod[periodIndex] += parseFloat(transaction.amount);
        }
      }
    });

    setMonthlyData({
      labels: periodLabels,
      income: incomeByPeriod,
      expense: expenseByPeriod,
    });
  };

  // Add function to fetch total account balance
  const fetchTotalAccountBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await AccountService.getTotalBalance();
      setTotalAccountBalance(parseFloat(response.data.totalBalance));
      setBalanceLoading(false);
    } catch (err) {
      console.error("Error fetching total account balance:", err);
      setBalanceLoading(false);
      // We don't want to set error state here to avoid overriding transaction errors
    }
  };

  // Fetch transaction data from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await TransactionService.getTransactions();
      const allTransactions = response.data;

      // Sort transactions by date (most recent first)
      const sortedTransactions = [...allTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(sortedTransactions);

      // Calculate totals
      const income = sortedTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const expense = sortedTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      setIncomeTotal(income);
      setExpenseTotal(expense);

      // Get recent transactions (last 5)
      setRecentTransactions(sortedTransactions.slice(0, 5));

      // Prepare data for category chart
      const categoryTotals = sortedTransactions.reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = {
            category: t.category,
            income: 0,
            expense: 0,
          };
        }

        if (t.type === "INCOME") {
          acc[t.category].income += parseFloat(t.amount);
        } else {
          acc[t.category].expense += parseFloat(t.amount);
        }

        return acc;
      }, {});

      setCategoryData(Object.values(categoryTotals));
      
      // Loading is now complete after data is processed
      setLoading(false);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
      console.error("Error fetching transactions:", err);
    }
  };

  // Event handlers for UI controls
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeCategoryView = (event, newView) => {
    if (newView !== null) {
      setCategoryView(newView);
    }
  };

  const handleChangeChartType = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
      // Reset to 'all' view when switching to pie chart
      if (newType === "pie" && categoryView === "all") {
        setCategoryView("income");
      }
    }
  };

  const handleChangeTimeRange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  // Helper function to calculate days before today
  const subDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  // Memoize the chart data to prevent unnecessary re-renders
  const chartDisplayData = useMemo(() => {
    return chartData;
  }, [chartData]);
  
  const monthlyDisplayData = useMemo(() => {
    return monthlyData;
  }, [monthlyData]);

  // Loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
      >
        {t('dashboard.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('dashboard.welcomeBack')}, {currentUser?.fullName || currentUser?.username || t('dashboard.user')}
      </Typography>

      <Divider sx={{ my: { xs: 2, sm: 3 } }} />

      <Box>
        {/* Add the SpendingAlert component at the top of the dashboard */}
        <SpendingAlert />
        
        {/* Rest of the dashboard */}
        <Grid container spacing={3}>
          {/* Summary Cards for Income, Expense, Balance */}
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 4 } }}>
            {/* Income Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  background: `linear-gradient(135deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
                  color: "white",
                  boxShadow: `0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px ${theme.palette.success.main}40`,
                }}
                elevation={3}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <IncomeIcon sx={{ mr: 1, color: "white" }} />
                  <Typography variant="h6" component="div" color="white">
                    {t('dashboard.income')}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                  }}
                >
                  ${incomeTotal.toFixed(2)}
                </Typography>
              </Paper>
            </Grid>

            {/* Expense Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  background: `linear-gradient(135deg, ${theme.palette.error.light}, ${theme.palette.error.main})`,
                  color: "white",
                  boxShadow: `0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px ${theme.palette.error.main}40`,
                }}
                elevation={3}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <ExpenseIcon sx={{ mr: 1, color: "white" }} />
                  <Typography variant="h6" component="div" color="white">
                    {t('dashboard.expenses')}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                  }}
                >
                  ${expenseTotal.toFixed(2)}
                </Typography>
              </Paper>
            </Grid>

            {/* Balance Card - Updated to use account balance */}
            <Grid item xs={12} sm={12} md={4}>
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  background: `linear-gradient(135deg, ${
                    totalAccountBalance >= 0
                      ? `${theme.palette.primary.light}, ${theme.palette.primary.main}`
                      : `${theme.palette.warning.light}, ${theme.palette.warning.main}`
                  })`,
                  color: "white",
                  boxShadow: `0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px ${
                    totalAccountBalance >= 0
                      ? theme.palette.primary.main
                      : theme.palette.warning.main
                  }40`,
                }}
                elevation={3}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <BalanceIcon sx={{ mr: 1, color: "white" }} />
                  <Typography variant="h6" component="div" color="white">
                    {t('dashboard.balance')}
                  </Typography>
                </Box>
                {balanceLoading ? (
                  <Box display="flex" justifyContent="center" my={1}>
                    <CircularProgress size={28} sx={{ color: "white" }} />
                  </Box>
                ) : (
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                    }}
                  >
                    ${totalAccountBalance.toFixed(2)}
                  </Typography>
                )}
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", mt: 1 }}>
                  {t('accounts.totalBalance')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Tabs for switching between views */}
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            variant={isMobile ? "fullWidth" : "standard"}
            centered={!isMobile}
            sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label={t('dashboard.summary')} />
            <Tab label={t('reports.trendsOverTime')} />
          </Tabs>

          {/* Financial Summary Tab */}
          {tabValue === 0 && (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Category Chart */}
              <Grid item xs={12} lg={6}>
                <Paper sx={{ p: { xs: 2, sm: 3 }, height: "100%" }} elevation={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: isMobile ? "wrap" : "nowrap",
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6" gutterBottom={isMobile}>
                      {chartType === "pie"
                        ? categoryView === "income"
                          ? t('reports.incomeByCategory')
                          : t('reports.expenseByCategory')
                        : t('reports.incomeVsExpense')}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        width: isMobile ? "100%" : "auto",
                        justifyContent: isMobile ? "space-between" : "flex-end",
                      }}
                    >
                      {/* Chart Type Toggle */}
                      <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={handleChangeChartType}
                        aria-label="chart type"
                        size={isMobile ? "small" : "medium"}
                      >
                        <ToggleButton value="bar" aria-label="bar chart">
                          <BarChartIcon fontSize="small" />
                        </ToggleButton>
                        <ToggleButton value="pie" aria-label="pie chart">
                          <DonutIcon fontSize="small" />
                        </ToggleButton>
                      </ToggleButtonGroup>

                      {/* Category View Toggle */}
                      <ToggleButtonGroup
                        value={categoryView}
                        exclusive
                        onChange={handleChangeCategoryView}
                        aria-label="category view"
                        size={isMobile ? "small" : "medium"}
                      >
                        {chartType !== "pie" && (
                          <ToggleButton value="all" aria-label="all">
                            {t('transactions.allTypes')}
                          </ToggleButton>
                        )}
                        <ToggleButton value="income" aria-label="income">
                          {t('transactions.income')}
                        </ToggleButton>
                        <ToggleButton value="expense" aria-label="expense">
                          {t('transactions.expense')}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  </Box>

                  {/* Chart Visualization */}
                  {categoryData.length > 0 ? (
                    <Box
                      sx={{
                        height: { xs: 300, sm: 350, md: 400 },
                        mt: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {chartType === "bar" && (
                        <DashboardBarChart
                          data={chartDisplayData} // Use memoized data
                          title=""
                          height={isMobile ? 280 : 350}
                          showLegend={true}
                          stacked={false}
                          horizontal={false}
                          showGradient={true}
                          currency={"$"}
                        />
                      )}
                      {chartType === "pie" && (
                        <DashboardPieChart
                          data={chartDisplayData} // Use memoized data
                          title=""
                          height={isMobile ? 280 : 350}
                          isDoughnut={true}
                          showLegend={true}
                          showLabels={!isMobile}
                          currency="$"
                        />
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 5 }}>
                      <Typography color="text.secondary">
                        {t('reports.noData')}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Recent Transactions */}
              <Grid item xs={12} lg={6}>
                <Paper sx={{ p: { xs: 2, sm: 3 }, height: "100%" }} elevation={2}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6">{t('dashboard.recentTransactions')}</Typography>
                    <Link to="/app/transactions" style={{ textDecoration: "none" }}>
                      <Typography color="primary" variant="body2">
                        {t('dashboard.viewAll')}
                      </Typography>
                    </Link>
                  </Box>
                  <TableContainer sx={{ overflowX: "auto" }}>
                    <Table
                      size={isMobile ? "small" : "medium"}
                      sx={{ minWidth: isMobile ? 400 : 650 }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('transactions.description')}</TableCell>
                          <TableCell>{t('transactions.amount')}</TableCell>
                          {!isMobile && <TableCell>{t('transactions.category')}</TableCell>}
                          <TableCell>{t('transactions.date')}</TableCell>
                          <TableCell>{t('transactions.type')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentTransactions.map((transaction) => (
                          <TableRow key={transaction.id} hover>
                            <TableCell
                              sx={{
                                maxWidth: { xs: 80, sm: 150 },
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {transaction.description}
                            </TableCell>
                            <TableCell
                              sx={{
                                color:
                                  transaction.type === "INCOME"
                                    ? "success.main"
                                    : "error.main",
                                fontWeight: "medium",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {transaction.type === "INCOME" ? "+" : "-"} $
                              {parseFloat(transaction.amount).toFixed(2)}
                            </TableCell>
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
                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                              {new Date(transaction.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={transaction.type === "INCOME" 
                                  ? t('transactions.income') 
                                  : t('transactions.expense')}
                                size="small"
                                color={
                                  transaction.type === "INCOME"
                                    ? "success"
                                    : "error"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {recentTransactions.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={isMobile ? 4 : 5} align="center">
                              <Typography color="text.secondary" py={2}>
                                {t('dashboard.noTransactions')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Trends Over Time Tab */}
          {tabValue === 1 && (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Time Series Chart */}
              <Grid item xs={12}>
                <Paper sx={{ p: { xs: 2, sm: 3 } }} elevation={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: isMobile ? "wrap" : "nowrap",
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6" gutterBottom={isMobile}>
                      {t('reports.financialTrends')}
                    </Typography>

                    <ToggleButtonGroup
                      value={timeRange}
                      exclusive
                      onChange={handleChangeTimeRange}
                      aria-label="time range"
                      size={isMobile ? "small" : "medium"}
                      sx={{ mt: isMobile ? 1 : 0 }}
                    >
                      <ToggleButton value="week" aria-label="week">
                        {t('reports.week')}
                      </ToggleButton>
                      <ToggleButton value="month" aria-label="month">
                        {t('reports.month')}
                      </ToggleButton>
                      <ToggleButton value="quarter" aria-label="quarter">
                        {t('reports.quarter')}
                      </ToggleButton>
                      <ToggleButton value="year" aria-label="year">
                        {t('reports.year')}
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <Box sx={{ height: isMobile ? 300 : 400, mt: 2 }}>
                    <DashboardLineChart
                      data={[
                        {
                          label: t('dashboard.income'),
                          data: monthlyDisplayData.income, // Use memoized data
                          color: chartColors.income,
                        },
                        {
                          label: t('dashboard.expenses'),
                          data: monthlyDisplayData.expense, // Use memoized data
                          color: chartColors.expense,
                        },
                      ]}
                      labels={monthlyDisplayData.labels} // Use memoized data
                      title=""
                      height={isMobile ? 280 : 380}
                      showLegend={true}
                      fillArea={true}
                      tension={0.4}
                      currency="$"
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Top Income Sources Pie Chart */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('reports.topIncomeSources')}
                    </Typography>
                    <Box sx={{ height: 250 }}>
                      <DashboardPieChart
                        data={categoryData
                          .filter((cat) => cat.income > 0)
                          .sort((a, b) => b.income - a.income)
                          .slice(0, 5)
                          .map((cat, index) => ({
                            label: cat.category,
                            value: cat.income,
                            color:
                              chartColors.categoryColors[
                                index % chartColors.categoryColors.length
                              ],
                            type: t('transactions.income'),
                          }))}
                        height={250}
                        isDoughnut={false}
                        showLegend={true}
                        currency="$"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Top Expenses Pie Chart */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('reports.topExpenses')}
                    </Typography>
                    <Box sx={{ height: 250 }}>
                      <DashboardPieChart
                        data={categoryData
                          .filter((cat) => cat.expense > 0)
                          .sort((a, b) => b.expense - a.expense)
                          .slice(0, 5)
                          .map((cat, index) => ({
                            label: cat.category,
                            value: cat.expense,
                            color:
                              chartColors.categoryColors[
                                index % chartColors.categoryColors.length
                              ],
                            type: t('transactions.expense'),
                          }))}
                        height={250}
                        isDoughnut={false}
                        showLegend={true}
                        currency="$"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
