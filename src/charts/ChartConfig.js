/**
 * Global chart configuration for the Finance App
 * 
 * This file provides centralized chart settings that can be easily
 * customized by interns without needing to understand the full Chart.js API.
 */

// Color scheme for financial data
export const chartColors = {
  // Primary category colors for pie/bar charts
  income: '#2e7d32',             // success.main - green
  expense: '#d32f2f',            // error.main - red
  balance: '#1976d2',            // primary.main - blue
  
  // Alternative colors for multiple categories
  categoryColors: [
    '#1976d2',  // primary - blue
    '#9c27b0',  // purple
    '#ed6c02',  // orange
    '#2e7d32',  // green
    '#d32f2f',  // red
    '#0288d1',  // light blue
    '#9e9d24',  // lime
    '#f44336',  // red
    '#673ab7',  // deep purple
    '#00796b',  // teal
    '#fbc02d',  // yellow
    '#e91e63',  // pink
  ],
  
  // Backgrounds with transparency
  transparentIncome: 'rgba(46, 125, 50, 0.2)',
  transparentExpense: 'rgba(211, 47, 47, 0.2)',
  transparentBalance: 'rgba(25, 118, 210, 0.2)',
  
  // Line/area chart gradient settings
  gradientStart: 0.4,  // Opacity at the top of gradient (0-1)
  gradientEnd: 0.05,   // Opacity at the bottom of gradient (0-1)
};

// Default chart options
export const chartOptions = {
  // Animation settings
  animation: {
    enabled: true,         // Set to false to disable all animations
    duration: 1000,        // Animation duration in ms
    easing: 'easeOutQuart' // Animation easing function
  },
  
  // Currency settings
  currency: {
    symbol: '$',           // Currency symbol
    position: 'prefix',    // 'prefix' or 'suffix'
    decimalPlaces: 2       // Number of decimal places
  },
  
  // Responsiveness
  responsive: {
    maintainAspectRatio: false,
    enableResponsiveness: true
  },
  
  // Tooltip settings
  tooltip: {
    enabled: true,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    includeCurrency: true,
    includePercentage: true
  },
  
  // Legend settings
  legend: {
    display: true,
    position: 'top',       // 'top', 'bottom', 'left', 'right'
    usePointStyle: true,   // Use circular point style instead of rectangles
    fontSize: 12
  }
};

/**
 * Formats a number as currency
 * @param {number} value - The numerical value to format
 * @param {string} symbol - Currency symbol
 * @param {number} decimalPlaces - Number of decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, symbol = '$', decimalPlaces = 2) => {
  return `${symbol}${value.toFixed(decimalPlaces)}`;
};

/**
 * Generates a gradient for chart backgrounds
 * @param {string} color - Base color in hex or rgba
 * @param {number} startOpacity - Starting opacity (0-1)
 * @param {number} endOpacity - Ending opacity (0-1)
 * @returns {function} Function that returns a gradient when called with context
 */
export const createGradient = (color, startOpacity = 0.4, endOpacity = 0.05) => {
  return (context) => {
    if (!context) return color;
    
    const ctx = context.chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
    
    // Extract RGB parts from hex or rgb color
    let r, g, b;
    
    if (color.startsWith('#')) {
      // Handle hex colors
      const hex = color.replace('#', '');
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (color.startsWith('rgb')) {
      // Handle rgb/rgba colors
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        [r, g, b] = matches.map(Number);
      } else {
        // Fallback to a default color if parsing fails
        r = 25; g = 118; b = 210; // primary blue
      }
    } else {
      // Default fallback
      r = 25; g = 118; b = 210; // primary blue
    }
    
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${startOpacity})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${endOpacity})`);
    
    return gradient;
  };
};

/**
 * Helper function to truncate long labels
 * @param {string} label - The label to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated label with ellipsis if needed
 */
export const truncateLabel = (label, maxLength = 16) => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength-3)}...` : label;
};

/**
 * Example theme configurations that interns can apply to all charts
 */
export const themeOptions = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
    gridColor: 'rgba(0, 0, 0, 0.1)',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
  },
  dark: {
    backgroundColor: '#333333',
    textColor: '#ffffff',
    gridColor: 'rgba(255, 255, 255, 0.1)',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
  },
  colorful: {
    categoryColors: [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#8AC926', '#1982C4'
    ]
  }
};

export default {
  chartColors,
  chartOptions,
  formatCurrency,
  createGradient,
  truncateLabel,
  themeOptions
};
