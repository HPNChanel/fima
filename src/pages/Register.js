import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  Grid
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAddAlt as RegisterIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import AuthService from '../services/auth.service';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      navigate('/');
    }
  }, [navigate]);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '' // Add fullName field
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Full name is required')
      .max(100, 'Full name must not exceed 100 characters'), // Add validation for fullName
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
  });

  const handleRegister = (formValue, { setSubmitting }) => {
    const { username, email, password, fullName } = formValue; // Include fullName
    setMessage('');
    setSuccessful(false);

    AuthService.register(username, email, password, fullName) // Add fullName parameter
      .then(response => {
        setMessage(response.data.message);
        setSuccessful(true);
        
        // Optional: Automatically redirect to login after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
        setSubmitting(false);
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: theme.palette.mode === 'dark'
          ? 'linear-gradient(to bottom right, #0a1929, #1a3b63)'
          : 'linear-gradient(to bottom right, #e8f5e9, #c8e6c9)',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Card 
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
            }
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Button
              component={RouterLink}
              to="/login"
              startIcon={<BackIcon />}
              sx={{ mb: 3 }}
            >
              Back to Login
            </Button>
            
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                Create Your Account
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Get started with your financial journey
              </Typography>
            </Box>

            {successful ? (
              <Box textAlign="center">
                <Alert severity="success" sx={{ mb: 3 }}>
                  {message}
                </Alert>
                <Typography variant="body1" paragraph>
                  Registration successful! You will be redirected to the login page shortly.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                >
                  Go to Login
                </Button>
              </Box>
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    {message && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {message}
                      </Alert>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          type="text"
                          name="fullName"
                          label="Full Name"
                          placeholder="Enter your full name"
                          variant="outlined"
                          fullWidth
                          autoFocus
                          error={touched.fullName && Boolean(errors.fullName)}
                          helperText={
                            <ErrorMessage name="fullName" component="span" />
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          type="text"
                          name="username"
                          label="Username"
                          placeholder="Choose a username"
                          variant="outlined"
                          fullWidth
                          error={touched.username && Boolean(errors.username)}
                          helperText={
                            <ErrorMessage name="username" component="span" />
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          type="email"
                          name="email"
                          label="Email"
                          placeholder="Enter your email"
                          variant="outlined"
                          fullWidth
                          error={touched.email && Boolean(errors.email)}
                          helperText={
                            <ErrorMessage name="email" component="span" />
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          label="Password"
                          placeholder="Create a password"
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleTogglePasswordVisibility}
                                  edge="end"
                                  aria-label="toggle password visibility"
                                  size="large"
                                >
                                  {showPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          error={touched.password && Boolean(errors.password)}
                          helperText={
                            <ErrorMessage name="password" component="span" />
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          label="Confirm Password"
                          placeholder="Confirm your password"
                          variant="outlined"
                          fullWidth
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={
                            <ErrorMessage name="confirmPassword" component="span" />
                          }
                        />
                      </Grid>
                    </Grid>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={isSubmitting}
                      sx={{ 
                        py: 1.5, 
                        mt: 3,
                        mb: 2,
                        fontWeight: 'bold',
                        boxShadow: 2,
                        '&:hover': {
                          boxShadow: 4,
                        }
                      }}
                      startIcon={<RegisterIcon />}
                    >
                      {isSubmitting ? 'Processing...' : 'Create Account'}
                    </Button>
                    
                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        OR
                      </Typography>
                    </Divider>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Already have an account?
                      </Typography>
                      <Button
                        component={RouterLink}
                        to="/login"
                        variant="outlined"
                        color="primary"
                        sx={{ 
                          minWidth: '200px',
                          textTransform: 'none'
                        }}
                      >
                        Sign In
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            )}
          </CardContent>
        </Card>
        
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Finance Management System
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
