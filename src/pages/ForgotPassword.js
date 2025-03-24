import React, { useState, useContext } from 'react';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Snackbar, 
  Alert,
  useMediaQuery,
  Link as MuiLink
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LockReset as LockResetIcon,
  AlternateEmail as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { AppContext } from '../App';
import { createTranslator } from '../utils/translations';
import AuthService from '../services/auth.service';

const ForgotPassword = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { language } = useContext(AppContext);
  const t = createTranslator(language);
  
  // State
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Form validation states
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: ''
    };
    
    // Validate email
    if (!formData.email) {
      newErrors.email = t('auth.pleaseEnterEmail');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.validEmailRequired');
      valid = false;
    }
    
    // Validate passwords
    if (!formData.newPassword) {
      newErrors.password = t('auth.enterNewPassword');
      valid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.password = t('auth.passwordLength');
      valid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.password = t('passwordDialog.passwordsDontMatch');
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleResetPassword = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Call the reset password API
    AuthService.resetPassword(formData.email, formData.newPassword)
      .then(() => {
        setAlert({
          open: true,
          message: t('auth.passwordReset'),
          severity: 'success'
        });
        
        // Redirect to login after a delay
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
          
        setAlert({
          open: true,
          message: resMessage,
          severity: 'error'
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const handleAlertClose = () => {
    setAlert({
      ...alert,
      open: false
    });
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText', 
            p: 2, 
            borderRadius: '50%', 
            mb: 2 
          }}>
            <LockResetIcon fontSize="large" />
          </Box>
          
          <Typography component="h1" variant="h4" gutterBottom>
            {t('auth.resetPassword')}
          </Typography>
          
          <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('auth.resetPasswordSteps')}
          </Typography>
          
          <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2, width: '100%' }}>
            <TextField
              fullWidth
              label={t('auth.emailAddress')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            
            <TextField
              fullWidth
              label={t('passwordDialog.newPassword')}
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!!errors.password}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            
            <TextField
              fullWidth
              label={t('passwordDialog.confirmPassword')}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              margin="normal"
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              color="primary" 
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? t('actions.saving') : t('auth.resetPassword')}
            </Button>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              {t('auth.rememberPassword')}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
      
      {/* Alert Notification */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ForgotPassword;
