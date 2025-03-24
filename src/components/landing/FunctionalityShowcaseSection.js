import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  InsertChart as ChartIcon,
  AccountBalance as AccountIcon,
  Savings as SavingsIcon,
  Compare as CompareIcon,
  Assessment as AssessmentIcon,
  Book as BookIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const FunctionalityShowcaseSection = ({ language, isMobile }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Functionality categories with detailed descriptions
  const functionalities = [
    {
      id: 'dashboard',
      label: language === 'vi' ? 'Bảng Điều Khiển' : 'Dashboard',
      icon: <ChartIcon />,
      title: language === 'vi' ? 'Bảng Điều Khiển Tài Chính Toàn Diện' : 'Comprehensive Financial Dashboard',
      description: language === 'vi' 
        ? 'Cung cấp tổng quan chi tiết về sức khỏe tài chính của bạn với biểu đồ trực quan và số liệu thống kê thời gian thực.'
        : 'Provides detailed overview of your financial health with intuitive charts and real-time statistics.',
      features: [
        language === 'vi' ? 'Biểu đồ dòng tiền theo thời gian thực' : 'Real-time cash flow charts',
        language === 'vi' ? 'Phân tích chi tiêu theo danh mục' : 'Spending analysis by category',
        language === 'vi' ? 'Tóm tắt tài khoản được cập nhật liên tục' : 'Continuously updated account summaries',
        language === 'vi' ? 'Dự báo tài chính cá nhân' : 'Personal financial forecasting'
      ],
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/485856460_1382587226074344_1955489657113414670_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeETygCnhqs9lL35shcKkK2U62tgkjFTzXrra2CSMVPNesUQs-S1AZEhUcYW0SSra5Y5facdz1lJ2eOrtti23fsD&_nc_ohc=Depd4wzbvN8Q7kNvgFNfUaf&_nc_oc=AdkBE0m5rZ82amHEUagAPdTrxGnGB2MQGjA9H5SpuXW2oczP_WsPpeWJZ1YW9YEa1v4&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=R4aJxBmZkpgNumSKkvQsiQ&oh=00_AYELTTmyXkpr0qvA_uJN7VVmt6gMrlrgzg9NuTod4chJqg&oe=67E4300B',
      metrics: {
        improvementMetric: '32%',
        improvementText: language === 'vi' ? 'Người dùng tiết kiệm nhiều hơn' : 'Users save more',
        usageMetric: '89%',
        usageText: language === 'vi' ? 'Tỷ lệ tương tác hàng ngày' : 'Daily engagement rate'
      }
    },
    {
      id: 'accounts',
      label: language === 'vi' ? 'Quản Lý Tài Khoản' : 'Account Management',
      icon: <AccountIcon />,
      title: language === 'vi' ? 'Quản Lý Đa Tài Khoản Thông Minh' : 'Smart Multi-Account Management',
      description: language === 'vi'
        ? 'Quản lý tất cả tài khoản ngân hàng, thẻ tín dụng và tài khoản đầu tư từ một nơi duy nhất với tự động hóa đồng bộ dữ liệu.'
        : 'Manage all your bank accounts, credit cards, and investment accounts from a single place with automated data synchronization.',
      features: [
        language === 'vi' ? 'Tích hợp nhiều tài khoản tài chính' : 'Multiple financial account integration',
        language === 'vi' ? 'Theo dõi số dư và giao dịch tự động' : 'Automatic balance and transaction tracking',
        language === 'vi' ? 'Chuyển khoản giữa các tài khoản' : 'Transfers between accounts',
        language === 'vi' ? 'Phân loại tài khoản linh hoạt' : 'Flexible account categorization'
      ],
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/486152555_1382587256074341_7013058209235673351_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEJPgiaNAUry-ahGN05IIzLBZFUYQ4THHgFkVRhDhMceG_yPwr_pYRp1yYXne8YWV53nH8QrtJiE3vOthUjf00b&_nc_ohc=FWAL5HzRnG8Q7kNvgGO6Yn-&_nc_oc=Adlj18F3O8qZaMmsnZmJgoJ-gWI65LCQNnRoM1TaWex3U1xCT2uxcESpSN8tJtY0nws&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=XfumqfA5qr9FCcfXv8vezQ&oh=00_AYHjGhrE5rkD73OLokJmESTIhKpjhaR6xLUI8oLOkurY_Q&oe=67E43004',
      metrics: {
        improvementMetric: '54%',
        improvementText: language === 'vi' ? 'Tăng hiệu quả quản lý' : 'Increase in management efficiency',
        usageMetric: '3.4',
        usageText: language === 'vi' ? 'Tài khoản trung bình/người dùng' : 'Average accounts per user'
      }
    },
    {
      id: 'savings',
      label: language === 'vi' ? 'Tiết Kiệm & Mục Tiêu' : 'Savings & Goals',
      icon: <SavingsIcon />,
      title: language === 'vi' ? 'Hệ Thống Mục Tiêu Tiết Kiệm Thông Minh' : 'Smart Savings Goal System',
      description: language === 'vi'
        ? 'Thiết lập và theo dõi mục tiêu tiết kiệm với công nghệ dự báo thông minh và tự động phân bổ tiết kiệm.'
        : 'Set up and track savings goals with intelligent forecast technology and automatic savings allocation.',
      features: [
        language === 'vi' ? 'Mục tiêu với dự báo thời gian hoàn thành' : 'Goals with completion time forecasting',
        language === 'vi' ? 'Tự động trích tiền tiết kiệm' : 'Automatic savings deductions',
        language === 'vi' ? 'Theo dõi tiến độ trực quan' : 'Visual progress tracking',
        language === 'vi' ? 'Đề xuất chiến lược tiết kiệm' : 'Suggested saving strategies'
      ],
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/485412496_1382587196074347_1476597028843613725_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGLrnSCbzO2I7Y88KVEYObu6Bw32fO4UaLoHDfZ87hRovmwnaFPm7mi1-jrU4nBGOpkQAtodu-oipMshO0nb8Xc&_nc_ohc=arEymWnPIIoQ7kNvgG5MnC3&_nc_oc=AdlX5uHfScwq4p_GGI1REgLtBq9-g_9QMK0Z-00Ze6Y4vnWpDxEBLaRALEH93fR0dhg&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=zpfrGHhiILXWn0qQomFZjw&oh=00_AYGr9BZCWj1KAt9StP83nC8HF15flaS6ki_aMiSdATBm6Q&oe=67E45BF4',
      metrics: {
        improvementMetric: '41%',
        improvementText: language === 'vi' ? 'Tăng tỷ lệ tiết kiệm' : 'Increase in saving rate',
        usageMetric: '2.7',
        usageText: language === 'vi' ? 'Mục tiêu trung bình/người dùng' : 'Average goals per user'
      }
    },
    {
      id: 'budgeting',
      label: language === 'vi' ? 'Lập Ngân Sách' : 'Budgeting',
      icon: <CompareIcon />,
      title: language === 'vi' ? 'Hệ Thống Ngân Sách Động' : 'Dynamic Budgeting System',
      description: language === 'vi'
        ? 'Tạo và quản lý ngân sách linh hoạt theo danh mục, với tính năng điều chỉnh thông minh dựa trên hành vi chi tiêu.'
        : 'Create and manage flexible category-based budgets, with intelligent adjustment features based on spending behavior.',
      features: [
        language === 'vi' ? 'Ngân sách theo danh mục tùy chỉnh' : 'Custom category-based budgets',
        language === 'vi' ? 'Cảnh báo vượt ngân sách thời gian thực' : 'Real-time budget overspending alerts',
        language === 'vi' ? 'Đề xuất ngân sách dựa trên lịch sử' : 'History-based budget suggestions',
        language === 'vi' ? 'Điều chỉnh ngân sách theo mùa' : 'Seasonal budget adjustments'
      ],
      image: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/486178193_1382587199407680_5972578645058241201_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFxY-uk4EhXKna9ikvHe9JejRe5uPOm_aSNF7m486b9pMNxgOMm5sM1HhfnhTnQsb-yOT_yiRxEThmaVxF5oyOf&_nc_ohc=G307C1xwZy8Q7kNvgGe-GT3&_nc_oc=AdnVxYKUVIq13_52xi-1m77sCYSeK-Ab4vJd-Hk_Xke6g87RJdS-0E01xHJqHx9L3iQ&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=WQMzPSVaJ0B8uILlMNvd7Q&oh=00_AYGkFFv32sVZtTqRTbFz9m8vUwllWdWIBxGfojOwVXud-Q&oe=67E434B9',
      metrics: {
        improvementMetric: '37%',
        improvementText: language === 'vi' ? 'Giảm chi tiêu quá mức' : 'Reduction in overspending',
        usageMetric: '78%',
        usageText: language === 'vi' ? 'Tuân thủ ngân sách' : 'Budget adherence'
      }
    },
    {
      id: 'reports',
      label: language === 'vi' ? 'Báo Cáo Phân Tích' : 'Reports & Analytics',
      icon: <AssessmentIcon />,
      title: language === 'vi' ? 'Phân Tích Tài Chính Nâng Cao' : 'Advanced Financial Analytics',
      description: language === 'vi'
        ? 'Tạo báo cáo chi tiết và đồ thị phân tích với AI phát hiện mẫu và đề xuất cải thiện tài chính cá nhân.'
        : 'Generate detailed reports and analytical charts with AI pattern detection and personal finance improvement suggestions.',
      features: [
        language === 'vi' ? 'Báo cáo tùy chỉnh theo thời gian' : 'Custom time-range reports',
        language === 'vi' ? 'Phân tích xu hướng chi tiêu' : 'Spending trend analysis',
        language === 'vi' ? 'So sánh hiệu suất tài chính' : 'Financial performance comparisons',
        language === 'vi' ? 'Xuất báo cáo đa định dạng' : 'Multi-format report exports'
      ],
      image: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/486178193_1382587199407680_5972578645058241201_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFxY-uk4EhXKna9ikvHe9JejRe5uPOm_aSNF7m486b9pMNxgOMm5sM1HhfnhTnQsb-yOT_yiRxEThmaVxF5oyOf&_nc_ohc=G307C1xwZy8Q7kNvgGe-GT3&_nc_oc=AdnVxYKUVIq13_52xi-1m77sCYSeK-Ab4vJd-Hk_Xke6g87RJdS-0E01xHJqHx9L3iQ&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=WQMzPSVaJ0B8uILlMNvd7Q&oh=00_AYGkFFv32sVZtTqRTbFz9m8vUwllWdWIBxGfojOwVXud-Q&oe=67E434B9',
      metrics: {
        improvementMetric: '28%',
        improvementText: language === 'vi' ? 'Tăng hiểu biết tài chính' : 'Increase in financial insight',
        usageMetric: '64%',
        usageText: language === 'vi' ? 'Sử dụng hàng tuần' : 'Weekly usage'
      }
    },
    {
      id: 'journal',
      label: language === 'vi' ? 'Nhật Ký Tài Chính' : 'Financial Journal',
      icon: <BookIcon />,
      title: language === 'vi' ? 'Nhật Ký Tài Chính Cá Nhân' : 'Personal Financial Journal',
      description: language === 'vi'
        ? 'Ghi lại suy nghĩ và cảm xúc về các quyết định tài chính, xây dựng lịch sử tài chính có ý thức.'
        : 'Record thoughts and emotions about financial decisions, building a mindful financial history.',
      features: [
        language === 'vi' ? 'Ghi chú gắn với giao dịch' : 'Transaction-linked notes',
        language === 'vi' ? 'Theo dõi cảm xúc về tiền bạc' : 'Money emotion tracking',
        language === 'vi' ? 'Liên kết các mục tiêu tài chính' : 'Financial goal linkage',
        language === 'vi' ? 'Nhắc nhở ghi chép hàng ngày' : 'Daily journaling reminders'
      ],
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/486152555_1382587256074341_7013058209235673351_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEJPgiaNAUry-ahGN05IIzLBZFUYQ4THHgFkVRhDhMceG_yPwr_pYRp1yYXne8YWV53nH8QrtJiE3vOthUjf00b&_nc_ohc=FWAL5HzRnG8Q7kNvgGO6Yn-&_nc_oc=Adlj18F3O8qZaMmsnZmJgoJ-gWI65LCQNnRoM1TaWex3U1xCT2uxcESpSN8tJtY0nws&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=XfumqfA5qr9FCcfXv8vezQ&oh=00_AYHjGhrE5rkD73OLokJmESTIhKpjhaR6xLUI8oLOkurY_Q&oe=67E43004',
      metrics: {
        improvementMetric: '43%',
        improvementText: language === 'vi' ? 'Tăng ý thức tài chính' : 'Increase in financial mindfulness',
        usageMetric: '3.5',
        usageText: language === 'vi' ? 'Mục nhập/tuần trung bình' : 'Average entries/week'
      }
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const currentFunctionality = functionalities[activeTab];

  return (
    <Box
      id="functionality"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.4)
          : alpha(theme.palette.background.default, 0.7)
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
            {language === 'vi' ? 'Chức Năng Ứng Dụng' : 'App Functionality'}
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 2
            }}
          >
            {language === 'vi' ? 'Khám Phá Các Tính Năng Chuyên Sâu' : 'Explore In-Depth Features'}
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
              ? 'Tìm hiểu chi tiết về các chức năng chuyên biệt giúp ứng dụng của chúng tôi nổi bật'
              : 'Learn about the specialized functionality that makes our app stand out'}
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="functionality tabs"
            sx={{
              mb: 4,
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: { xs: '0.85rem', md: '0.95rem' }
              }
            }}
          >
            {functionalities.map((item, index) => (
              <Tab
                key={item.id}
                label={item.label}
                icon={item.icon}
                iconPosition="start"
                sx={{
                  minWidth: 'auto',
                  px: { xs: 2, md: 3 },
                  fontWeight: activeTab === index ? 'bold' : 'medium'
                }}
              />
            ))}
          </Tabs>

          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeTab}
          >
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={12} md={6}>
                <MotionBox variants={itemVariants}>
                  <Typography
                    variant="h4"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {currentFunctionality.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    paragraph
                    sx={{ mb: 3, fontSize: '1.1rem' }}
                  >
                    {currentFunctionality.description}
                  </Typography>

                  <List disablePadding sx={{ mb: 4 }}>
                    {currentFunctionality.features.map((feature, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            fontWeight: 'medium'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          borderRadius: 2
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="p"
                          color="primary"
                          fontWeight="bold"
                        >
                          {currentFunctionality.metrics.improvementMetric}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentFunctionality.metrics.improvementText}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          borderRadius: 2
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="p"
                          color="primary"
                          fontWeight="bold"
                        >
                          {currentFunctionality.metrics.usageMetric}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentFunctionality.metrics.usageText}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2
                    }}
                  >
                    {language === 'vi' ? 'Khám Phá Tính Năng' : 'Explore Feature'}
                  </Button>
                </MotionBox>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: { xs: isMobile ? 'none' : 'block', md: 'block' } }}>
                <MotionBox variants={itemVariants}>
                  <MotionPaper
                    elevation={6}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      transform: 'perspective(1500px) rotateY(-5deg)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}
                    whileHover={{
                      transform: 'perspective(1500px) rotateY(0deg)',
                      transition: { duration: 0.5 }
                    }}
                  >
                    <Box
                      component="img"
                      src={currentFunctionality.image}
                      alt={currentFunctionality.title}
                      sx={{
                        width: '100%',
                        display: 'block'
                      }}
                    />
                  </MotionPaper>
                </MotionBox>
              </Grid>
            </Grid>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
};

export default FunctionalityShowcaseSection;
