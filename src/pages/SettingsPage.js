import React, { useContext } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Switch, 
  FormControlLabel, 
  Divider, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Stack,
  useTheme
} from '@mui/material';
import { 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { AppContext } from '../App';

const SettingsPage = () => {
  const theme = useTheme();
  const { darkMode, toggleDarkMode, language, setLanguage } = useContext(AppContext);
  
  const [alert, setAlert] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    
    // Show success message when language is changed
    setAlert({
      open: true,
      message: newLanguage === 'en' 
        ? 'Language changed to English' 
        : 'Đã chuyển ngôn ngữ sang Tiếng Việt',
      severity: 'success'
    });
  };
  
  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      open: false
    });
  };
  
  // Translations for this page
  const translations = {
    en: {
      title: 'Settings',
      subtitle: 'Customize your app experience',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      language: 'Language',
      selectLanguage: 'Select Language',
      english: 'English',
      vietnamese: 'Vietnamese'
    },
    vi: {
      title: 'Cài đặt',
      subtitle: 'Tùy chỉnh trải nghiệm ứng dụng của bạn',
      appearance: 'Giao diện',
      darkMode: 'Chế độ tối',
      language: 'Ngôn ngữ',
      selectLanguage: 'Chọn ngôn ngữ',
      english: 'Tiếng Anh',
      vietnamese: 'Tiếng Việt'
    }
  };
  
  // Get translations based on current language
  const t = translations[language || 'en'];
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t.subtitle}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              {darkMode ? 
                <LightModeIcon color="primary" sx={{ mr: 2 }} /> : 
                <DarkModeIcon color="primary" sx={{ mr: 2 }} />
              }
              <Typography variant="h6">{t.appearance}</Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={2} sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    color="primary"
                  />
                }
                label={t.darkMode}
              />
            </Stack>
          </Paper>
        </Grid>
        
        {/* Language Settings */}
        {/* <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <LanguageIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">{t.language}</Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ pl: 2 }}>
              <FormControl fullWidth sx={{ maxWidth: 300 }}>
                <InputLabel id="language-select-label">{t.selectLanguage}</InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={language || 'en'}
                  label={t.selectLanguage}
                  onChange={handleLanguageChange}
                >
                  <MenuItem value="en">{t.english}</MenuItem>
                  <MenuItem value="vi">{t.vietnamese}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid> */}
      </Grid>
      
      {/* Alert Snackbar */}
      <Snackbar open={alert.open} autoHideDuration={4000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;
