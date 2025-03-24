import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/diary';

const getAllDiaryEntries = (params) => {
  return axios.get(API_URL, { 
    headers: authHeader(),
    params 
  });
};

const getDiaryEntryById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const getDiaryEntryByDate = (date) => {
  return axios.get(`${API_URL}/date/${date}`, { headers: authHeader() });
};

const createDiaryEntry = (diaryData, onSuccess) => {
  return axios.post(API_URL, diaryData, { headers: authHeader() })
    .then(response => {
      refreshDiaryData(onSuccess);
      return response;
    });
};

const updateDiaryEntry = (id, diaryData, onSuccess) => {
  return axios.put(`${API_URL}/${id}`, diaryData, { headers: authHeader() })
    .then(response => {
      refreshDiaryData(onSuccess);
      return response;
    });
};

const deleteDiaryEntry = (id, onSuccess) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() })
    .then(response => {
      refreshDiaryData(onSuccess);
      return response;
    });
};

const getDiaryStats = () => {
  return axios.get(`${API_URL}/stats`, { headers: authHeader() });
};

const refreshDiaryData = async (callback) => {
  try {
    if (callback && typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    console.error("Error refreshing diary data:", error);
  }
};

const DiaryService = {
  getAllDiaryEntries,
  getDiaryEntryById,
  getDiaryEntryByDate,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  getDiaryStats
};

export default DiaryService;
