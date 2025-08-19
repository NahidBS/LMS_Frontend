import axios from 'axios';

// Replace this with your real base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage or any auth store
// const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJJZCI6NSwiZW1haWwiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsInN1YiI6InRlc3R1c2VyIiwiaXNzIjoiTGlicmFyeU1hbmFnZW1lbnRTeXN0ZW0iLCJhdWQiOiJMaWJyYXJ5VXNlcnMiLCJpYXQiOjE3NTU1MjEyODMsImV4cCI6MTc1NTUyNDg4M30.JiWnfJ1nbagpriQu0-n29jsMe7AFTeVRp64mjo6kBAg";
// const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjUsImVtYWlsIjoiZmFoaW1AZXhhbXBsZS5jb20iLCJzdWIiOiJuYWhpZCIsImlzcyI6IkxpYnJhcnlNYW5hZ2VtZW50U3lzdGVtIiwiYXVkIjoiTGlicmFyeVVzZXJzIiwiaWF0IjoxNzU1NTIxODgxLCJleHAiOjE3NTU1MjU0ODF9.CiDsIDb4Xjm7YlBAUmSazZ6fRhCDOCgFo9i7vdHkJzE";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // Authorization: `Bearer ${token}`,  // Send token with every request
    'Content-Type': 'application/json',
  },
});

export default api;