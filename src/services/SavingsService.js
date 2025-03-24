import axios from 'axios';
import authHeader from './auth-header';

// Fix the API URL to match the backend configuration
const API_URL = 'http://localhost:8080/api/savings';

const getAllSavingsAccounts = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getSavingsAccountById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const createSavingsAccount = (savingsData) => {
  return axios.post(API_URL, savingsData, { headers: authHeader() });
};

const getSavingsProjection = (id) => {
  return axios.get(`${API_URL}/${id}/projection`, { headers: authHeader() });
};

const withdrawSavings = (id) => {
  return axios.post(`${API_URL}/${id}/withdraw`, {}, { headers: authHeader() });
};

// Add refresh callback pattern similar to transaction service
const refreshSavingsData = async (callback) => {
  try {
    if (callback && typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    console.error("Error refreshing savings data:", error);
  }
};

// Update methods to use callback pattern
const createSavingsAccountWithCallback = (savingsData, onSuccess) => {
  return createSavingsAccount(savingsData)
    .then(response => {
      refreshSavingsData(onSuccess);
      return response;
    });
};

const withdrawSavingsWithCallback = (id, onSuccess) => {
  return withdrawSavings(id)
    .then(response => {
      refreshSavingsData(onSuccess);
      return response;
    });
};

const SavingsService = {
  getAllSavingsAccounts,
  getSavingsAccountById,
  createSavingsAccount: createSavingsAccountWithCallback,
  getSavingsProjection,
  withdrawSavings: withdrawSavingsWithCallback
};

export default SavingsService;
