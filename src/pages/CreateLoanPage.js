import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Breadcrumbs, 
  Link as MuiLink, 
  Button 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CreateLoanForm from '../components/CreateLoanForm';

const CreateLoanPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button 
            component={Link} 
            to="/app/loans"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back to Loans
          </Button>
          
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/app/dashboard" color="inherit">
              Dashboard
            </MuiLink>
            <MuiLink component={Link} to="/app/loans" color="inherit">
              Loans
            </MuiLink>
            <Typography color="text.primary">Create New Loan</Typography>
          </Breadcrumbs>
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Loan
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Simulate taking a loan. Input the loan details to see the repayment schedule and interest calculations.
        </Typography>
        
        <CreateLoanForm />
      </Box>
    </Container>
  );
};

export default CreateLoanPage;
