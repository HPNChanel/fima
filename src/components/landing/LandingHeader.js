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
  Slide,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../../App';
import AuthService from '../../services/auth.service';

// Hide AppBar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const LandingHeader = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentUser } = useContext(AppContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Change AppBar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleStartNowClick = () => {
    // If already authenticated, go to app, otherwise to login
    const user = AuthService.getCurrentUser();
    if (user) {
      // Use window.location for a hard navigation
      window.location.href = '/app';
    } else {
      navigate('/login');
    }
  };
  
  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Screenshots', href: '#screenshots' },
    { label: 'Team', href: '#team' },
    { label: 'Login', href: '/login' }
  ];
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
        Finance App
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label} component={item.href.startsWith('#') ? 'a' : RouterLink} to={!item.href.startsWith('#') ? item.href : undefined} href={item.href.startsWith('#') ? item.href : undefined}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem button onClick={handleStartNowClick}>
          <ListItemText primary="Start Now" sx={{ color: 'primary.main', fontWeight: 'bold' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={scrolled ? 4 : 0}
          sx={{ 
            backgroundColor: scrolled ? 'background.paper' : 'transparent',
            transition: 'background-color 0.3s ease'
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              {/* Logo */}
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  mr: 2,
                  display: 'flex',
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                Finance App
              </Typography>

              {/* Mobile menu icon */}
              {isMobile ? (
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              ) : (
                <>
                  {/* Desktop navigation */}
                  <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    {navItems.map((item) => (
                      <Button
                        key={item.label}
                        component={item.href.startsWith('#') ? 'a' : RouterLink}
                        to={!item.href.startsWith('#') ? item.href : undefined}
                        href={item.href.startsWith('#') ? item.href : undefined}
                        sx={{ mx: 1, color: 'text.primary' }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>
                  
                  {/* Call to action button */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleStartNowClick}
                      sx={{ 
                        ml: 2,
                        borderRadius: '28px',
                        px: 3
                      }}
                    >
                      Start Now
                    </Button>
                  </Box>
                </>
              )}
              
              {/* Dark mode toggle */}
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                sx={{ ml: 2 }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Toolbar offset for spacing */}
      <Toolbar id="back-to-top-anchor" />
    </>
  );
};

export default LandingHeader;
