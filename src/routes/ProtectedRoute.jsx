import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userRole = user?.role ? user.role.toLowerCase() : null;

  if (!userRole) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
