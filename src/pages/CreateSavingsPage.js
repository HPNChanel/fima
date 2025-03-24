import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Breadcrumbs, 
  Link as MuiLink,
  Paper,
  Button,
  Divider
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import SavingsForm from '../components/SavingsForm';

const CreateSavingsPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    // Navigate to savings list after successful creation
    navigate('/app/savings');
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button 
            component={Link} 
            to="/app/savings"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back to Savings
          </Button>
          
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/app" color="inherit">
              Dashboard
            </MuiLink>
            <MuiLink component={Link} to="/app/savings" color="inherit">
              Savings
            </MuiLink>
            <Typography color="text.primary">New Savings Account</Typography>
          </Breadcrumbs>
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Savings Account
        </Typography>
        
        <Paper sx={{ p: 3, mt: 2, mb: 4 }}>
          <Typography variant="body1" paragraph>
            Use this form to simulate opening a new savings account. You can select from different term options,
            interest rates, and initial deposit amounts to see how your money could grow over time.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <SavingsForm onSuccess={handleSuccess} />
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateSavingsPage;
