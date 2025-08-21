import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import * as jwtDecode from "jwt-decode"; // ✅ namespace import

// ---- AUTO LOGIN ----
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJJZCI6NSwiZW1haWwiOiJ0ZXN0dXNlcjFAZXhhbXBsZS5jb20iLCJzdWIiOiJ0ZXN0dXNlcjEiLCJpc3MiOiJMaWJyYXJ5TWFuYWdlbWVudFN5c3RlbSIsImF1ZCI6IkxpYnJhcnlVc2VycyIsImlhdCI6MTc1NTc1OTQwNywiZXhwIjoxNzU1NzYzMDA3fQ.My5dD4iPdVKDj4zFojadzgKTg-cJHTv_LN_lYay1lfI";

if (!localStorage.getItem("token")) {
  localStorage.setItem("token", DEV_TOKEN);

  const decoded = jwtDecode.default(DEV_TOKEN); // ✅ use .default
  console.log("Decoded user:", decoded);
  localStorage.setItem("user", JSON.stringify(decoded));
}
// ---------------------

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
