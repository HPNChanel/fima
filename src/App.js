import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TransactionList from './pages/TransactionList';
import TransactionForm from './pages/TransactionForm';
import ReportList from './pages/ReportList';
import ReportForm from './pages/ReportForm';
import Layout from './components/Layout';
import AuthService from './services/auth.service';
import NotFound from './pages/NotFound';
import AccountList from './pages/AccountList';
import AccountForm from './pages/AccountForm';
import TransferPage from './pages/TransferPage';
import AccountDetail from './pages/AccountDetail';
import { createAppTheme } from './theme/theme';
import ProfilePage from './pages/ProfilePage';
import SpendingGoalsList from './pages/SpendingGoalsList';
import TemplateList from './pages/TemplateList';
import TransactionCalendar from './pages/TransactionCalendar';
import FinancialDiaryPage from './pages/FinancialDiaryPage';
import NotesHistoryPage from "./pages/NotesHistoryPage";
import JournalEntryForm from "./pages/JournalEntryForm";
import SavingsPage from './pages/SavingsPage';
import CreateSavingsPage from './pages/CreateSavingsPage';
import SavingsDetailPage from './pages/SavingsDetailPage';
import LoansPage from './pages/LoansPage';
import CreateLoanPage from './pages/CreateLoanPage';
import LoanDetailPage from './pages/LoanDetailPage';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import SettingsPage from './pages/SettingsPage';

export const AppContext = React.createContext();

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });
  
  // Add language state
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en'; // Default to English
  });
  
  const theme = createAppTheme(darkMode);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    
    if (user) {
      setCurrentUser(user);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  // Function to change the language
  const changeLanguage = (newLanguage) => {
    if (newLanguage === 'vi' || newLanguage === 'en') {
      setLanguage(newLanguage);
    }
  };

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <AppContext.Provider value={{ 
      darkMode, 
      toggleDarkMode,
      currentUser,
      language,
      setLanguage,
      changeLanguage // Add the function to the context
    }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Routes>
            <Route path="/" element={
              currentUser ? <Navigate to="/app" replace /> : <LandingPage />
            } />
            
            <Route path="/login" element={
              currentUser ? <Navigate to="/app" replace /> : <Login />
            } />
            <Route path="/register" element={
              currentUser ? <Navigate to="/app" replace /> : <Register />
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/app" element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }>
              <Route index element={<Dashboard />} />
              
              <Route path="transactions" element={<TransactionList />} />
              <Route path="transactions/add" element={<TransactionForm />} />
              <Route path="transactions/edit/:id" element={<TransactionForm />} />
              <Route path="transactions/calendar" element={<TransactionCalendar />} />
              
              <Route path="reports" element={<ReportList />} />
              <Route path="reports/add" element={<ReportForm />} />
              <Route path="reports/edit/:id" element={<ReportForm />} />
              
              <Route path="accounts" element={<AccountList />} />
              <Route path="accounts/add" element={<AccountForm />} />
              <Route path="accounts/edit/:id" element={<AccountForm />} />
              <Route path="accounts/:id" element={<AccountDetail />} />
              
              <Route path="transfers" element={<TransferPage />} />
              
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="spending-goals" element={<SpendingGoalsList />} />
              <Route path="templates" element={<TemplateList />} />
              <Route path="diary" element={<FinancialDiaryPage />} />
              <Route path="journal-history" element={<NotesHistoryPage />} />
              <Route path="journal-entry" element={<JournalEntryForm />} />
              
              <Route path="savings" element={<SavingsPage />} />
              <Route path="savings/new" element={<CreateSavingsPage />} />
              <Route path="savings/:id" element={<SavingsDetailPage />} />
              
              {/* Add routes for Loan Simulation */}
              <Route path="loans" element={<LoansPage />} />
              <Route path="loans/new" element={<CreateLoanPage />} />
              <Route path="loans/:id" element={<LoanDetailPage />} />
            </Route>
            
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
            <Route path="/transactions" element={<Navigate to="/app/transactions" replace />} />
            <Route path="/accounts" element={<Navigate to="/app/accounts" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>

          
        </LocalizationProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
