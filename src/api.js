import axios from 'axios';

// Replace this with your real base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage or any auth store
// const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTcyLjE2LjIyNy4xNzM6ODAwMC9hcGkvbG9naW4iLCJpYXQiOjE3NTQ5ODk0OTgsImV4cCI6MTc1NTA3NTg5OCwibmJmIjoxNzU0OTg5NDk4LCJqdGkiOiJ1R2NZV2ZiY25XVGd5MmZLIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.-QybP9DYNdA1u1PGkz5CtUbqzuXzQu3XHUHFMXiu3ew";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // Authorization: `Bearer ${token}`,  // Send token with every request
    'Content-Type': 'application/json',
  },
});

export default api;