import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/chat';

/**
 * Service for interacting with the chat API
 */
const ChatService = {
  /**
   * Send a message to the chatbot
   * @param {string} message - The message to send to the chatbot
   * @returns {Promise} - Promise with the response from the API
   */
  sendMessage: (message) => {
    return axios.post(API_URL, { message }, { headers: authHeader() });
  },
  
  /**
   * Get chat history (if implemented)
   * @returns {Promise} - Promise with the chat history
   */
  getChatHistory: () => {
    return axios.get(`${API_URL}/history`, { headers: authHeader() });
  }
};

export default ChatService;
