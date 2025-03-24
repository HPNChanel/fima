import React, { useState, useEffect, useContext } from 'react';
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
  LoginOutlined as LoginIcon
} from '@mui/icons-material';
import AuthService from '../services/auth.service';
import { AppContext } from '../App';
import { createTranslator } from '../utils/translations';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { setCurrentUser, language } = useContext(AppContext);
  const t = createTranslator(language);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // If user is already logged in, redirect to app dashboard
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      navigate('/app');
    }
  }, [navigate]);

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t('auth.usernameRequired')),
    password: Yup.string().required(t('auth.passwordRequired')),
  });

  const handleLogin = (formValue, { setSubmitting }) => {
    const { username, password } = formValue;
    setMessage('');
    setLoading(true);

    AuthService.login(username, password)
      .then((response) => {
        // After successful login, navigate to the app dashboard
        // Use window.location for a hard navigation to break any redirect loops
        window.location.href = '/app';
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
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
          : 'linear-gradient(to bottom right, #e3f2fd, #bbdefb)',
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
                {t('auth.welcomeBack')}
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                {t('auth.signInPrompt')}
              </Typography>
            </Box>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  {message && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {message}
                    </Alert>
                  )}
                  
                  <Box mb={3}>
                    <Field
                      as={TextField}
                      type="text"
                      name="username"
                      label={t('profile.username')}
                      placeholder={t('auth.usernamePlaceholder')}
                      variant="outlined"
                      fullWidth
                      autoFocus
                      error={touched.username && Boolean(errors.username)}
                      helperText={
                        <ErrorMessage name="username" component="span" />
                      }
                    />
                  </Box>

                  <Box mb={3}>
                    <Field
                      as={TextField}
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      label={t('passwordDialog.newPassword')}
                      placeholder={t('auth.passwordPlaceholder')}
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
                  </Box>

                  <Box sx={{ textAlign: 'right', mb: 2 }}>
                    <Link 
                      component={RouterLink} 
                      to="/forgot-password" 
                      variant="body2"
                      sx={{ 
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {t('auth.forgotPassword')}
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      py: 1.5, 
                      mb: 2,
                      fontWeight: 'bold',
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      }
                    }}
                    startIcon={<LoginIcon />}
                  >
                    {loading ? t('auth.signingIn') : t('auth.signIn')}
                  </Button>
                  
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('auth.or')}
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {t('auth.noAccount')}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="outlined"
                      color="primary"
                      sx={{ 
                        minWidth: '200px',
                        textTransform: 'none'
                      }}
                    >
                      {t('auth.createAccount')}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
        
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {t('auth.copyright').replace('{year}', new Date().getFullYear())}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
