import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
  useTheme
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const SpendingGoalCard = ({ goal, onDelete }) => {
  const theme = useTheme();
  
  // Determine color based on percentage used
  const getProgressColor = (percentage) => {
    if (percentage >= 100) {
      return theme.palette.error.main;
    } else if (percentage >= 80) {
      return theme.palette.warning.main;
    } else {
      return theme.palette.primary.main;
    }
  };
  
  // Format category name (e.g., "FOOD" -> "Food")
  const formatCategory = (category) => {
    return category.charAt(0) + category.slice(1).toLowerCase();
  };
  
  // Format period name (e.g., "MONTHLY" -> "Monthly")
  const formatPeriod = (period) => {
    return period.charAt(0) + period.slice(1).toLowerCase();
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate percentage, ensuring it's between 0-100
  const percentage = Math.min(100, Math.max(0, goal.percentageUsed));
  const progressColor = getProgressColor(percentage);
  
  return (
    <Card 
      elevation={3} 
      sx={{ 
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            {formatCategory(goal.category)}
          </Typography>
          <Tooltip title="Delete goal">
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => onDelete && onDelete(goal.id)}
              aria-label="delete goal"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          {formatPeriod(goal.period)} limit
        </Typography>
        
        <Box sx={{ mt: 2, mb: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                backgroundColor: progressColor,
                borderRadius: 5,
              }
            }} 
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">
            Spent: {formatCurrency(goal.amountSpent)}
          </Typography>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            color={percentage >= 80 ? progressColor : 'text.primary'}
          >
            {formatCurrency(goal.amountLimit)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
          <Typography 
            variant="body2" 
            fontWeight="bold"
            color={percentage >= 80 ? progressColor : 'text.primary'}
          >
            {percentage.toFixed(1)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SpendingGoalCard;
