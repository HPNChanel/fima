import React, { useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  PlayArrow as PlayIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AppContext } from '../../App';
import AuthService from '../../services/auth.service';
  
// Import dashboard preview from assets

// Wrap components in motion for animation
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const HeroSection = ({ isMobile, scrollPosition }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useContext(AppContext);
  
  // Calculate parallax effect
  const offsetY = scrollPosition * 0.4;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
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

  return (
    <Box 
      id="hero" 
      sx={{
        position: 'relative',
        height: { xs: 'auto', md: '100vh' },
        minHeight: { xs: '80vh', md: '600px' },
        display: 'flex',
        alignItems: 'center',
        background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.2)} 100%)`,
        overflow: 'hidden',
        pt: { xs: 4, md: 0 },
        pb: { xs: 8, md: 0 }
      }}
    >
      {/* Background elements (animated) */}
      <Box 
        sx={{ 
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        {/* Circles background elements */}
        <Box 
          sx={{
            position: 'absolute',
            top: -100 + offsetY * 0.2,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            zIndex: -1
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            bottom: -150 + offsetY * 0.5,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
            zIndex: -1
          }}
        />
      </Box>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <MotionTypography 
                variant="h2" 
                component="h1"
                variants={itemVariants}
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Finance Management System
              </MotionTypography>
              
              <MotionTypography 
                variant="h5" 
                color="text.secondary"
                variants={itemVariants}
                sx={{ mb: 4, maxWidth: 500 }}
              >
                Take control of your money with clarity & confidence.
              </MotionTypography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <MotionButton
                  variant="contained"
                  size="large"
                  variants={itemVariants}
                  onClick={handleStartNowClick}
                  endIcon={<TrendingUpIcon />}
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    borderRadius: '28px',
                    fontSize: '1rem'
                  }}
                >
                  Start Now
                </MotionButton>
                
                <MotionButton
                  variant="outlined"
                  size="large"
                  variants={itemVariants}
                  endIcon={<PlayIcon />}
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    borderRadius: '28px',
                    fontSize: '1rem'
                  }}
                >
                  View Demo
                </MotionButton>
              </Box>
              
              <MotionBox
                variants={itemVariants}
                sx={{ 
                  mt: 6, 
                  display: 'flex', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">Personal Finance</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: 'success.main',
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">Budget Tracking</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: 'secondary.main',
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">Financial Goals</Typography>
                </Box>
              </MotionBox>
            </MotionBox>
          </Grid>
          
          {/* <Grid item xs={12} md={6}>
            <MotionBox
              variants={itemVariants}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Paper
                elevation={6}
                sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transform: `translateY(${offsetY * -0.15}px)`,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  background: theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
              </Paper>
            </MotionBox>
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
