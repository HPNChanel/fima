import axios from 'axios';
import authHeader from './auth-header';

// Fix the API URL to match the backend configuration
// Remove trailing slash to avoid double slashes in URL construction
const API_URL = 'http://localhost:8080/api/reports';

const getReports = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getReport = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const createReport = (report) => {
  return axios.post(API_URL, report, { headers: authHeader() });
};

const updateReport = (id, report) => {
  return axios.put(`${API_URL}/${id}`, report, { headers: authHeader() });
};

const deleteReport = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const getReportsByType = (type) => {
  return axios.get(`${API_URL}/by-type/${type}`, { headers: authHeader() });
};

const getSpendingComparison = () => {
  return axios.get(`${API_URL}/spending-comparison`, { headers: authHeader() });
};

const ReportService = {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  getReportsByType,
  getSpendingComparison
};

export default ReportService;
