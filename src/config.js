// Central configuration file for API settings

import axios from 'axios';
// Base URL for all API requests
export const API_BASE_URL = 'http://localhost:8080/api';

// Timeout duration for API requests (in milliseconds)
export const API_TIMEOUT = 30000;

// Configure axios defaults (optional)

// Set default timeout
axios.defaults.timeout = API_TIMEOUT;

// Add a request interceptor for logging or token refresh
axios.interceptors.request.use(
  config => {
    // You can log requests or modify them before they're sent
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
axios.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('Unauthorized access - you might need to log in again');
          break;
        case 403:
          console.log('Forbidden - you don\'t have permission to access this resource');
          break;
        case 404:
          console.log('Resource not found - the requested endpoint may not exist');
          break;
        case 500:
          console.log('Server error - please try again later');
          break;
        default:
          console.log(`Error with status code: ${error.response.status}`);
      }
    } else if (error.request) {
      console.log('Network error - server is not responding');
    }
    return Promise.reject(error);
  }
);
