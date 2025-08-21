import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import * as jwtDecode from "jwt-decode"; // ✅ namespace import

// ---- AUTO LOGIN ----
// const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOjQsImVtYWlsIjoiY2hhcmxpZS53aWxzb25AZW1haWwuY29tIiwic3ViIjoiYWRtaW4iLCJpc3MiOiJMaWJyYXJ5TWFuYWdlbWVudFN5c3RlbSIsImF1ZCI6IkxpYnJhcnlVc2VycyIsImlhdCI6MTc1NTc3MTE4NiwiZXhwIjoxNzU1Nzc0Nzg2fQ.VM0N2oBLqOtfnOtIUfvzEG-snDGztKaH6mb0PFTSlB8";

const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJJZCI6NSwiZW1haWwiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsInN1YiI6InRlc3R1c2VyIiwiaXNzIjoiTGlicmFyeU1hbmFnZW1lbnRTeXN0ZW0iLCJhdWQiOiJMaWJyYXJ5VXNlcnMiLCJpYXQiOjE3NTU3Njk5MzUsImV4cCI6MTc1NTc3MzUzNX0.1V5E79JcJxRweHcX43n0Yd8R61syoWX0ARkK8X7ITvE";

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
