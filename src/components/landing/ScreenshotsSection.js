import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  useTheme,
  alpha,
  Modal,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ScreenshotsSection = ({ isMobile, scrollPosition }) => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Define screenshot data with placeholder URLs instead of imported images
  const screenshots = [
    {
      title: 'Dashboard Overview',
      description: 'Get a complete view of your finances at a glance.',
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/485856460_1382587226074344_1955489657113414670_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeETygCnhqs9lL35shcKkK2U62tgkjFTzXrra2CSMVPNesUQs-S1AZEhUcYW0SSra5Y5facdz1lJ2eOrtti23fsD&_nc_ohc=Depd4wzbvN8Q7kNvgFNfUaf&_nc_oc=AdkBE0m5rZ82amHEUagAPdTrxGnGB2MQGjA9H5SpuXW2oczP_WsPpeWJZ1YW9YEa1v4&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=R4aJxBmZkpgNumSKkvQsiQ&oh=00_AYELTTmyXkpr0qvA_uJN7VVmt6gMrlrgzg9NuTod4chJqg&oe=67E4300B'
    },
    {
      title: 'Transaction Management',
      description: 'Track all your income and expenses with detailed history.',
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/486152555_1382587256074341_7013058209235673351_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEJPgiaNAUry-ahGN05IIzLBZFUYQ4THHgFkVRhDhMceG_yPwr_pYRp1yYXne8YWV53nH8QrtJiE3vOthUjf00b&_nc_ohc=FWAL5HzRnG8Q7kNvgGO6Yn-&_nc_oc=Adlj18F3O8qZaMmsnZmJgoJ-gWI65LCQNnRoM1TaWex3U1xCT2uxcESpSN8tJtY0nws&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=XfumqfA5qr9FCcfXv8vezQ&oh=00_AYHjGhrE5rkD73OLokJmESTIhKpjhaR6xLUI8oLOkurY_Q&oe=67E43004'
    },
    {
      title: 'Financial Reports',
      description: 'Generate insightful reports to analyze your spending patterns.',
      image: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/486178193_1382587199407680_5972578645058241201_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFxY-uk4EhXKna9ikvHe9JejRe5uPOm_aSNF7m486b9pMNxgOMm5sM1HhfnhTnQsb-yOT_yiRxEThmaVxF5oyOf&_nc_ohc=G307C1xwZy8Q7kNvgGe-GT3&_nc_oc=AdnVxYKUVIq13_52xi-1m77sCYSeK-Ab4vJd-Hk_Xke6g87RJdS-0E01xHJqHx9L3iQ&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=WQMzPSVaJ0B8uILlMNvd7Q&oh=00_AYGkFFv32sVZtTqRTbFz9m8vUwllWdWIBxGfojOwVXud-Q&oe=67E434B9'
    },
    {
      title: 'Savings Goals',
      description: 'Set and track progress towards your financial goals.',
      image: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/485412496_1382587196074347_1476597028843613725_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGLrnSCbzO2I7Y88KVEYObu6Bw32fO4UaLoHDfZ87hRovmwnaFPm7mi1-jrU4nBGOpkQAtodu-oipMshO0nb8Xc&_nc_ohc=arEymWnPIIoQ7kNvgG5MnC3&_nc_oc=AdlX5uHfScwq4p_GGI1REgLtBq9-g_9QMK0Z-00Ze6Y4vnWpDxEBLaRALEH93fR0dhg&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=zpfrGHhiILXWn0qQomFZjw&oh=00_AYGr9BZCWj1KAt9StP83nC8HF15flaS6ki_aMiSdATBm6Q&oe=67E45BF4'
    }
  ];
  
  const handleOpenModal = (index) => {
    setSelectedImage(index);
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % screenshots.length);
  };
  
  const handlePrev = () => {
    setSelectedImage((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box
      id="screenshots"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.4)
          : alpha(theme.palette.primary.main, 0.03)
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
            App Screenshots
          </Typography>
          
          <Typography
            variant="h3"
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              mb: 2 
            }}
          >
            See the App in Action
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
            Explore our intuitive interface designed for clarity and ease of use
          </Typography>
        </Box>
        
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={4}>
            {screenshots.map((screenshot, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <MotionBox
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card 
                    onClick={() => handleOpenModal(index)}
                    sx={{ 
                      borderRadius: 4, 
                      cursor: 'pointer',
                      overflow: 'hidden',
                      boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={isMobile ? 200 : 300}
                      image={screenshot.image}
                      alt={screenshot.title}
                      sx={{
                        objectFit: 'cover',
                        objectPosition: 'top'
                      }}
                    />
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {screenshot.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {screenshot.description}
                      </Typography>
                    </Box>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </MotionBox>
      </Container>
      
      {/* Modal for enlarged screenshot view */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="screenshot-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 24,
            backgroundColor: 'background.paper'
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              color: 'common.white',
              bgcolor: alpha(theme.palette.common.black, 0.5),
              '&:hover': {
                bgcolor: alpha(theme.palette.common.black, 0.7),
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Box
            component="img"
            src={screenshots[selectedImage].image}
            alt={screenshots[selectedImage].title}
            sx={{
              width: '100%',
              height: '100%',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 2,
              alignItems: 'center',
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="h6">{screenshots[selectedImage].title}</Typography>
            <Box>
              <IconButton onClick={handlePrev} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <IconButton onClick={handleNext}>
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ScreenshotsSection;
