import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import * as jwtDecode from "jwt-decode"; // ✅ namespace import
import axios from "axios";

// ---- AUTO LOGIN ----


// const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJJZCI6NiwiZW1haWwiOiJ0ZXN0dXNlMXJAZXhhbXBsZS5jb20iLCJzdWIiOiJ0ZXN0dXNlcjEiLCJpc3MiOiJMaWJyYXJ5TWFuYWdlbWVudFN5c3RlbSIsImF1ZCI6IkxpYnJhcnlVc2VycyIsImlhdCI6MTc1NTc3MzMxMSwiZXhwIjoxNzU1Nzc2OTExfQ.Y0do5igFh9M0j-ehxD_W_MxpLCnHnttbRUgfH4Y1InY";

// if (!localStorage.getItem("token")) {
//   localStorage.setItem("token", DEV_TOKEN);

//   const decoded = jwtDecode.default(DEV_TOKEN); // ✅ use .default
//   console.log("Decoded user:", decoded);
//   localStorage.setItem("user", JSON.stringify(decoded));
// }
// ---------------------

// DEV AUTO LOGIN
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjQsImVtYWlsIjoiY2hhcmxpZS53aWxzb25AZW1haWwuY29tIiwic3ViIjoiYWRtaW4iLCJpc3MiOiJMaWJyYXJ5TWFuYWdlbWVudFN5c3RlbSIsImF1ZCI6IkxpYnJhcnlVc2VycyIsImlhdCI6MTc1NjExODAzNiwiZXhwIjoxNzU2MTIxNjM2fQ.2V2XmuheTdvgSKrO8u4oLvPGPq2TvUgCCLJCOUr55yE";
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
