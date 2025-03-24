import React from 'react';
import { motion } from 'framer-motion';

const slideVariants = {
  hidden: { 
    opacity: 0, 
    x: ({ direction = 'right' }) => direction === 'right' ? 20 : -20
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 30
    } 
  },
  exit: { 
    opacity: 0,
    x: ({ direction = 'right' }) => direction === 'right' ? 20 : -20,
    transition: { duration: 0.2 } 
  }
};

const SlideIn = ({ children, direction = 'right', delay = 0, ...props }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={{ direction }}
      variants={slideVariants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;
