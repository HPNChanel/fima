import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  alpha,
  Paper,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const HeroSection = ({ isMobile, isTablet, language }) => {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));

  // Simplified animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
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

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.3 }
    }
  };

  // Reduce particle count for better performance
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * (15 - 5) + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    animationDuration: Math.random() * (10 - 5) + 5
  }));

  return (
    <Box
      component="section"
      id="hero"
      sx={{
        position: 'relative',
        pt: { xs: '90px', sm: '110px', md: '130px' },
        pb: { xs: 8, sm: 10, md: 12 },
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.8)}, ${theme.palette.background.default})`
          : `linear-gradient(to bottom, ${alpha(theme.palette.primary.light, 0.05)}, ${theme.palette.background.default})`,
      }}
    >
      {/* Background particles - only shown on larger screens */}
      {!isMobile && particles.map((particle) => (
        <Box
          key={particle.id}
          sx={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float ${particle.animationDuration}s infinite ease-in-out`,
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0) translateX(0)',
              },
              '50%': {
                transform: 'translateY(20px) translateX(10px)',
              },
            },
          }}
        />
      ))}

      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" justifyContent="space-between">
          {/* Left content column */}
          <Grid item xs={12} md={6} lg={5}>
            <MotionBox
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              sx={{ position: 'relative', zIndex: 1 }}
            >
              <MotionTypography
                variant="h6"
                component="p"
                color="primary"
                fontWeight="medium"
                variants={itemVariants}
                sx={{ mb: 2 }}
              >
                {language === 'vi' ? 'Quản Lý Tài Chính Thông Minh' : 'Smart Financial Management'}
              </MotionTypography>
              
              <MotionTypography
                variant="h2"
                component="h1"
                fontWeight="bold"
                variants={itemVariants}
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.2
                }}
              >
                {language === 'vi' 
                  ? 'Kiểm Soát Tài Chính Cá Nhân của Bạn' 
                  : 'Take Control of Your Personal Finances'}
              </MotionTypography>
              
              <MotionTypography
                variant="h6"
                component="p"
                color="text.secondary"
                variants={itemVariants}
                sx={{ 
                  mb: 4, 
                  maxWidth: '90%',
                  lineHeight: 1.6
                }}
              >
                {language === 'vi'
                  ? 'Ứng dụng tài chính toàn diện giúp bạn quản lý chi tiêu, thiết lập mục tiêu tiết kiệm và theo dõi tài sản của mình.'
                  : 'A comprehensive finance app that helps you manage expenses, set savings goals, and track your assets.'}
              </MotionTypography>
              
              <MotionBox 
                variants={itemVariants} 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: 'wrap',
                  mb: { xs: 4, md: 0 }
                }}
              >
                <MotionButton
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="large"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  sx={{
                    px: 3,
                    py: 1.2,
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {language === 'vi' ? 'Bắt Đầu Miễn Phí' : 'Get Started — It\'s Free'}
                </MotionButton>
                
                
              </MotionBox>
              
              <MotionBox 
                variants={itemVariants}
                sx={{ 
                  mt: 4,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 3
                }}
              >
                {/* <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">50K+</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {language === 'vi' ? 'Người Dùng' : 'Users'}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  height: 40, 
                  width: 1, 
                  bgcolor: alpha(theme.palette.divider, 0.5) 
                }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">4.8/5</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {language === 'vi' ? 'Đánh Giá' : 'Rating'}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  height: 40, 
                  width: 1, 
                  bgcolor: alpha(theme.palette.divider, 0.5),
                  display: { xs: 'none', sm: 'block' }
                }} /> */}
                
                {/* <Box sx={{ 
                  textAlign: 'center',
                  display: { xs: 'none', sm: 'block' }
                }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {language === 'vi' ? 'Miễn Phí' : 'Free'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {language === 'vi' ? 'Bắt Đầu' : 'To Start'}
                  </Typography>
                </Box> */}
              </MotionBox>
            </MotionBox>
          </Grid>
          
          {/* Right image column - hide on small mobile devices */}
          <Grid item xs={12} md={6} sx={{ 
            display: { xs: isMobile ? 'none' : 'block', md: 'block' } 
          }}>
            <MotionBox
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              sx={{ 
                position: 'relative',
                textAlign: 'center'
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: 550,
                  mx: 'auto',
                  position: 'relative'
                }}
              >
                <Box
                  component="img"
                  src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/485856460_1382587226074344_1955489657113414670_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeETygCnhqs9lL35shcKkK2U62tgkjFTzXrra2CSMVPNesUQs-S1AZEhUcYW0SSra5Y5facdz1lJ2eOrtti23fsD&_nc_ohc=Depd4wzbvN8Q7kNvgFNfUaf&_nc_oc=AdkBE0m5rZ82amHEUagAPdTrxGnGB2MQGjA9H5SpuXW2oczP_WsPpeWJZ1YW9YEa1v4&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=R4aJxBmZkpgNumSKkvQsiQ&oh=00_AYELTTmyXkpr0qvA_uJN7VVmt6gMrlrgzg9NuTod4chJqg&oe=67E4300B"
                  alt="Finance App Dashboard"
                  width="100%"
                  height="auto"
                  sx={{
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />
              </Paper>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
