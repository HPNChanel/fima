import axios from 'axios';
import authHeader from './auth-header';

// Fix the API URL to match the backend configuration
// Remove trailing slash to avoid double slashes in URL construction
const API_URL = 'http://localhost:8080/api/transfers';

const getTransfers = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getTransfer = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const createTransfer = (transfer) => {
  return axios.post(API_URL, transfer, { headers: authHeader() });
};

// Add functions for additional transfer operations if needed
const getTransfersByAccount = (accountId) => {
  return axios.get(`${API_URL}/by-account/${accountId}`, { headers: authHeader() });
};

const TransferService = {
  getTransfers,
  getTransfer,
  createTransfer,
  getTransfersByAccount
};

export default TransferService;
