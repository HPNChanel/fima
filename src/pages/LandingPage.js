import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { Box, CssBaseline, useMediaQuery, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../App';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';

// Lazy-load sections to improve initial page load performance
const HeroSection = lazy(() => import('../components/landing/HeroSection'));
const FeaturesSection = lazy(() => import('../components/landing/FeaturesSection'));
const FunctionalityShowcaseSection = lazy(() => import('../components/landing/FunctionalityShowcaseSection'));
const ScreenshotsSection = lazy(() => import('../components/landing/ScreenshotsSection'));
const TestimonialsSection = lazy(() => import('../components/landing/TestimonialsSection'));
const ProductRoadmapSection = lazy(() => import('../components/landing/ProductRoadmapSection'));
const TeamSection = lazy(() => import('../components/landing/TeamSection'));
const CallToActionSection = lazy(() => import('../components/landing/CallToActionSection'));

// Loading fallback component
const SectionLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
    <CircularProgress />
  </Box>
);

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { darkMode, toggleDarkMode, language } = useContext(AppContext);
  
  // Throttled scroll position tracker
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollPosition(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Common props for all sections
  const sectionProps = {
    isMobile,
    isTablet,
    scrollPosition,
    language,
    darkMode
  };

  return (
    <Box sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden'
    }}>
      <CssBaseline />
      
      {/* Header with navigation */}
      <LandingHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} />
      
      <Suspense fallback={<SectionLoader />}>
        {/* Hero Section */}
        <HeroSection {...sectionProps} />
        
        {/* Features Section */}
        <FeaturesSection {...sectionProps} />
        
        {/* Functionality Showcase Section */}
        <FunctionalityShowcaseSection {...sectionProps} />
        
        {/* Screenshots Section */}
        <ScreenshotsSection {...sectionProps} />
        
        {/* Testimonials Section */}
        <TestimonialsSection {...sectionProps} />
        
        {/* Product Roadmap Section */}
        {/* <ProductRoadmapSection {...sectionProps} /> */}
        
        {/* Team Section */}
        <TeamSection {...sectionProps} />
        
        {/* Call to Action Section */}
        <CallToActionSection {...sectionProps} />
      </Suspense>
      
      {/* Footer */}
      <LandingFooter language={language} />
    </Box>
  );
};

export default LandingPage;
