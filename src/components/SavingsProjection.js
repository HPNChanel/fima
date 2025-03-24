import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import SavingsService from '../services/SavingsService';

const SavingsProjection = ({ savingsId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projection, setProjection] = useState(null);
  
  useEffect(() => {
    const fetchProjection = async () => {
      try {
        setLoading(true);
        const response = await SavingsService.getSavingsProjection(savingsId);
        setProjection(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching savings projection:', err);
        setError('Failed to load savings projection data');
      } finally {
        setLoading(false);
      }
    };
    
    if (savingsId) {
      fetchProjection();
    }
  }, [savingsId]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };
  
  const prepareChartData = () => {
    if (!projection || !projection.timeline) return [];
    
    return projection.timeline.map(entry => ({
      date: formatDate(entry.date),
      interest: parseFloat(entry.cumulativeInterest),
      total: parseFloat(entry.totalValue)
    }));
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
        {error}
      </Paper>
    );
  }
  
  if (!projection) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        No projection data available
      </Paper>
    );
  }
  
  const chartData = prepareChartData();
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Interest Projections
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Daily Interest
              </Typography>
              <Typography variant="h5">
                ${projection.dailyInterest}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Interest earned each day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Monthly Interest
              </Typography>
              <Typography variant="h5">
                ${projection.monthlyInterest}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Approximate monthly earnings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Yearly Interest
              </Typography>
              <Typography variant="h5">
                ${projection.yearlyInterest}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Estimated annual return
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">
              Growth Projection
            </Typography>
            <Chip 
              label={`Maturity Value: $${projection.finalAmount}`} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
          
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`} 
                  tick={{ fontSize: 12 }}
                />
                <RechartsTooltip 
                  formatter={(value) => [`$${value}`, null]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="Total Value" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="interest" 
                  name="Interest" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
      
      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Typography variant="subtitle1" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            Monthly Breakdown
          </Typography>
          <Divider />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Interest Earned</TableCell>
                <TableCell align="right">Total Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projection.timeline.map((entry, index) => (
                <TableRow key={index} hover>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell align="right">${entry.cumulativeInterest}</TableCell>
                  <TableCell align="right">${entry.totalValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SavingsProjection;
