import { useContext } from 'react';
import { AppContext } from '../App';
import { useTheme } from '@mui/material/styles';

/**
 * Custom hook for dark mode functionality
 * 
 * @returns {Object} Dark mode utilities and state
 */
const useDarkMode = () => {
  const { darkMode, toggleDarkMode } = useContext(AppContext);
  const theme = useTheme();
  
  /**
   * Get an appropriate color based on the current theme
   * 
   * @param {string} lightColor - Color to use in light mode
   * @param {string} darkColor - Color to use in dark mode
   * @returns {string} The appropriate color for the current theme
   */
  const getThemeColor = (lightColor, darkColor) => {
    return darkMode ? darkColor : lightColor;
  };
  
  /**
   * Get contrasting text color for the current theme
   * 
   * @returns {string} Text color that contrasts with the background
   */
  const getContrastText = () => {
    return theme.palette.getContrastText(theme.palette.background.default);
  };
  
  return {
    darkMode,
    toggleDarkMode,
    getThemeColor,
    getContrastText,
    isDark: darkMode
  };
};

export default useDarkMode;
