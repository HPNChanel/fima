import React from 'react';
import { motion } from 'framer-motion';

const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    } 
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 } 
  }
};

const FadeIn = ({ children, delay = 0, ...props }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeVariants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
