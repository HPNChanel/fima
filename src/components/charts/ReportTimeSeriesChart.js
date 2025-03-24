import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area, 
  ComposedChart, Bar
} from 'recharts';

/**
 * Time Series Chart for Income and Expenses
 * 
 * @param {Object} props
 * @param {Array} props.data - Time series data
 * @param {string} props.chartType - Chart type (line, area, or bar)
 * @param {number} props.height - Chart height
 * @param {boolean} props.showBalance - Whether to show balance line
 */
const ReportTimeSeriesChart = ({ 
  data = [], 
  chartType = 'area', 
  height = 300,
  showBalance = true 
}) => {
  const theme = useTheme();
  
  // Format currency for tooltip and labels
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={`tooltip-${index}`} 
              variant="body2" 
              sx={{ 
                color: entry.name === 'Income' 
                  ? 'success.main' 
                  : entry.name === 'Expense' 
                    ? 'error.main' 
                    : 'primary.main'
              }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    
    return null;
  };
  
  // If no data, show a message
  if (data.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }
  
  // Render the appropriate chart type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke={theme.palette.success.main}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke={theme.palette.error.main}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              {showBalance && (
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                fill={theme.palette.success.light}
                stroke={theme.palette.success.main}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                fill={theme.palette.error.light}
                stroke={theme.palette.error.main}
                fillOpacity={0.6}
              />
              {showBalance && (
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill={theme.palette.success.main}
                barSize={20}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill={theme.palette.error.main}
                barSize={20}
              />
              {showBalance && (
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Box sx={{ width: '100%', height }}>
      <Typography variant="subtitle1" gutterBottom align="center">
        Income & Expenses Over Time
      </Typography>
      {renderChart()}
    </Box>
  );
};

export default ReportTimeSeriesChart;
