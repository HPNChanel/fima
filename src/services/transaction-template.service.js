import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/transaction-templates';

const getTemplates = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const createTemplate = (template) => {
  // Make sure we're sending valid data
  const validTemplate = {
    ...template,
    amount: template.amount ? Number(template.amount) : null,
    accountId: template.accountId || null
  };
  
  console.log('Sending template data to server:', validTemplate);
  return axios.post(API_URL, validTemplate, { headers: authHeader() });
};

const deleteTemplate = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const TransactionTemplateService = {
  getTemplates,
  createTemplate,
  deleteTemplate
};

export default TransactionTemplateService;
