import React, { useState, useEffect } from 'react';
import { Alert, Typography, Box } from '@mui/material';
import { WarningAmber as WarningAmberIcon } from '@mui/icons-material';
import ReportService from '../services/report.service';

const SpendingAlert = () => {
  const [spendingData, setSpendingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpendingComparison = async () => {
      try {
        setLoading(true);
        const response = await ReportService.getSpendingComparison();
        setSpendingData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching spending comparison:', err);
        setError('Failed to fetch spending data');
        setLoading(false);
      }
    };

    fetchSpendingComparison();
  }, []);

  // Don't show anything while loading or if there's no data
  if (loading || !spendingData) return null;

  // Only show alert if spending has increased
  if (spendingData.percentageChange <= 0) return null;

  // Format percentage to one decimal place
  const formattedPercentage = Math.abs(spendingData.percentageChange).toFixed(1);

  return (
    <Alert 
      severity="warning" 
      icon={<WarningAmberIcon />}
      sx={{ mb: 3 }}
    >
      <Typography variant="body1">
        ⚠️ You are spending more than last month (+{formattedPercentage}%)
      </Typography>
      <Box sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
        This month: ${spendingData.currentMonthTotal.toFixed(2)} | Last month: ${spendingData.previousMonthTotal.toFixed(2)}
      </Box>
    </Alert>
  );
};

export default SpendingAlert;
