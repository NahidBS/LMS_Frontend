// // src/pages/auth/AuthCallback.jsx
// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../../api";

// export default function AuthCallback() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const handleAuth = async () => {
//       const params = new URLSearchParams(location.search);
//       const token = params.get("token");
//       if (!token) return navigate("/");

//       localStorage.setItem("token", token);
//       try {
//         const res = await api.get("/user");
//         localStorage.setItem("user", JSON.stringify(res.data));
//         navigate("/dashboard");
//       } catch (e) {
//         localStorage.removeItem("token");
//         navigate("/");
//       }
//     };
//     handleAuth();
//   }, [location, navigate]);

//   return <p>Authorizing...</p>;
// }