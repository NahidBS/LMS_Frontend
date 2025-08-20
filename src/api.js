import axios from 'axios';

// Replace this with your real base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage or any auth store
// const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJJZCI6NSwiZW1haWwiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsInN1YiI6InRlc3R1c2VyIiwiaXNzIjoiTGlicmFyeU1hbmFnZW1lbnRTeXN0ZW0iLCJhdWQiOiJMaWJyYXJ5VXNlcnMiLCJpYXQiOjE3NTU1MjEyODMsImV4cCI6MTc1NTUyNDg4M30.JiWnfJ1nbagpriQu0-n29jsMe7AFTeVRp64mjo6kBAg";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjUsImVtYWlsIjoiYWRtaW4xQGV4YW1wbGUuY29tIiwic3ViIjoiYWRtaW4xIiwiaXNzIjoiTGlicmFyeU1hbmFnZW1lbnRTeXN0ZW0iLCJhdWQiOiJMaWJyYXJ5VXNlcnMiLCJpYXQiOjE3NTU2OTgwMjAsImV4cCI6MTc1NTcwMTYyMH0.3IrTbrRjkCxasiqpJKGQT8F_N3415xKno0B9eeXpKNM";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,  // Send token with every request
    'Content-Type': 'application/json',
  },
});

export default api;