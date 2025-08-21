import { Navigate } from "react-router-dom";

export default function DashRouter() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.toLowerCase();

  if (role === "admin") {
    window.location.href = "/admin/dashboard";
    } else if (role === "user") {
    window.location.href = "/user/dashboard";
    } else {
    window.location.href = "/unauthorized";
    }

  if (!role) return <Navigate to="/" replace />;

  // Directly navigate to proper dashboard path
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "user") return <Navigate to="/user/dashboard" replace />;

  return <Navigate to="/unauthorized" replace />;
}
