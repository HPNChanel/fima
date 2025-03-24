import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

/**
 * Category Bar Chart for Reports
 * 
 * @param {Object} props
 * @param {Array} props.data - Category data
 * @param {string} props.type - Chart type (expense or income)
 * @param {number} props.height - Chart height
 * @param {number} props.limit - Max categories to show
 */
const ReportCategoryChart = ({ 
  data = [], 
  type = 'expense',
  height = 300,
  limit = 5
}) => {
  const theme = useTheme();
  
  // Colors for the chart bars
  const colors = {
    expense: [
      theme.palette.error.light,
      theme.palette.error.main,
      theme.palette.error.dark,
      '#f44336', // red
      '#e57373', // light red
      '#c62828', // dark red
    ],
    income: [
      theme.palette.success.light,
      theme.palette.success.main,
      theme.palette.success.dark,
      '#4caf50', // green
      '#81c784', // light green
      '#2e7d32', // dark green
    ]
  };
  
  // Format currency for tooltip and labels
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Prepare data for the chart (sorted and limited)
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Sort data by amount
    const sortedData = [...data].sort((a, b) => b.amount - a.amount);
    
    // Limit to specified number of categories
    const limitedData = sortedData.slice(0, limit);
    
    // Calculate percentage for each category
    const totalAmount = sortedData.reduce((sum, item) => sum + item.amount, 0);
    
    return limitedData.map(item => ({
      ...item,
      percentage: ((item.amount / totalAmount) * 100).toFixed(1),
      formattedAmount: formatCurrency(item.amount)
    }));
  }, [data, limit]);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
          <Typography variant="subtitle2">{data.category}</Typography>
          <Typography variant="body2" color={type === 'expense' ? 'error.main' : 'success.main'}>
            {formatCurrency(data.amount)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data.percentage}% of total
          </Typography>
        </Box>
      );
    }
    
    return null;
  };
  
  // If no data, show a message
  if (chartData.length === 0) {
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
  
  return (
    <Box sx={{ width: '100%', height }}>
      <Typography variant="subtitle1" gutterBottom align="center">
        Top {type === 'expense' ? 'Expenses' : 'Income'} by Category
      </Typography>
      
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={formatCurrency} />
          <YAxis 
            dataKey="category" 
            type="category" 
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill={colors[type][1]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[type][index % colors[type].length]} />
            ))}
            <LabelList 
              dataKey="formattedAmount" 
              position="right" 
              style={{ fill: theme.palette.text.primary, fontSize: 12, fontWeight: 'bold' }} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ReportCategoryChart;
