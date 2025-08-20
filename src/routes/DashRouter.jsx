 // src/routes/DashRouter.jsx
import { Navigate } from "react-router-dom";

export default function DashRouter() {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
  }

  if (!user || !user.role) {
    // No user info, redirect to login/home
    return <Navigate to="/" replace />;
  }
   const role = user.role.toLowerCase();

  switch (role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "user":
      return <Navigate to="/user" replace />;
    default:
      // Unknown role, redirect to home or error page
      return <Navigate to="/" replace />;
  }
}

