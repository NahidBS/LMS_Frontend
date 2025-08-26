import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import * as jwtDecode from "jwt-decode"; // ✅ namespace import
import axios from "axios";

// ---- AUTO LOGIN ----

// DEV AUTO LOGIN
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJJZCI6NSwiZW1haWwiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsInN1YiI6InRlc3R1c2VyIiwiaXNzIjoiTGlicmFyeU1hbmFnZW1lbnRTeXN0ZW0iLCJhdWQiOiJMaWJyYXJ5VXNlcnMiLCJpYXQiOjE3NTYxOTY4ODgsImV4cCI6MTc1NjIwMDQ4OH0.TAst97_VW0udPUghvuq_hU-iFyKfegABJm7mFIHgnns";
const decoded = jwtDecode.default(DEV_TOKEN);
localStorage.setItem("token", DEV_TOKEN);
localStorage.setItem("user", JSON.stringify(decoded));
console.log("DEV user set:", decoded);

// --- set Axios default header ---
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
