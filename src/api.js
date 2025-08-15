import axios from 'axios';

// Replace this with your real base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage or any auth store
// const token = "eyJ0eXAiOiJu3XHUHFMXiu3ew";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // Authorization: `Bearer ${token}`,  // Send token with every request
    'Content-Type': 'application/json',
  },
});

export default api;