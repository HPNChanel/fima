import React from 'react';
import { Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled component for glass effect
const GlassPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(30, 30, 30, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(3),
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.25)'
    : '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 0.7)'}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 25px rgba(0, 0, 0, 0.35)'
      : '0 6px 25px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-3px)',
  },
}));

// Animation variants for framer motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    } 
  }
};

const GlassCard = ({ children, elevation = 3, delay = 0, ...props }) => {
  return (
    <Box component={motion.div}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={cardVariants}
      custom={delay}
      style={{ width: '100%' }}
    >
      <GlassPaper elevation={elevation} {...props}>
        {children}
      </GlassPaper>
    </Box>
  );
};

export default GlassCard;
