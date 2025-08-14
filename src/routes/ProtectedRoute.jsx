// // src/routes/ProtectedRoute.jsx
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/" replace />;

//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// }