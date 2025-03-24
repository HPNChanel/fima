import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Rating,
  useTheme,
  alpha,
  IconButton
} from '@mui/material';
import {
  FormatQuote as QuoteIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const TestimonialsSection = ({ isMobile, isTablet, scrollPosition, language }) => {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'Small Business Owner',
      rating: 5,
      text: language === 'vi' 
        ? 'Ứng dụng này đã giúp tôi kiểm soát dòng tiền kinh doanh của mình hiệu quả hơn. Giao diện rất dễ sử dụng và các báo cáo đem lại góc nhìn rõ ràng về tài chính của tôi.'
        : 'This app has completely transformed how I manage my business cash flow. The interface is intuitive and the reports give me clear insights into my finances.'
    },
    {
      id: 2,
      name: 'David Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Freelance Developer',
      rating: 5,
      text: language === 'vi'
        ? 'Tôi đã sử dụng nhiều ứng dụng quản lý tài chính khác nhau nhưng ứng dụng này vượt trội hơn cả. Tính năng theo dõi mục tiêu tiết kiệm đã giúp tôi mua được ngôi nhà đầu tiên!'
        : 'I\'ve tried many finance apps but this one stands above the rest. The savings goal tracker helped me buy my first home!'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      role: 'Marketing Manager',
      rating: 4,
      text: language === 'vi'
        ? 'Tính năng nhật ký tài chính đã thay đổi cách tôi suy nghĩ về chi tiêu. Tôi có thể ghi lại suy nghĩ và cảm xúc về các quyết định tài chính của mình.'
        : 'The financial diary feature changed how I think about spending. I can record my thoughts and feelings about financial decisions.'
    },
    {
      id: 4,
      name: 'Michael Thompson',
      avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
      role: 'Graduate Student',
      rating: 5,
      text: language === 'vi'
        ? 'Ứng dụng hoàn hảo cho sinh viên như tôi đang cố gắng quản lý khoản vay sinh viên và chi phí sinh hoạt. Tôi đã tiết kiệm được hơn 15% kể từ khi bắt đầu sử dụng nó.'
        : 'Perfect app for students like me trying to manage student loans and living expenses. I\'ve saved over 15% since I started using it.'
    }
  ];
  
  const testimonialsToShow = isTablet ? 1 : 2;
  const totalSlides = Math.ceil(testimonials.length / testimonialsToShow);
  
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  // Simplified animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 }
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

  return (
    <Box
      id="testimonials"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.default, 0.6)
          : alpha(theme.palette.primary.light, 0.05)
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h6"
            component="p"
            color="primary"
            fontWeight="medium"
            sx={{ mb: 2 }}
          >
            {language === 'vi' ? 'Đánh Giá Của Người Dùng' : 'User Testimonials'}
          </Typography>
          
          <Typography
            variant="h3"
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              mb: 2 
            }}
          >
            {language === 'vi' ? 'Mọi Người Nói Gì Về Chúng Tôi' : 'What People Say About Us'}
          </Typography>
          
          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{ 
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            {language === 'vi' 
              ? 'Khám phá cách ứng dụng của chúng tôi đã giúp mọi người cải thiện tình hình tài chính của họ'
              : 'Discover how our app has helped people improve their financial situation'}
          </Typography>
        </Box>
        
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={4} justifyContent="center">
            {testimonials
              .slice(
                currentSlide * testimonialsToShow, 
                Math.min((currentSlide + 1) * testimonialsToShow, testimonials.length)
              )
              .map((testimonial) => (
                <Grid item xs={12} md={testimonialsToShow === 1 ? 10 : 6} key={testimonial.id}>
                  <MotionCard
                    variants={itemVariants}
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 8px 32px rgba(0,0,0,0.3)'
                        : '0 8px 32px rgba(0,0,0,0.1)',
                      position: 'relative',
                      overflow: 'visible',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.palette.mode === 'dark' 
                          ? '0 12px 40px rgba(0,0,0,0.4)'
                          : '0 12px 40px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 }, pb: '24px !important' }}>
                      <Box sx={{ mb: 4, mt: 1 }}>
                        <Box sx={{
                          position: 'absolute',
                          top: -20,
                          left: 30,
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1
                        }}>
                          <QuoteIcon 
                            sx={{ 
                              fontSize: 24, 
                              color: '#fff',
                              transform: 'rotate(180deg)'
                            }} 
                          />
                        </Box>
                        
                        <Rating 
                          value={testimonial.rating} 
                          readOnly 
                          precision={0.5}
                          sx={{ mb: 2 }}
                        />
                        <Typography 
                          variant="body1" 
                          color="text.secondary" 
                          sx={{ 
                            fontSize: { xs: '1rem', md: '1.1rem' }, 
                            fontStyle: 'italic',
                            lineHeight: 1.6
                          }}
                        >
                          "{testimonial.text}"
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          sx={{ 
                            width: { xs: 48, md: 56 }, 
                            height: { xs: 48, md: 56 },
                            border: `2px solid ${theme.palette.primary.main}`
                          }}
                        />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
          </Grid>
          
          {/* Navigation controls */}
          {totalSlides > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              gap: 2
            }}>
              <IconButton 
                onClick={handlePrev}
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  width: 44,
                  height: 44,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              
              <IconButton 
                onClick={handleNext}
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  width: 44,
                  height: 44,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          )}
        </MotionBox>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
