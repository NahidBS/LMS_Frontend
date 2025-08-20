// src/pages/auth/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        // Call backend logout (adjust endpoint if different)
        await api.post("/logout");
      } catch (err) {
        console.error("Logout request failed:", err);
      } finally {
        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to home/login
        navigate("/");
      }
    };

    doLogout();
  }, [navigate]);

  return <p>Logging out...</p>;
}