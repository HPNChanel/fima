import React, { useState, useEffect, useContext } from 'react';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../App';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import ScreenshotsSection from '../components/landing/ScreenshotsSection';
import TeamSection from '../components/landing/TeamSection';
import LandingFooter from '../components/landing/LandingFooter';
import LandingHeader from '../components/landing/LandingHeader';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { darkMode, toggleDarkMode } = useContext(AppContext);
  
  // Handle scroll animations
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      <CssBaseline />
      
      {/* Header with navigation and dark mode toggle */}
      <LandingHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Hero Section */}
      <HeroSection isMobile={isMobile} scrollPosition={scrollPosition} />
      
      {/* Features Section */}
      <FeaturesSection isMobile={isMobile} isTablet={isTablet} scrollPosition={scrollPosition} />
      
      {/* Screenshots Section */}
      <ScreenshotsSection isMobile={isMobile} scrollPosition={scrollPosition} />
      
      {/* Team Section */}
      <TeamSection isMobile={isMobile} scrollPosition={scrollPosition} />
      
      {/* Footer */}
      <LandingFooter />
    </Box>
  );
};

export default LandingPage;
