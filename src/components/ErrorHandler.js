import React from 'react';
import { Box, Typography, Paper, Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorHandler = ({ error, resetErrorBoundary }) => {
  // Determine if it's a 404 error or another type
  const is404 = error?.response?.status === 404;
  const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;
  
  // Get available endpoints if they exist in the error response
  const availableEndpoints = error?.response?.data?.availableEndpoints || [];
  
  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          {is404 ? "404 - Not Found" : isAuthError ? "Authentication Error" : "Error"}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          {is404 
            ? "The requested resource could not be found."
            : isAuthError
              ? "You are not authorized to access this resource. Please log in again."
              : error?.message || "An unexpected error occurred. Please try again later."}
        </Typography>
      </Box>
      
      <Alert severity="error" sx={{ mb: 3 }}>
        {error?.response?.data?.message || error?.message || "Something went wrong."}
      </Alert>
      
      {is404 && availableEndpoints.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Available API Endpoints:
          </Typography>
          <ul>
            {availableEndpoints.map((endpoint, index) => (
              <li key={index}>
                <Typography variant="body2">{endpoint}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      )}
      
      <Box display="flex" justifyContent="center" mt={4}>
        <Button 
          variant="contained" 
          component={Link} 
          to="/app"
          sx={{ mr: 2 }}
        >
          Go to Dashboard
        </Button>
        {resetErrorBoundary && (
          <Button 
            variant="outlined" 
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ErrorHandler;
