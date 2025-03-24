import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Breadcrumbs, 
  Link as MuiLink,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import SavingsService from '../services/SavingsService';
import SavingsDetail from '../components/SavingsDetail';
import SavingsProjection from '../components/SavingsProjection';

const SavingsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [savings, setSavings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    fetchSavingsDetail();
  }, [id]);
  
  const fetchSavingsDetail = async () => {
    try {
      setLoading(true);
      const response = await SavingsService.getSavingsAccountById(id);
      setSavings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching savings account details:', err);
      setError('Failed to load savings account details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleUpdateSuccess = () => {
    fetchSavingsDetail();
  };
  
  return (
    <Container maxWidth="lg">
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
            <Typography color="text.primary">
              {loading ? 'Loading...' : (savings ? savings.name : 'Details')}
            </Typography>
          </Breadcrumbs>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Account Details" />
                <Tab label="Interest Projections" />
              </Tabs>
            </Box>
            
            {tabValue === 0 ? (
              <SavingsDetail 
                savings={savings} 
                onUpdate={handleUpdateSuccess} 
              />
            ) : (
              <SavingsProjection savingsId={id} />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default SavingsDetailPage;
