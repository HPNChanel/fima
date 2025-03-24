import React, { useState, useEffect, useContext } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useScrollTrigger,
  Badge,
  useMediaQuery,
  Menu,
  MenuItem,
  Fab,
  Tooltip,
  alpha,
  ListItemButton,
  Avatar,
  ButtonGroup
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Menu as MenuIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Translate as TranslateIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../../App';
import { motion, AnimatePresence } from 'framer-motion';

// Scroll to top button component
function ScrollToTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 999
          }}
        >
          <Tooltip title="Scroll to top">
            <Fab 
              color="primary" 
              size="medium" 
              aria-label="scroll to top"
              onClick={handleClick}
              sx={{
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(0,118,255,0.39)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const LandingHeader = ({ darkMode, toggleDarkMode, language }) => {
  const theme = useTheme();
  const { changeLanguage } = useContext(AppContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerStyle, setHeaderStyle] = useState({
    transparent: true,
    elevated: false
  });
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeSection, setActiveSection] = useState('');

  // Main navigation items
  const navItems = [
    { id: 'features', name: language === 'vi' ? 'Tính Năng' : 'Features', href: '#features' },
    { id: 'functionality', name: language === 'vi' ? 'Chức Năng' : 'Functionality', href: '#functionality' },
    { id: 'screenshots', name: language === 'vi' ? 'Ảnh Chụp' : 'Screenshots', href: '#screenshots' },
    // { id: 'roadmap', name: language === 'vi' ? 'Lộ Trình' : 'Roadmap', href: '#roadmap' },
    { id: 'team', name: language === 'vi' ? 'Đội Ngũ' : 'Team', href: '#team' }
  ];

  // Handle scroll to change header background and detect active section
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      const isElevated = window.scrollY > 80;

      setHeaderStyle({
        transparent: !isScrolled,
        elevated: isElevated
      });

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 100;
      
      // Find the section that is currently in view
      const sections = navItems.map(item => {
        const element = document.querySelector(item.href);
        if (element) {
          const position = element.offsetTop;
          const height = element.offsetHeight;
          return {
            id: item.id,
            position,
            height
          };
        }
        return null;
      }).filter(Boolean);
      
      const currentSection = sections.find(section => 
        scrollPosition >= section.position && 
        scrollPosition < section.position + section.height
      );
      
      if (currentSection) {
        setActiveSection(currentSection.id);
      } else if (scrollPosition < (sections[0]?.position || 0)) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLangMenuOpen = (event) => {
    setLangMenuAnchor(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangMenuAnchor(null);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleLangMenuClose();
  };

  const scrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
      const headerHeight = 70; // Approximate header height
      const sectionPosition = section.offsetTop - headerHeight;
      
      window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
      });
    }
    setDrawerOpen(false);
  };

  const appBarStyles = {
    ...(headerStyle.transparent ? {
      background: 'transparent',
      boxShadow: 'none',
    } : {
      background: theme.palette.mode === 'dark' 
        ? alpha(theme.palette.background.paper, 0.92)
        : alpha(theme.palette.background.paper, 0.98),
      boxShadow: headerStyle.elevated 
        ? '0 4px 20px rgba(0,0,0,0.08)' 
        : 'none',
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
    }),
    transition: 'all 0.3s ease',
    backdropFilter: headerStyle.transparent ? 'none' : 'blur(10px)',
    zIndex: theme.zIndex.drawer + 1
  };

  const logoTextColor = headerStyle.transparent
    ? (theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.primary.main)
    : theme.palette.primary.main;

  return (
    <>
      <AppBar 
        position="fixed"
        elevation={0}
        sx={appBarStyles}
      >
        <Container maxWidth="lg">
          <Toolbar 
            disableGutters 
            sx={{ 
              minHeight: { xs: 64, md: 70 },
              py: 0.5,
              px: { xs: 2, md: 0 }
            }}
          >
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mr: 3
              }}
            >
              
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: logoTextColor,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                FINANCE APP
              </Typography>
            </Box>

            {/* Desktop navigation menu */}
            <Box 
              sx={{ 
                flexGrow: 1, 
                display: { xs: 'none', md: 'flex' }, 
                justifyContent: 'center',
                ml: 2
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    mx: 1,
                    px: 1.5,
                    py: 1,
                    color: activeSection === item.id 
                      ? theme.palette.primary.main 
                      : headerStyle.transparent
                        ? (theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary')
                        : 'text.primary',
                    fontWeight: activeSection === item.id ? 700 : 500,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 8,
                      left: '50%',
                      width: activeSection === item.id ? '20px' : '0px',
                      height: '3px',
                      bgcolor: 'primary.main',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                      borderRadius: '2px'
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      '&::after': {
                        width: activeSection === item.id ? '30px' : '20px'
                      }
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Right side actions */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              ml: 'auto'
            }}>
              {/* Language selector */}
              <Tooltip title={language === 'vi' ? 'Chuyển ngôn ngữ' : 'Change language'}>
                <Button
                  onClick={handleLangMenuOpen}
                  color="inherit"
                  size="small"
                  sx={{ 
                    minWidth: 0,
                    borderRadius: 2,
                    py: 0.5,
                    px: 1,
                    mr: 1,
                    color: headerStyle.transparent
                      ? (theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary')
                      : 'text.primary',
                    typography: 'body2',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08)
                    }
                  }}
                  endIcon={<TranslateIcon fontSize="small" />}
                >
                  {language === 'en' ? 'EN' : 'VI'}
                </Button>
              </Tooltip>
              <Menu
                anchorEl={langMenuAnchor}
                open={Boolean(langMenuAnchor)}
                onClose={handleLangMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 120,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }
                }}
              >
                <MenuItem 
                  onClick={() => handleLanguageChange('en')} 
                  selected={language === 'en'}
                  sx={{ py: 1.5, typography: 'body2' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {language === 'en' && (
                      <Box sx={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        mr: 1 
                      }} />
                    )}
                    English
                  </Box>
                </MenuItem>
                <MenuItem 
                  onClick={() => handleLanguageChange('vi')} 
                  selected={language === 'vi'}
                  sx={{ py: 1.5, typography: 'body2' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {language === 'vi' && (
                      <Box sx={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        mr: 1 
                      }} />
                    )}
                    Tiếng Việt
                  </Box>
                </MenuItem>
              </Menu>

              {/* Dark mode toggle */}
              <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton 
                  onClick={toggleDarkMode} 
                  color="inherit"
                  sx={{ 
                    color: headerStyle.transparent
                      ? (theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary')
                      : 'text.primary',
                    mr: { xs: 0, sm: 1 }
                  }}
                >
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              {/* Login/Register buttons - visible on non-mobile */}
              {!isSmallScreen && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  ml: 1
                }}>
                  <ButtonGroup 
                    variant="contained" 
                    aria-label="login button group"
                    sx={{ 
                      boxShadow: 'none',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}
                  >
                    <Button 
                      component={RouterLink} 
                      to="/login"
                      variant="outlined"
                      color="primary"
                      sx={{ 
                        py: 0.85,
                        px: 2,
                        borderRadius: '20px 0 0 20px',
                        fontWeight: 600,
                        borderRight: 0,
                        textTransform: 'none',
                        borderColor: headerStyle.transparent ? 
                          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : theme.palette.primary.main 
                          : theme.palette.primary.main,
                        color: headerStyle.transparent ? 
                          theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.primary.main 
                          : theme.palette.primary.main
                      }}
                    >
                      {language === 'vi' ? 'Đăng Nhập' : 'Login'}
                    </Button>
                    <Button 
                      component={RouterLink} 
                      to="/register"
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      sx={{ 
                        py: 0.85,
                        px: 2,
                        borderRadius: '0 20px 20px 0',
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      {language === 'vi' ? 'Đăng Ký' : 'Register'}
                    </Button>
                  </ButtonGroup>
                </Box>
              )}

              {/* Mobile menu button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ 
                  ml: 1, 
                  display: { md: 'none' },
                  color: headerStyle.transparent
                    ? (theme.palette.mode === 'dark' ? '#ffffff' : 'text.primary')
                    : 'text.primary'
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Add empty toolbar to ensure content doesn't hide under AppBar */}
      <Toolbar sx={{ mb: 1 }} />

      {/* Mobile drawer menu with improved animation */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        BackdropProps={{
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 320 },
            boxSizing: 'border-box',
            borderRadius: { xs: 0, sm: '12px 0 0 12px' },
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            height: { xs: '100%', sm: 'calc(100% - 32px)' },
            margin: { xs: 0, sm: '16px 0' }
          },
          zIndex: theme.zIndex.drawer + 2
        }}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          overflowY: 'auto' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              FINANCE APP
            </Typography>
            <IconButton onClick={handleDrawerToggle} edge="end" aria-label="close menu">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <List sx={{ width: '100%', pl: 1 }}>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    borderRadius: 2,
                    pl: 2,
                    pr: 3,
                    py: 1.5,
                    bgcolor: activeSection === item.id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12)
                    }
                  }}
                >
                  <ListItemText 
                    primary={item.name} 
                    primaryTypographyProps={{ 
                      fontWeight: activeSection === item.id ? 700 : 500,
                      color: activeSection === item.id ? 'primary.main' : 'text.primary'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 2, opacity: 0.7 }}>
              {language === 'vi' ? 'Tài khoản' : 'Account'}
            </Typography>
            
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                py: 1,
                mb: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {language === 'vi' ? 'Đăng Nhập' : 'Login'}
            </Button>
            
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="primary"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
              }}
            >
              {language === 'vi' ? 'Đăng Ký Ngay' : 'Register Now'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              px: 2
            }}>
              <Button
                onClick={handleLangMenuOpen}
                startIcon={<TranslateIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  color: 'text.secondary'
                }}
              >
                {language === 'en' ? 'English' : 'Tiếng Việt'}
              </Button>
              
              <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton 
                  onClick={toggleDarkMode}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15)
                    }
                  }}
                >
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
            
            <Typography 
              variant="caption" 
              color="text.secondary" 
              align="center"
              sx={{ 
                display: 'block', 
                mt: 3,
                opacity: 0.6
              }}
            >
              © {new Date().getFullYear()} Finance App. {language === 'vi' ? 'Đã đăng ký Bản quyền.' : 'All rights reserved.'}
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Scroll to top button */}
      <ScrollToTop />
    </>
  );
};

export default LandingHeader;
