import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  useTheme, 
  alpha,
  Grid 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const CallToActionSection = ({ isMobile, language }) => {
  const theme = useTheme();
  
  // Animation variants with fixed easing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  return (
    <Box
      component="section"
      id="cta"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        color: 'white'
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-5%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: alpha('#fff', 0.05),
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: alpha('#fff', 0.05),
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ textAlign: 'center' }}>
                <MotionTypography
                  variant="h2"
                  component="h2"
                  fontWeight="bold"
                  sx={{ mb: 3 }}
                  variants={itemVariants}
                >
                  {language === 'vi' 
                    ? 'Sẵn sàng kiểm soát tài chính của bạn?'
                    : 'Ready to Take Control of Your Finances?'}
                </MotionTypography>
                
                <MotionTypography
                  variant="h5"
                  sx={{ 
                    mb: 5,
                    maxWidth: 800,
                    mx: 'auto',
                    opacity: 0.9
                  }}
                  variants={itemVariants}
                >
                  {language === 'vi'
                    ? 'Đăng ký miễn phí ngay hôm nay và bắt đầu hành trình đến sự tự do tài chính của bạn.'
                    : 'Sign up for free today and start your journey to financial freedom.'}
                </MotionTypography>
                
                <MotionBox 
                  sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}
                  variants={itemVariants}
                >
                  <MotionButton
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="secondary"
                    size="large"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 12px 20px rgba(0,0,0,0.4)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                      textTransform: 'none'
                    }}
                  >
                    {language === 'vi' ? 'Đăng Ký Ngay' : 'Sign Up Now'}
                  </MotionButton>
                  
                  <MotionButton
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="large"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      borderColor: 'white',
                      color: 'white',
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: alpha('#fff', 0.1)
                      }
                    }}
                  >
                    {language === 'vi' ? 'Đăng Nhập' : 'Login'}
                  </MotionButton>
                </MotionBox>
              </Box>
            </Grid>
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default CallToActionSection;
