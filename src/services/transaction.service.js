import axios from 'axios';
import authHeader from './auth-header';

// Fix the API URL to match the backend configuration
// Remove trailing slash to avoid double slashes in URL construction
const API_URL = 'http://localhost:8080/api/transactions';

const getTransactions = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getTransaction = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

// Refresh dashboard data after transaction operations
// This is a helper function to be called after create, update, delete operations
const refreshDashboardData = async (callback) => {
  try {
    // Optional: If you have a central state management, you could trigger a refresh there
    if (callback && typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    console.error("Error refreshing dashboard data:", error);
  }
};

// Update the createTransaction method with better date handling and error checking
const createTransaction = (transactionData, onSuccess) => {
  try {
    // Make a copy of the data to avoid mutating the original
    const data = { ...transactionData };
    
    // Make sure date is properly formatted and handle timezone issues
    if (data.date) {
      // If it's already a Date object, create a timezone-safe ISO string
      if (data.date instanceof Date) {
        // Use date parts to create a string in YYYY-MM-DDT12:00:00Z format
        // This ensures the date stays the same regardless of timezone
        const year = data.date.getFullYear();
        const month = String(data.date.getMonth() + 1).padStart(2, '0');
        const day = String(data.date.getDate()).padStart(2, '0');
        const hours = data.date.getHours();
        const minutes = data.date.getMinutes();
        const seconds = data.date.getSeconds();
        
        // Create ISO string with local timezone offset to preserve the date
        data.date = `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        console.log('Date formatted to prevent timezone issues:', data.date);
      } 
      // String date handling remains the same
      else if (typeof data.date === 'string' && !isNaN(new Date(data.date).getTime())) {
        // If it's a string, we'll use it as is, assuming it's already properly formatted
        console.log('Using provided date string:', data.date);
      }
      else {
        console.warn('Warning: Invalid date format:', data.date);
        // Use current date as fallback, with timezone safety
        const now = new Date();
        now.setHours(12, 0, 0, 0); // Use noon to avoid date shift
        data.date = now.toISOString();
      }
    } else {
      // If no date was provided, use current date at noon
      const now = new Date();
      now.setHours(12, 0, 0, 0);
      data.date = now.toISOString();
    }
    
    // Log the transaction data being sent to the server
    console.log('Creating transaction with processed data:', data);
    
    return axios.post(API_URL, data, { headers: authHeader() })
      .then(response => {
        console.log('Transaction created successfully:', response.data);
        refreshDashboardData(onSuccess);
        return response;
      })
      .catch(error => {
        console.error('Error creating transaction:', error.response?.data || error);
        throw error;
      });
  } catch (error) {
    console.error('Error preparing transaction data:', error);
    throw error;
  }
};

const updateTransaction = (id, transactionData, onSuccess) => {
  return axios.put(`${API_URL}/${id}`, transactionData, { headers: authHeader() })
    .then(response => {
      refreshDashboardData(onSuccess);
      return response;
    });
};

const deleteTransaction = async (id) => {
  try {
    console.log(`Deleting transaction with ID: ${id}`);
    const response = await axios.delete(`${API_URL}/${id}`, { 
      headers: authHeader() 
    });
    
    console.log('Transaction delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    
    // Enhanced error logging for the constraint violation case
    if (error.response?.data?.message && 
        (error.response.data.message.includes('constraint') || 
         error.response.data.message.includes('foreign key'))) {
      console.error('Database constraint violation detected:', error.response.data.message);
    }
    
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Add a new function to delete multiple transactions
const deleteMultipleTransactions = async (ids) => {
  try {
    console.log(`Deleting multiple transactions: ${ids.join(', ')}`);
    const response = await axios.post(`${API_URL}/batch-delete`, { ids }, { 
      headers: authHeader() 
    });
    
    console.log('Batch delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to delete transactions:', error);
    
    // Enhanced error logging
    if (error.response?.data) {
      console.error('Error details:', error.response.data);
    }
    
    throw error;
  }
};

const getTransactionsByType = (type) => {
  return axios.get(`${API_URL}/by-type/${type}`, { headers: authHeader() });
};

const getTransactionsByCategory = (category) => {
  return axios.get(`${API_URL}/by-category/${category}`, { headers: authHeader() });
};

// Add function to fetch transactions by account
const getTransactionsByAccount = (accountId) => {
  return axios.get(`${API_URL}/by-account/${accountId}`, { headers: authHeader() });
};

const updateTransactionNotes = (id, notes) => {
  return axios.put(API_URL + id + '/notes', { notes }, { headers: authHeader() });
};

// Add function to get transaction history
const getTransactionHistory = (id) => {
  return axios.get(`${API_URL}/${id}/history`, { headers: authHeader() });
};

// Add function to check if a transaction has history
const hasTransactionHistory = (id) => {
  return axios.get(`${API_URL}/${id}/has-history`, { headers: authHeader() });
};

// Improved function to get transactions for calendar with error handling
const getTransactionsForCalendar = (month) => {
  // Ensure month parameter is properly formatted (YYYY-MM)
  let monthParam = month;
  
  if (!monthParam || !monthParam.match(/^\d{4}-\d{2}$/)) {
    // If month is invalid or missing, use current month
    const now = new Date();
    monthParam = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
  
  return axios.get(`${API_URL}/calendar?month=${monthParam}`, { headers: authHeader() });
};

// Add function to fetch transactions by date
const getTransactionsByDate = (date) => {
  return axios.get(`${API_URL}/by-date?date=${date}`, { headers: authHeader() });
};

const TransactionService = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteMultipleTransactions, // Add the new method
  getTransactionsByType,
  getTransactionsByCategory,
  getTransactionsByAccount,
  updateTransactionNotes,
  getTransactionHistory,
  hasTransactionHistory,
  getTransactionsForCalendar,  // Add this to the service object
  getTransactionsByDate
};

export default TransactionService;
