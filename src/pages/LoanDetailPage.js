import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Breadcrumbs, 
  Link as MuiLink,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import LoanService from '../services/LoanService';
import LoanDetail from '../components/LoanDetail';

const LoanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchLoanDetail();
  }, [id]);
  
  const fetchLoanDetail = async () => {
    try {
      setLoading(true);
      const response = await LoanService.getLoanById(id);
      setLoan(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching loan details:', err);
      setError('Failed to load loan details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateSuccess = () => {
    fetchLoanDetail();
  };
  
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
            <Typography color="text.primary">Details</Typography>
          </Breadcrumbs>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <LoanDetail loan={loan} onUpdate={handleUpdateSuccess} />
        )}
      </Box>
    </Container>
  );
};

export default LoanDetailPage;
