import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/spending-goals';

const getSpendingGoals = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const createSpendingGoal = (spendingGoal) => {
  return axios.post(API_URL, spendingGoal, { headers: authHeader() });
};

const deleteSpendingGoal = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const SpendingGoalService = {
  getSpendingGoals,
  createSpendingGoal,
  deleteSpendingGoal
};

export default SpendingGoalService;
