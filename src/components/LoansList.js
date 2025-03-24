import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Grid, 
  LinearProgress 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const statusColors = {
  ACTIVE: 'primary',
  COMPLETED: 'success',
  DEFAULTED: 'error'
};

const LoansList = ({ loans }) => {
  if (!loans || loans.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="subtitle1" color="text.secondary">
          No loans found. Create a new loan to get started.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Grid container spacing={3}>
      {loans.map((loan) => (
        <Grid item xs={12} sm={6} md={4} key={loan.id}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" component="div" noWrap sx={{ maxWidth: '70%' }}>
                  {loan.name}
                </Typography>
                <Chip 
                  label={loan.status} 
                  color={statusColors[loan.status] || 'default'} 
                  size="small" 
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Amount: ${loan.amount.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interest: {loan.interestRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Term: {loan.durationMonths} months
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start Date: {format(new Date(loan.startDate), 'MMM d, yyyy')}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(loan.completionPercentage)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={loan.completionPercentage} 
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2">
                  Paid: ${loan.paidAmount?.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Remaining: ${loan.remainingBalance?.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                to={`/app/loans/${loan.id}`} 
                size="small" 
                color="primary"
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LoansList;
