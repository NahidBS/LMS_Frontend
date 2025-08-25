import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import * as jwtDecode from "jwt-decode"; // ✅ namespace import
import axios from "axios";

// ---- AUTO LOGIN ----

// DEV AUTO LOGIN
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjQsImVtYWlsIjoiY2hhcmxpZS53aWxzb25AZW1haWwuY29tIiwic3ViIjoiYWRtaW4iLCJpc3MiOiJMaWJyYXJ5TWFuYWdlbWVudFN5c3RlbSIsImF1ZCI6IkxpYnJhcnlVc2VycyIsImlhdCI6MTc1NjEyODEwNywiZXhwIjoxNzU2MTMxNzA3fQ.iZNGIiuwbMyLt4GJ5AmSMdyVgbP3Uq0YoziAVt19hIc";
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
