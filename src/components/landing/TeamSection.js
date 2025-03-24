import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  useTheme,
  alpha,
  Stack
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const TeamSection = ({ isMobile, language }) => {
  const theme = useTheme();
  
  // Team members data
  const teamMembers = [
    {
      name: 'Phuc Nguyen Huynh (HPNChanel)',
      role: language === 'vi' ? 'Nhà sáng lập & CEO' : 'Project Manager',
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/480427196_1360063718326695_479625262547442940_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH6yCHlr4Dk7Vz7bRk4ZpUo8jT_-be9kS_yNP_5t72RL2aZfN1P8neEfVGTcQd2fNVzkxt4W5LaP0c1busxyhm3&_nc_ohc=AuTPPuQKDegQ7kNvgHFNDCJ&_nc_oc=AdlKzcGzqqoxEOhSQ6vQHodsXn5mBU0BkrbuTRwCxnP5rxVbWarqQHsLDnjf4cl2rfE&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=IrPeGa3pYUfe8cORzrTDng&oh=00_AYHzBaCO_YWo_VqtwMMJf237tJMBeTVrqVjphgyanVQM3Q&oe=67E45E35',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com/HPNChanel'
      }
    },
    {
      name: 'Phuc Tam Ho',
      role: language === 'vi' ? 'Giám đốc sản phẩm' : 'Full Stack Developer',
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t1.15752-9/484551030_1673939883247728_8768509888435194846_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHKrThPePQP179rUb-NxP67z-fMk2si5Q7P58yTayLlDoeqGwOoHGIFNV3zLDdoYnAuRjbVqEPzT45hpMzfAs_6&_nc_ohc=dquzeIGCjQ0Q7kNvgFo2L-B&_nc_oc=AdnnWKBy7jsHJXOEPE10Eya-t0xcbM_vlsiNQkfSH8jHkr-PL36LLHgqhcXFmwuG6bU&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&oh=03_Q7cD1wHyNBGavAOrXTMlhfhr9dBODDA-8ZB1CCFCCF2wmiUJCA&oe=6806016E',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com/Phuctam03'
      }
    },
    {
      name: 'Van Tinh Nguyen',
      role: language === 'vi' ? 'Kỹ sư trưởng' : 'Full Stack Developer',
      image: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/484400207_2461043850910766_3722109055110484329_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEJviIuL7p6oPOgNh9tEFhBoEM85PYkojegQzzk9iSiN49cgTALp5zvTH5OyXT8sI30UxNZIH5bC-uKU1-vRw1O&_nc_ohc=DZfc9qmIcyQQ7kNvgGOcvOQ&_nc_oc=AdkUFs_IXc7tOnhsSa9qUAOTTjmTOUiejLplrbYea56cG2VlmKndNqaz--iCDg1QNJQ&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=3RN5If7dhsq42shMow0PXg&oh=00_AYFP2aqYuw_nNqrVsq_5TLiTGuVd7sanhyAUl3dbzQ7ArQ&oe=67E434B9',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com/vantinh-try'
      }
    }
  ];
  
  // Animation variants with simplified easing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        duration: 0.4
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <Box
      id="team"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.default, 0.5)
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
            {language === 'vi' ? 'Đội Ngũ Của Chúng Tôi' : 'Our Team'}
          </Typography>
          
          <Typography
            variant="h3"
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              mb: 2 
            }}
          >
            {language === 'vi' ? 'Gặp Gỡ Những Người Đứng Sau Ứng Dụng' : 'Meet the People Behind the App'}
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
              ? 'Nhóm chuyên gia tận tâm của chúng tôi đam mê giúp bạn đạt được mục tiêu tài chính của mình'
              : 'Our dedicated team of experts is passionate about helping you achieve your financial goals'}
          </Typography>
        </Box>
        
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  variants={itemVariants}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    },
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', pt: '100%' }}>
                    <CardMedia
                      component="img"
                      image={member.image}
                      alt={member.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </Box>
                  
                  <CardContent sx={{ 
                    p: 3,
                    textAlign: 'center', 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column'
                  }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {member.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {member.role}
                    </Typography>
                    
                    <Stack 
                      direction="row" 
                      spacing={1}
                      justifyContent="center"
                      sx={{ mt: 'auto' }}
                    >
                      <IconButton
                        size="small"
                        aria-label="linkedin"
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: 'text.secondary',
                          transition: 'all 0.2s',
                          '&:hover': {
                            color: '#0077B5',
                            bgcolor: alpha('#0077B5', 0.1)
                          }
                        }}
                      >
                        <LinkedInIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        aria-label="twitter"
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: 'text.secondary',
                          transition: 'all 0.2s',
                          '&:hover': {
                            color: '#1DA1F2',
                            bgcolor: alpha('#1DA1F2', 0.1)
                          }
                        }}
                      >
                        <TwitterIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        aria-label="github"
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: 'text.secondary',
                          transition: 'all 0.2s',
                          '&:hover': {
                            color: theme.palette.mode === 'dark' ? '#f8f8f8' : '#24292e',
                            bgcolor: alpha(theme.palette.mode === 'dark' ? '#f8f8f8' : '#24292e', 0.1)
                          }
                        }}
                      >
                        <GitHubIcon fontSize="small" />
                      </IconButton>
                    </Stack>
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

export default TeamSection;
