import React, { useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';
import { AppContext } from '../../App';
import AuthService from '../../services/auth.service';

const LandingFooter = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useContext(AppContext);
  const currentYear = new Date().getFullYear();
  
  const handleStartClick = () => {
    // If already authenticated, go to app, otherwise to login
    const user = AuthService.getCurrentUser();
    if (user) {
      // Use window.location for a hard navigation
      window.location.href = '/app';
    } else {
      navigate('/login');
    }
  };
  
  // Footer links
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#' },
      { name: 'Demo', href: '#' },
      { name: 'Roadmap', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Team', href: '#team' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    legal: [
      { name: 'Terms', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Security', href: '#' }
    ]
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 8,
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.9)
          : alpha(theme.palette.primary.main, 0.03),
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
              Finance App
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
              Take control of your finances with our comprehensive 
              management system designed for clarity and efficiency.
            </Typography>
            <Box sx={{ mb: 3 }}>
              <IconButton
                aria-label="GitHub"
                color="inherit"
                sx={{ ml: -1 }}
                component="a"
                href="https://github.com"
                target="_blank"
                rel="noopener"
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                color="inherit"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                color="inherit"
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Product Links */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" sx={{ mb: 2 }}>
              Product
            </Typography>
            <List dense disablePadding>
              {footerLinks.product.map((link) => (
                <ListItem
                  key={link.name}
                  disableGutters
                  sx={{ py: 0.5 }}
                >
                  <Link href={link.href} color="inherit" underline="hover">
                    <ListItemText primary={link.name} />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Company Links */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" sx={{ mb: 2 }}>
              Company
            </Typography>
            <List dense disablePadding>
              {footerLinks.company.map((link) => (
                <ListItem
                  key={link.name}
                  disableGutters
                  sx={{ py: 0.5 }}
                >
                  <Link href={link.href} color="inherit" underline="hover">
                    <ListItemText primary={link.name} />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Legal Links */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" sx={{ mb: 2 }}>
              Legal
            </Typography>
            <List dense disablePadding>
              {footerLinks.legal.map((link) => (
                <ListItem
                  key={link.name}
                  disableGutters
                  sx={{ py: 0.5 }}
                >
                  <Link href={link.href} color="inherit" underline="hover">
                    <ListItemText primary={link.name} />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Newsletter Signup */}
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" sx={{ mb: 2 }}>
              Get Started
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ready to take control of your finances?
            </Typography>
            <Box 
              component="a"
              onClick={handleStartClick}
              sx={{ 
                color: 'primary.main',
                fontWeight: 'medium',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Start Using the App →
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Copyright and Credits */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Finance App. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            Made with <HeartIcon sx={{ mx: 0.5, fontSize: 16, color: 'error.main' }} /> by HPN Team
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingFooter;
