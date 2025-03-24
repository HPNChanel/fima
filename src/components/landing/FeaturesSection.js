import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  alpha,
  useTheme
} from '@mui/material';
import {
  Assessment as ReportIcon,
  History as HistoryIcon,
  Flag as GoalIcon,
  CreditCard as CardIcon,
  ShowChart as ChartIcon,
  AccountBalance as AccountIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Animation wrapper
const MotionBox = motion(Box);
const MotionCard = motion(Card);

const FeaturesSection = ({ isTablet, isMobile, scrollPosition }) => {
  const theme = useTheme();
  
  // Features data
  const features = [
    {
      icon: <ReportIcon fontSize="large" />,
      title: 'Smart Reports',
      description: 'Generate comprehensive financial reports with just a few clicks. Analyze your spending patterns and make informed decisions.'
    },
    {
      icon: <HistoryIcon fontSize="large" />,
      title: 'Transaction History',
      description: 'Keep track of all your transactions in one place. Filter, search, and categorize for better financial organization.'
    },
    {
      icon: <GoalIcon fontSize="large" />,
      title: 'Spending Goals',
      description: 'Set and track your financial goals. Stay motivated and measure your progress towards financial freedom.'
    },
    {
      icon: <CardIcon fontSize="large" />,
      title: 'Account Management',
      description: 'Manage multiple accounts, track balances, and transfer funds effortlessly between accounts.'
    },
    {
      icon: <ChartIcon fontSize="large" />,
      title: 'Visual Analytics',
      description: 'Visualize your financial data with beautiful charts and graphs. Identify trends and optimize your finances.'
    },
    {
      icon: <AccountIcon fontSize="large" />,
      title: 'Savings Tracker',
      description: 'Monitor your savings accounts and watch your money grow with interest calculations and projections.'
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: alpha(theme.palette.background.default, 0.8)
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
            Powerful Features
          </Typography>
          
          <Typography
            variant="h3"
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              mb: 2 
            }}
          >
            Everything You Need to Manage Your Finances
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
            Our comprehensive tools help you track, analyze, and optimize your financial life in one place.
          </Typography>
        </Box>
        
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  variants={cardVariants}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        width: 60,
                        height: 60,
                        borderRadius: '12px',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main
                      }}
                    >
                      {feature.icon}
                    </Box>
                    
                    <Typography variant="h5" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
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
