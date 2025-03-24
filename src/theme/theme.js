import { createTheme } from '@mui/material/styles';

// Define new color palette
const getPalette = (darkMode) => ({
  primary: {
    main: '#00C9A7',
    light: '#33D4B8',
    dark: '#00A086',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#4caf50', // Green - accent color
    light: '#81c784',
    dark: '#388e3c',
    contrastText: '#fff',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },
  background: {
    default: darkMode ? '#121212' : '#F5F7FA',
    paper: darkMode ? '#1E1E1E' : '#FFFFFF',
  },
  text: {
    primary: darkMode ? '#FFFFFF' : '#121212',
    secondary: darkMode ? '#AAAAAA' : '#666666',
  },
  accent: {
    main: '#FFD369',
    light: '#FFE49A',
    dark: '#FFBB33',
  },
});

// Renamed function to match import in App.js
export const createAppTheme = (darkMode) => {
  const palette = getPalette(darkMode);
  
  return createTheme({
    palette,
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        fontWeight: 500,
        textTransform: 'none', // Avoid all caps buttons
      },
    },
    shape: {
      borderRadius: 12, // Global border radius
    },
    components: {
      // Make components more rounded and improve their appearance
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: darkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.2)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            backgroundColor: darkMode 
              ? 'rgba(30, 30, 30, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: darkMode
                ? '0 6px 25px rgba(0, 0, 0, 0.3)'
                : '0 6px 25px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-3px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: '16px',
          },
          elevation1: {
            boxShadow: darkMode
              ? '0 2px 10px rgba(0, 0, 0, 0.3)'
              : '0 2px 10px rgba(0, 0, 0, 0.05)',
          },
          root: {
            transition: 'all 0.3s ease-in-out',
          }
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '10px 20px',
            boxShadow: 'none',
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 4px 12px ${darkMode ? 'rgba(0, 201, 167, 0.3)' : 'rgba(0, 201, 167, 0.2)'}`,
              transform: 'translateY(-2px)',
            },
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: palette.primary.dark,
            },
          },
          containedSecondary: {
            '&:hover': {
              backgroundColor: palette.secondary.dark,
            },
          },
          outlinedPrimary: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: darkMode
              ? '0 1px 5px rgba(0, 0, 0, 0.5)'
              : '0 1px 5px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '16px',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: '3px',
            borderRadius: '1.5px',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: '12px',
            boxShadow: darkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.5)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            paddingTop: '8px',
            paddingBottom: '8px',
          },
        },
      },
      MuiList: {
        styleOverrides: {
          padding: {
            paddingTop: '8px',
            paddingBottom: '8px',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            '&.Mui-selected': {
              backgroundColor: darkMode 
                ? 'rgba(25, 118, 210, 0.2)' 
                : 'rgba(25, 118, 210, 0.1)',
            },
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: '12px',
            boxShadow: darkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.5)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: '0',
          },
        },
      },
    },
  });
};

// Keep the original function for backward compatibility
export const getTheme = createAppTheme;
