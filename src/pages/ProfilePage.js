import React, { useState, useContext, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { AppContext } from '../App';
import AuthService from '../services/auth.service';
import { createTranslator } from '../utils/translations';

const ProfilePage = () => {
  const { currentUser, language } = useContext(AppContext);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for user profile data
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    fullName: '',
    joinDate: new Date()
  });
  
  // States for editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for alerts/notifications
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Initialize profile from current user
  useEffect(() => {
    if (currentUser) {
      setProfile({
        username: currentUser.username || '',
        email: currentUser.email || '',
        fullName: currentUser.fullName || '',
        joinDate: new Date(currentUser.createdAt || Date.now())
      });
      setEditedProfile({
        fullName: currentUser.fullName || ''
      });
    }
  }, [currentUser]);
  
  // Create translator function
  const t = createTranslator(language);
  
  // Handlers for editing profile
  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedProfile({
      fullName: profile.fullName
    });
  };
  
  const handleProfileChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSaveProfile = async () => {
    try {
      // In a real app, you would make an API call here
      // For now, we'll simulate a successful update
      setProfile({
        ...profile,
        fullName: editedProfile.fullName
      });
      
      setIsEditingProfile(false);
      setAlert({
        open: true,
        message: t('alerts.profileUpdated'),
        severity: 'success'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: t('alerts.profileUpdateFailed'),
        severity: 'error'
      });
    }
  };
  
  // Handlers for changing password
  const handleOpenPasswordDialog = () => {
    setIsChangingPassword(true);
  };
  
  const handleClosePasswordDialog = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleChangePassword = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({
        open: true,
        message: t('alerts.passwordsDontMatch'),
        severity: 'error'
      });
      return;
    }
    
    try {
      // Call the auth service to change the password
      await AuthService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      handleClosePasswordDialog();
      setAlert({
        open: true,
        message: t('alerts.passwordChanged'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setAlert({
        open: true,
        message: error.response?.data?.message || t('alerts.passwordChangeFailed'),
        severity: 'error'
      });
    }
  };
  
  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      open: false
    });
  };
  
  // If no user is found, show a message
  if (!currentUser) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" my={4}>User not found</Typography>
      </Container>
    );
  }
  
  const initials = profile.fullName ? profile.fullName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase();
  
  // Format join date
  const joinDate = profile.joinDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('profile.title')}</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<LockIcon />}
          onClick={handleOpenPasswordDialog}
        >
          {t('profile.changePassword')}
        </Button>
      </Box>
      
      <Paper elevation={2} sx={{ p: isSmall ? 2 : 3, mb: 4, borderRadius: 2 }}>
        {/* Profile header with display name */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5">{t('profile.personalInfo')}</Typography>
          {isEditingProfile ? (
            <Box>
              <IconButton color="primary" onClick={handleSaveProfile} sx={{ mr: 1 }}>
                <SaveIcon />
              </IconButton>
              <IconButton color="default" onClick={handleCancelEdit}>
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <IconButton color="primary" onClick={handleEditProfile}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
        
        <Box display="flex" alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }} mb={3}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: '3rem',
              fontWeight: 'bold',
              mb: { xs: 2, sm: 0 },
              mr: { sm: 4 }
            }}
          >
            {initials}
          </Avatar>
          
          <Box sx={{ width: '100%' }}>
            {isEditingProfile ? (
              <TextField
                fullWidth
                variant="outlined"
                label={t('profile.fullName')}
                name="fullName"
                value={editedProfile.fullName}
                onChange={handleProfileChange}
                margin="normal"
                helperText={t('profile.nameHelperText')}
              />
            ) : (
              <>
                <Typography variant="h4" gutterBottom>{profile.fullName || profile.username}</Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {profile.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('profile.memberSince')} {joinDate}
                </Typography>
              </>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" mb={2}>{t('profile.accountInfo')}</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('profile.fullName')}
                </Typography>
                <Typography variant="body1">{profile.fullName || t('profile.notProvided')}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('profile.username')}
                </Typography>
                <Typography variant="body1">{profile.username}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('profile.accountStatus')}
                </Typography>
                <Typography variant="body1">{t('profile.active')}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('profile.accountType')}
                </Typography>
                <Typography variant="body1">{t('profile.standard')}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Change Password Dialog */}
      <Dialog open={isChangingPassword} onClose={handleClosePasswordDialog}>
        <DialogTitle>{t('passwordDialog.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label={t('passwordDialog.currentPassword')}
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label={t('passwordDialog.newPassword')}
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label={t('passwordDialog.confirmPassword')}
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
              helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? t('passwordDialog.passwordsDontMatch') : ""}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>{t('passwordDialog.cancel')}</Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained" 
            color="primary"
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
          >
            {t('passwordDialog.updatePassword')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Snackbar */}
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
