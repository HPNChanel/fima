import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpendingGoalService from '../services/spending-goal.service';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Dashboard = () => {
  const [spendingGoals, setSpendingGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchSpendingGoals();
  }, []);

  const fetchSpendingGoals = async () => {
    try {
      setLoadingGoals(true);
      const response = await SpendingGoalService.getSpendingGoals();
      const topGoals = response.data
        .sort((a, b) => b.percentageUsed - a.percentageUsed)
        .slice(0, 3);
      setSpendingGoals(topGoals);
      setLoadingGoals(false);
    } catch (err) {
      console.error('Error fetching spending goals:', err);
      setLoadingGoals(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) {
      return theme.palette.error.main;
    } else if (percentage >= 80) {
      return theme.palette.warning.main;
    }
    return theme.palette.primary.main;
  };

  const formatCategory = (category) => {
    return category.charAt(0) + category.slice(1).toLowerCase();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Spending Goals
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => navigate('/app/spending-goals')}
            >
              View All
            </Button>
          </Box>
          
          {loadingGoals ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : spendingGoals.length === 0 ? (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                No spending goals set.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate('/app/spending-goals')}
              >
                Create a Goal
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, flex: 1 }}>
              {spendingGoals.map((goal) => {
                const percentage = Math.min(100, Math.max(0, goal.percentageUsed));
                const progressColor = getProgressColor(percentage);
                
                return (
                  <Box key={goal.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCategory(goal.category)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={percentage >= 80 ? progressColor : 'text.primary'}
                      >
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 5,
                        mb: 0.5,
                        bgcolor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: progressColor,
                          borderRadius: 5,
                        }
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(goal.amountSpent)} of {formatCurrency(goal.amountLimit)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;