import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const register = (username, email, password, fullName) => {
  return axios.post(API_URL + '/signup', {
    username,
    email,
    password,
    fullName
  });
};

const login = (username, password) => {
  return axios.post(API_URL + '/signin', {
    username,
    password
  })
  .then((response) => {
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
  // Force navigation to landing page on logout
  window.location.href = '/';
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Add resetPassword method
const resetPassword = (email, newPassword) => {
  return axios.post(API_URL + '/reset-password', {
    email,
    newPassword
  });
};

// Add changePassword method for completeness
const changePassword = (currentPassword, newPassword) => {
  return axios.post(API_URL + '/change-password', {
    currentPassword,
    newPassword
  });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  resetPassword,
  changePassword
};

export default AuthService;
