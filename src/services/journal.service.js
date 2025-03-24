import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/journal';

const getAllJournalEntries = (params) => {
  return axios.get(API_URL, { 
    headers: authHeader(),
    params 
  });
};

const getJournalEntryById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const getJournalEntryByDate = (date) => {
  return axios.get(`${API_URL}/date/${date}`, { headers: authHeader() });
};

const createJournalEntry = (journalData, onSuccess) => {
  return axios.post(API_URL, journalData, { headers: authHeader() })
    .then(response => {
      refreshJournalData(onSuccess);
      return response;
    });
};

const updateJournalEntry = (id, journalData, onSuccess) => {
  return axios.put(`${API_URL}/${id}`, journalData, { headers: authHeader() })
    .then(response => {
      refreshJournalData(onSuccess);
      return response;
    });
};

const deleteJournalEntry = (id, onSuccess) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() })
    .then(response => {
      refreshJournalData(onSuccess);
      return response;
    });
};

const getJournalStats = () => {
  return axios.get(`${API_URL}/stats`, { headers: authHeader() });
};

const refreshJournalData = async (callback) => {
  try {
    if (callback && typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    console.error("Error refreshing journal data:", error);
  }
};

const JournalService = {
  getAllJournalEntries,
  getJournalEntryById,
  getJournalEntryByDate,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalStats
};

export default JournalService;
