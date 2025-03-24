import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountBalanceWallet as AccountsIcon,
  Flag as GoalsIcon,
  SwapHoriz as TransferIcon,
  BookmarkBorder as TemplatesIcon,
  Savings as SavingsIcon,
  Book as DiaryIcon,
  History as HistoryIcon,
  DateRange as CalendarViewIcon,
  AccountBalance as LoanIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import { AppContext } from "../App";
import UserPanel from './UserPanel';
import RouteLogger from './RouteLogger';
import { createTranslator } from '../utils/translations';

// Define consistent drawer widths
const DRAWER_FULL = 240;
const DRAWER_MINI = 65;

// AppBar component with dynamic width
const AppBarStyled = styled(AppBar)(({ theme, open, ismobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: '100%',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && ismobile === 'false' && {
    marginLeft: DRAWER_FULL,
    width: `calc(100% - ${DRAWER_FULL}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && ismobile === 'false' && {
    marginLeft: DRAWER_MINI,
    width: `calc(100% - ${DRAWER_MINI}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Drawer component 
const DrawerStyled = styled(Drawer)(({ theme, open, ismobile }) => ({
  width: open ? DRAWER_FULL : DRAWER_MINI,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    '& .MuiDrawer-paper': {
      width: DRAWER_FULL,
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }),
  ...(!open && {
    '& .MuiDrawer-paper': {
      width: DRAWER_MINI,
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  }),
  ...(ismobile === 'true' && {
    '& .MuiDrawer-paper': {
      width: DRAWER_FULL,
    },
  }),
}));

// Main content component
const Main = styled('main')(({ theme, open, ismobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: '100%',
  minHeight: '100vh',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(ismobile === 'false' && {
    marginLeft: open ? 0 : 0,
    width: `calc(100% - ${open ? DRAWER_FULL : DRAWER_MINI}px)`,
  }),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppLayout = () => {
  const [open, setOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { currentUser: contextUser, language } = useContext(AppContext);
  
  // Create translator function
  const t = createTranslator(language);

  useEffect(() => {
    if (contextUser) {
      setCurrentUser(contextUser);
    } else {
      const user = AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [contextUser, navigate]);

  // Set initial drawer state based on screen size
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  // Get selected menu item based on current path
  const getSelectedIndex = () => {
    const path = location.pathname;
    if (path === "/app") return 0;
    if (path.startsWith("/app/transactions") && !path.includes("/calendar")) return 1;
    if (path.startsWith("/app/transactions/calendar")) return 2;
    if (path.startsWith("/app/reports")) return 3;
    if (path.startsWith("/app/accounts")) return 4;
    if (path.startsWith("/app/transfers")) return 5;
    if (path.startsWith("/app/savings")) return 6;
    if (path.startsWith("/app/loans")) return 7;
    if (path.startsWith("/app/spending-goals")) return 8;
    if (path.startsWith("/app/templates")) return 9;
    if (path.startsWith("/app/diary")) return 10;
    if (path.startsWith("/app/journal-history")) return 11;
    return 0;
  };

  // Close drawer when navigating on mobile
  const handleNavigation = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <RouteLogger />
      
      {/* App Bar */}
      <AppBarStyled 
        position="fixed"
        open={open}
        ismobile={isMobile.toString()}
        elevation={1}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={open ? "close drawer" : "open drawer"}
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {isSmall ? t('app.shortName') : t('app.name')}
          </Typography>
          
          <Box>
            <IconButton
              size="large"
              edge="end"
              aria-label="user account"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 36,
                  height: 36
                }}
              >
                {currentUser?.fullName 
                  ? currentUser.fullName.charAt(0).toUpperCase() 
                  : currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            
            <UserPanel 
              anchorEl={userMenuAnchorEl}
              open={userMenuOpen}
              handleClose={handleUserMenuClose}
            />
          </Box>
        </Toolbar>
      </AppBarStyled>
      
      {/* Navigation Drawer */}
      <DrawerStyled
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        ismobile={isMobile.toString()}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <DrawerHeader>
          <Typography
            variant="h6"
            color="primary"
            sx={{
              flexGrow: 1,
              ml: 2,
              fontWeight: "bold",
              display: open ? 'block' : 'none'
            }}
          >
            {t('app.shortName')}
          </Typography>
          {isMobile && (
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        
        <List sx={{ mt: 1 }}>
          {/* Dashboard */}
          <ListItemButton
            component={Link}
            to="/app"
            selected={getSelectedIndex() === 0}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <DashboardIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.dashboard')} />}
          </ListItemButton>
          
          {/* Transactions */}
          <ListItemButton
            component={Link}
            to="/app/transactions"
            selected={getSelectedIndex() === 1}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <PaymentIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.transactions')} />}
          </ListItemButton>
          
          {/* Calendar View */}
          <ListItemButton
            component={Link}
            to="/app/transactions/calendar"
            selected={getSelectedIndex() === 2}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <CalendarViewIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.calendarView')} />}
          </ListItemButton>
          
          {/* Reports */}
          <ListItemButton
            component={Link}
            to="/app/reports"
            selected={getSelectedIndex() === 3}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <AssessmentIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.reports')} />}
          </ListItemButton>
          
          {/* Accounts */}
          <ListItemButton
            component={Link}
            to="/app/accounts"
            selected={getSelectedIndex() === 4}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <AccountsIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.accounts')} />}
          </ListItemButton>
          
          {/* Transfers */}
          <ListItemButton
            component={Link}
            to="/app/transfers"
            selected={getSelectedIndex() === 5}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <TransferIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.transfers')} />}
          </ListItemButton>
          
          {/* Savings */}
          <ListItemButton
            component={Link}
            to="/app/savings"
            selected={getSelectedIndex() === 6}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <SavingsIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.savings')} />}
          </ListItemButton>
          
          {/* Loans - New Item */}
          <ListItemButton
            component={Link}
            to="/app/loans"
            selected={getSelectedIndex() === 7}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <LoanIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Loan Simulation" />}
          </ListItemButton>
          
          {/* Spending Goals */}
          <ListItemButton
            component={Link}
            to="/app/spending-goals"
            selected={getSelectedIndex() === 8}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <GoalsIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.spendingGoals')} />}
          </ListItemButton>
          
          {/* Templates */}
          <ListItemButton
            component={Link}
            to="/app/templates"
            selected={getSelectedIndex() === 9}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <TemplatesIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.templates')} />}
          </ListItemButton>
          
          {/* Financial Diary */}
          <ListItemButton
            component={Link}
            to="/app/diary"
            selected={getSelectedIndex() === 10}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <DiaryIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.financialDiary')} />}
          </ListItemButton>
          
          {/* Journal History */}
          <ListItemButton
            component={Link}
            to="/app/journal-history"
            selected={getSelectedIndex() === 11}
            onClick={handleNavigation}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              justifyContent: open ? 'initial' : 'center',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0, 
              mr: open ? 3 : 'auto', 
              justifyContent: 'center' 
            }}>
              <HistoryIcon />
            </ListItemIcon>
            {open && <ListItemText primary={t('nav.journalHistory')} />}
          </ListItemButton>
        </List>
      </DrawerStyled>
      
      {/* Main Content */}
      <Main open={open} ismobile={isMobile.toString()}>
        <DrawerHeader />
        <Box
          sx={{
            bgcolor: "background.paper",
            p: { xs: 1.5, sm: 3 },
            borderRadius: 1,
            minHeight: "calc(100vh - 88px)",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default AppLayout;
