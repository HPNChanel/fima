import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SpendingGoalService from '../services/spending-goal.service';

const Analytics = () => {
  const [spendingGoals, setSpendingGoals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpendingGoals();
  }, []);

  const fetchSpendingGoals = async () => {
    try {
      const response = await SpendingGoalService.getSpendingGoals();
      setSpendingGoals(response.data);
    } catch (err) {
      console.error('Error fetching spending goals:', err);
    }
  };

  // Calculate insights about spending goals
  const spendingGoalInsights = useMemo(() => {
    if (!spendingGoals || spendingGoals.length === 0) {
      return null;
    }

    const totalGoals = spendingGoals.length;
    const goalsAtRisk = spendingGoals.filter(goal => goal.percentageUsed >= 80).length;
    const mostSpentCategory = [...spendingGoals]
      .sort((a, b) => b.percentageUsed - a.percentageUsed)[0];

    return {
      totalGoals,
      goalsAtRisk,
      riskPercentage: Math.round((goalsAtRisk / totalGoals) * 100),
      mostSpentCategory: mostSpentCategory ? {
        name: mostSpentCategory.category,
        percentage: mostSpentCategory.percentageUsed
      } : null
    };
  }, [spendingGoals]);

  return (
    <Grid container spacing={3}>
      {/* Add this to your JSX in the analytics insights section */}
      {spendingGoalInsights && (
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
            <Typography variant="h6" gutterBottom>
              Spending Goals
            </Typography>
            <Box sx={{ mt: 2, flex: 1 }}>
              <Typography variant="body2" paragraph>
                You have {spendingGoalInsights.totalGoals} active spending goals.
                {spendingGoalInsights.goalsAtRisk > 0 && (
                  <Typography 
                    component="span" 
                    color={spendingGoalInsights.riskPercentage > 50 ? "error" : "warning"}
                  >
                    {' '}{spendingGoalInsights.goalsAtRisk} goals ({spendingGoalInsights.riskPercentage}%) are at risk of being exceeded.
                  </Typography>
                )}
              </Typography>

              {spendingGoalInsights.mostSpentCategory && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="medium">
                    Highest Progress Category:
                  </Typography>
                  <Typography variant="body1" color="primary" fontWeight="bold">
                    {spendingGoalInsights.mostSpentCategory.name} 
                    ({Math.round(spendingGoalInsights.mostSpentCategory.percentage)}%)
                  </Typography>
                </Box>
              )}

              <Button 
                variant="outlined" 
                size="small" 
                fullWidth
                sx={{ mt: 'auto' }}
                onClick={() => navigate('/spending-goals')}
              >
                Manage Goals
              </Button>
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default Analytics;