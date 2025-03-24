import React, { useContext } from 'react';
import { 
  Box, 
  Typography,
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Avatar
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Settings as SettingsIcon, 
  ExitToApp as LogoutIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import AuthService from '../services/auth.service';
import { createTranslator } from '../utils/translations';

const UserPanel = ({ anchorEl, open, handleClose }) => {
  const navigate = useNavigate();
  const { currentUser, language } = useContext(AppContext);
  
  // Create translator function for the selected language
  const t = createTranslator(language);
  
  const handleLogout = () => {
    handleClose();
    AuthService.logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/app/profile');
  };
  
  const handleSettingsClick = () => {
    handleClose();
    navigate('/app/settings');
  };
  
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        elevation: 3,
        sx: { 
          minWidth: 250,
          mt: 1.5,
          overflow: 'visible',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              mr: 2
            }}
          >
            {currentUser && currentUser.fullName 
              ? currentUser.fullName.charAt(0).toUpperCase() 
              : currentUser && currentUser.username 
                ? currentUser.username.charAt(0).toUpperCase() 
                : 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {currentUser ? (currentUser.fullName || currentUser.username) : 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize="small">
              {currentUser ? currentUser.email : 'user@example.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      <MenuItem onClick={handleProfileClick}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={t('userPanel.profile')} />
      </MenuItem>
      
      <MenuItem onClick={handleSettingsClick}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={t('userPanel.settings')} />
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={t('userPanel.signOut')} />
      </MenuItem>
    </Menu>
  );
};

export default UserPanel;
