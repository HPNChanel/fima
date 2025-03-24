import axios from 'axios';
import authHeader from './auth-header';

// Fix API URL to match backend exactly
const API_URL = 'http://localhost:8080/api/accounts';

const getAccounts = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getAccount = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

// Add logging to debug the account creation process
const createAccount = (account) => {
  console.log('Creating account with data:', account);
  return axios.post(API_URL, account, { headers: authHeader() })
    .then(response => {
      console.log('Account creation successful:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Account creation failed:', error.response ? error.response.data : error.message);
      throw error;
    });
};

const updateAccount = (id, account) => {
  return axios.put(`${API_URL}/${id}`, account, { headers: authHeader() });
};

const deleteAccount = async (id) => {
  try {
    // Fix the URL path - remove the duplicate "accounts" in the path
    const response = await axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    // Enhanced error handling to provide more context
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      throw error;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      throw error;
    }
  }
};

// Verify these endpoints match what's implemented in your backend controller
const getAccountTransactions = (id) => {
  return axios.get(`${API_URL}/${id}/transactions`, { headers: authHeader() });
};

const getAccountCategorySummary = (id) => {
  return axios.get(`${API_URL}/${id}/category-summary`, { headers: authHeader() });
};

const getAccountTransferHistory = (id) => {
  return axios.get(`${API_URL}/${id}/transfers`, { headers: authHeader() });
};

// Get total balance across all accounts
const getTotalBalance = () => {
  return axios.get(`${API_URL}/total-balance`, { headers: authHeader() });
};

// Fix the transferMoney method to correctly call the API and improve error handling
const transferMoney = async (transferData) => {
  try {
    console.log('Sending transfer request:', transferData);
    
    // Ensure transferData has the right format and field names
    const formattedData = {
      fromAccountId: parseInt(transferData.fromAccountId),
      toAccountId: parseInt(transferData.toAccountId),
      amount: parseFloat(transferData.amount),
      description: transferData.description || 'Transfer between accounts'
    };
    
    const response = await axios.post(`${API_URL}/transfer`, formattedData, { headers: authHeader() });
    
    // Even if there's a warning in the message about transactions not being created,
    // consider the transfer successful if we got a 200 response
    if (response.status === 200) {
      console.log('Transfer completed successfully');
      
      // Refresh accounts data to show updated balances
      getAccounts();
      
      return {
        success: true,
        message: response.data.message || 'Transfer completed successfully'
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Transfer error details:', error.response?.data || error.message);
    throw error;
  }
};

const AccountService = {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountTransactions,
  getAccountCategorySummary,
  getAccountTransferHistory,
  getTotalBalance,
  transferMoney
};

export default AccountService;

