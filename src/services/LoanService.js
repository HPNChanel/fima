import axios from 'axios';
import authHeader from './auth-header';

// API URL for loans
const API_URL = 'http://localhost:8080/api/loans';

const getAllLoans = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getLoanById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const createLoan = (loanData) => {
  return axios.post(API_URL, loanData, { headers: authHeader() });
};

const makePayment = (loanId, installmentNumber) => {
  return axios.post(`${API_URL}/${loanId}/pay/${installmentNumber}`, {}, { headers: authHeader() });
};

// Add refresh callback pattern similar to transaction service
const refreshLoansData = async (callback) => {
  try {
    if (callback && typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    console.error("Error refreshing loans data:", error);
  }
};

// Update methods to use callback pattern
const createLoanWithCallback = (loanData, onSuccess) => {
  return createLoan(loanData)
    .then(response => {
      refreshLoansData(onSuccess);
      return response;
    });
};

const makePaymentWithCallback = (loanId, installmentNumber, onSuccess) => {
  return makePayment(loanId, installmentNumber)
    .then(response => {
      refreshLoansData(onSuccess);
      return response;
    });
};

const LoanService = {
  getAllLoans,
  getLoanById,
  createLoan: createLoanWithCallback,
  makePayment: makePaymentWithCallback
};

export default LoanService;
