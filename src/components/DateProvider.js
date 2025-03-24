import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

/**
 * DateProvider component that wraps children with MUI's LocalizationProvider
 * This ensures date pickers have the necessary context
 */
const DateProvider = ({ children }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {children}
    </LocalizationProvider>
  );
};

export default DateProvider;
