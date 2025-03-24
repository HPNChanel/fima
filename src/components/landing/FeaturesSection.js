import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Icon,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Savings as SavingsIcon,
  SwapHoriz as SwapHorizIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const FeaturesSection = ({ isMobile, isTablet, language }) => {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Features data
  const features = [
    {
      icon: <DashboardIcon fontSize="large" />,
      title: language === 'vi' ? 'Bảng Điều Khiển Trực Quan' : 'Intuitive Dashboard',
      description: language === 'vi' 
        ? 'Theo dõi tài chính của bạn trong thời gian thực với biểu đồ và số liệu dễ đọc.'
        : 'Track your finances in real-time with easy-to-read charts and metrics.'
    },
    {
      icon: <TrendingUpIcon fontSize="large" />,
      title: language === 'vi' ? 'Báo Cáo & Phân Tích' : 'Reports & Analytics',
      description: language === 'vi'
        ? 'Hiểu rõ thói quen chi tiêu của bạn với báo cáo chi tiết và dự báo.'
        : 'Understand your spending habits with detailed reports and forecasts.'
    },
    {
      icon: <SavingsIcon fontSize="large" />,
      title: language === 'vi' ? 'Mục Tiêu Tiết Kiệm' : 'Savings Goals',
      description: language === 'vi'
        ? 'Đặt, theo dõi và đạt được mục tiêu tài chính của bạn với các công cụ trực quan.'
        : 'Set, track, and reach your financial goals with visual tools.'
    },
    {
      icon: <SwapHorizIcon fontSize="large" />,
      title: language === 'vi' ? 'Chuyển Khoản Dễ Dàng' : 'Easy Transfers',
      description: language === 'vi'
        ? 'Chuyển tiền giữa tài khoản một cách nhanh chóng và an toàn.'
        : 'Move money between accounts quickly and securely.'
    },
    {
      icon: <NotificationsIcon fontSize="large" />,
      title: language === 'vi' ? 'Thông Báo Thông Minh' : 'Smart Notifications',
      description: language === 'vi'
        ? 'Nhận thông báo về giao dịch, chi tiêu vượt quá giới hạn và các mục tiêu đã đạt được.'
        : 'Get alerted about transactions, budget overruns, and goals reached.'
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: language === 'vi' ? 'Bảo Mật Hàng Đầu' : 'Top-Tier Security',
      description: language === 'vi'
        ? 'Dữ liệu tài chính của bạn được mã hóa và bảo vệ bằng các biện pháp bảo mật tiên tiến.'
        : 'Your financial data is encrypted and protected with advanced security measures.'
    }
  ];
  
  // Fixed animation variants with standard easing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <Box
      component="section"
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.3)
          : alpha(theme.palette.background.paper, 0.5)
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h6"
            component="p"
            color="primary"
            fontWeight="medium"
            sx={{ mb: 2 }}
          >
            {language === 'vi' ? 'Tính Năng Chính' : 'Key Features'}
          </Typography>
          
          <Typography
            variant="h3"
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              mb: 2 
            }}
          >
            {language === 'vi' ? 'Mọi Thứ Bạn Cần để Quản Lý Tài Chính' : 'Everything You Need to Manage Finances'}
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
              ? 'Công cụ tài chính mạnh mẽ được thiết kế để đơn giản hóa cuộc sống tài chính của bạn'
              : 'Powerful financial tools designed to simplify your financial life'}
          </Typography>
        </Box>
        
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    boxShadow: theme.shadows[8]
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15 
                  }}
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    p: { xs: 1, sm: 2 },
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: theme.shadows[isLg ? 4 : 2]
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        mb: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    
                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
