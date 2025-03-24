import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const TeamSection = ({ isMobile, scrollPosition }) => {
  const theme = useTheme();
  
  // Team member data with placeholder URLs
  const teamMembers = [
    {
      name: 'Phuc Nguyen Huynh (HPNChanel)',
      role: 'Project Manager',
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/480427196_1360063718326695_479625262547442940_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH6yCHlr4Dk7Vz7bRk4ZpUo8jT_-be9kS_yNP_5t72RL2aZfN1P8neEfVGTcQd2fNVzkxt4W5LaP0c1busxyhm3&_nc_ohc=AuTPPuQKDegQ7kNvgHFNDCJ&_nc_oc=AdlKzcGzqqoxEOhSQ6vQHodsXn5mBU0BkrbuTRwCxnP5rxVbWarqQHsLDnjf4cl2rfE&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=IrPeGa3pYUfe8cORzrTDng&oh=00_AYHzBaCO_YWo_VqtwMMJf237tJMBeTVrqVjphgyanVQM3Q&oe=67E45E35',
      github: 'https://github.com/HPNChanel',
      linkedin: 'https://linkedin.com'
    },
    {
      name: 'Phuc Tam Ho',
      role: 'Full Stack Developer',
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t1.15752-9/484551030_1673939883247728_8768509888435194846_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHKrThPePQP179rUb-NxP67z-fMk2si5Q7P58yTayLlDoeqGwOoHGIFNV3zLDdoYnAuRjbVqEPzT45hpMzfAs_6&_nc_ohc=dquzeIGCjQ0Q7kNvgFo2L-B&_nc_oc=AdnnWKBy7jsHJXOEPE10Eya-t0xcbM_vlsiNQkfSH8jHkr-PL36LLHgqhcXFmwuG6bU&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&oh=03_Q7cD1wHyNBGavAOrXTMlhfhr9dBODDA-8ZB1CCFCCF2wmiUJCA&oe=6806016E',
      github: 'https://github.com/Phuctam03',
      linkedin: 'https://linkedin.com'
    },
    {
      name: 'Van Tinh Nguyen',
      role: 'Full Stack Developer',
      image: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/484400207_2461043850910766_3722109055110484329_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEJviIuL7p6oPOgNh9tEFhBoEM85PYkojegQzzk9iSiN49cgTALp5zvTH5OyXT8sI30UxNZIH5bC-uKU1-vRw1O&_nc_ohc=DZfc9qmIcyQQ7kNvgGOcvOQ&_nc_oc=AdkUFs_IXc7tOnhsSa9qUAOTTjmTOUiejLplrbYea56cG2VlmKndNqaz--iCDg1QNJQ&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=3RN5If7dhsq42shMow0PXg&oh=00_AYFP2aqYuw_nNqrVsq_5TLiTGuVd7sanhyAUl3dbzQ7ArQ&oe=67E434B9',
      github: 'https://github.com/vantinh-try',
      linkedin: 'https://linkedin.com'
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box
      id="team"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.background.paper
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
            Meet Our Team
          </Typography>
          
          <Typography
            variant="h3"
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              mb: 2 
            }}
          >
            The People Behind the App
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
            A dedicated team of professionals working together to help you manage your finances
          </Typography>
        </Box>
        
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  variants={cardVariants}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    textAlign: 'center',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`
                      }}
                    />
                    
                    <Typography variant="h5" component="h3" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                      {member.name}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {member.role}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        aria-label="GitHub"
                        component="a"
                        href={member.github}
                        target="_blank"
                        rel="noopener"
                        sx={{ 
                          color: 'text.primary',
                          '&:hover': { color: 'primary.main' } 
                        }}
                      >
                        <GitHubIcon />
                      </IconButton>
                      
                      <IconButton
                        aria-label="LinkedIn"
                        component="a"
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener"
                        sx={{ 
                          color: 'text.primary',
                          '&:hover': { color: 'primary.main' } 
                        }}
                      >
                        <LinkedInIcon />
                      </IconButton>
                      
                      <IconButton
                        aria-label="Portfolio"
                        component="a"
                        href="#"
                        target="_blank"
                        rel="noopener"
                        sx={{ 
                          color: 'text.primary',
                          '&:hover': { color: 'primary.main' } 
                        }}
                      >
                        <CodeIcon />
                      </IconButton>
                    </Box>
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
