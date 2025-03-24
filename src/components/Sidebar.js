import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  useTheme,
  Box,
  Typography
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Payment as TransactionIcon,
  Assessment as ReportIcon,
  AccountBalance as BankIcon,
  SwapHoriz as SwapIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  TrackChanges as TrackChangesIcon,
  BookmarkBorder as TemplatesIcon,
  DateRange as CalendarViewIcon,
  Book as DiaryIcon,
  History as HistoryIcon,
  Savings as SavingsIcon,
  AccountBalance as LoanIcon // Add LoanIcon import
} from '@mui/icons-material';

const Sidebar = ({ open, drawerWidth }) => {
  const location = useLocation();
  const theme = useTheme();
  
  // Define navigation items
  const mainNavItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/app', // Changed from / to /app
      active: location.pathname === '/app'
    },
    {
      text: 'Transactions',
      icon: <TransactionIcon />,
      path: '/app/transactions',
      active: location.pathname.includes('/app/transactions') && !location.pathname.includes('/calendar')
    },
    {
      text: 'Calendar View',
      icon: <CalendarViewIcon />,
      path: '/app/transactions/calendar',
      active: location.pathname.includes('/app/transactions/calendar')
    },
    {
      text: 'Reports',
      icon: <ReportIcon />,
      path: '/app/reports',
      active: location.pathname.includes('/app/reports')
    },
    {
      text: 'Accounts',
      icon: <BankIcon />,
      path: '/app/accounts',
      active: location.pathname.includes('/app/accounts')
    },
    {
      text: 'Transfers',
      icon: <SwapIcon />,
      path: '/app/transfers',
      active: location.pathname.includes('/app/transfers')
    },
    // Make Savings a top level item for better visibility
    {
      text: 'Savings',
      icon: <SavingsIcon />,
      path: '/app/savings',
      active: location.pathname.includes('/app/savings')
    },
    // Add Loan Simulation
    {
      text: 'Loan Simulation',
      icon: <LoanIcon />,
      path: '/app/loans',
      active: location.pathname.includes('/app/loans')
    },
    {
      text: 'Spending Goals',
      icon: <TrackChangesIcon />,
      path: '/app/spending-goals',
      active: location.pathname.includes('/app/spending-goals')
    },
    {
      text: 'Templates',
      icon: <TemplatesIcon />,
      path: '/app/templates',
      active: location.pathname.includes('/app/templates')
    },
    {
      text: 'Financial Diary',
      icon: <DiaryIcon />,
      path: '/app/diary',
      active: location.pathname.includes('/app/diary')
    },
    {
      text: 'Journal History',
      icon: <HistoryIcon />,
      path: '/app/journal-history',
      active: location.pathname.includes('/app/journal-history')
    }
  ];
  
  const secondaryNavItems = [
    {
      text: 'Profile',
      icon: <ProfileIcon />,
      path: '/app/profile', // Ensure this matches the route in Layout
      active: location.pathname.includes('/app/profile')
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/app/settings',
      active: location.pathname.includes('/app/settings')
    }
  ];
  
  // Item styling
  const getItemStyles = (isActive) => ({
    backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
    borderRadius: 1,
    mb: 0.5,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    }
  });
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          ...(!open && {
            width: theme.spacing(7),
            overflowX: 'hidden'
          }),
          [theme.breakpoints.down('sm')]: {
            width: open ? '100%' : 0,
          },
        },
      }}
      open={open}
    >
      {/* Add app logo/name at the top of sidebar */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: open ? 'flex-start' : 'center',
          py: 2, 
          px: open ? 2 : 0 
        }}
      >
        {open ? (
          <Typography variant="h6" fontWeight="bold" color="primary">
            FinanceApp
          </Typography>
        ) : (
          <Typography variant="h6" fontWeight="bold" color="primary">
            F
          </Typography>
        )}
      </Box>
      
      <Divider />
      
      <List sx={{ mt: 1 }}>
        {mainNavItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            sx={getItemStyles(item.active)}
          >
            <ListItemIcon sx={{ 
              color: item.active ? theme.palette.primary.main : theme.palette.text.secondary, 
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            {open && (
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: item.active ? 'medium' : 'regular',
                  color: item.active ? theme.palette.primary.main : theme.palette.text.primary
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <List>
        {secondaryNavItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            sx={getItemStyles(item.active)}
          >
            <ListItemIcon sx={{ 
              color: item.active ? theme.palette.primary.main : theme.palette.text.secondary, 
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            {open && (
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: item.active ? 'medium' : 'regular',
                  color: item.active ? theme.palette.primary.main : theme.palette.text.primary
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
