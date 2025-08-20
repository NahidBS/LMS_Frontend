// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/" replace />;

//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   const userRole = user?.role?.toLowerCase();
//   const allowed = allowedRoles?.map(r => r.toLowerCase());

//   if (allowedRoles && !allowed.includes(userRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// }
// // src/routes/ProtectedRoute.jsx