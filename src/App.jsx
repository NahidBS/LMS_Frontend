// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from './pages/Home/Home';
// import Navbar from './components/Navbar/Navbar';
// import BookDetails from './pages/BookDetails/BookDetails';
// import Layout from './components/Layout/Layout';
// import Borrowed from './pages/Borrowed/Borrowed';
// import FillUpForm from './components/FillUpForm/FillUpForm';
// import Dashboard from './pages/Dashboad/Dashboad';
// import UploadBookPage from './components/Upload/UploadBookPage';
// import AllGenres from './pages/AllGenres/AllGenres';
// import ManageBooks from './pages/ManageBooks/ManageBooks';
// import ManageCategory from './pages/ManageCategory/ManageCategory';

// function App() {
//   return (
//     <BrowserRouter>
//     < Navbar />
//           <main className="flex-grow">
//       <Routes>
//                 <Route element={<Layout />}>
//         <Route path="/" element={<Home />} />
//                   <Route path="/book/:id" element={<BookDetails />} /> {/* <-- ADD THE NEW ROUTE */}
//                   <Route path="/borrowed" element={<Borrowed />} />
//                   <Route path="/fill-up-form" element={<FillUpForm />} />
//                   <Route path="/dashboard" element={<Dashboard />} />
//                   <Route path="/upload" element={<UploadBookPage />} />
//                   <Route path="/all-genres" element={<AllGenres />} />
//                           <Route path="/manage-books" element={<ManageBooks />} />
//                                   <Route path="/manage-category" element={<ManageCategory />} />
//                           </Route>
//       </Routes>
//             </main>
//     </BrowserRouter>
//   );
// }

// export default App;

// App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Layout from "./components/Layout/Layout";

import Home from "./pages/Home/Home";
import BookDetails from "./pages/BookDetails/BookDetails";
import Borrowed from "./pages/Borrowed/Borrowed";
import FillUpForm from "./components/FillUpForm/FillUpForm";
import Dashboard from "./pages/Dashboad/Dashboad";
import UploadBookPage from "./components/Upload/UploadBookPage";
import AllGenres from "./pages/AllGenres/AllGenres";
import ManageBooks from "./pages/ManageBooks/ManageBooks";
import ManageCategory from "./pages/ManageCategory/ManageCategory";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Wrap everything with your Layout */}
          <Route element={<Layout />}>
            {/* Canonical routes */}
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/borrowed" element={<Borrowed />} />
            <Route path="/fill-up-form" element={<FillUpForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadBookPage />} />
            <Route path="/all-genres" element={<AllGenres />} />
            <Route path="/manage-books" element={<ManageBooks />} />
            <Route path="/manage-category" element={<ManageCategory />} />

            {/* ---- QUICK ALIASES so /admin/* also works ---- */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/borrowed" element={<Borrowed />} />
            <Route path="/admin/fill-up-form" element={<FillUpForm />} />
            <Route path="/admin/upload" element={<UploadBookPage />} />
            <Route path="/admin/all-genres" element={<AllGenres />} />
            <Route path="/admin/manage-books" element={<ManageBooks />} />
            <Route path="/admin/manage-category" element={<ManageCategory />} />

            {/* Fallbacks */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;



// //With login auth - 13-08-2025
// // src/App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./components/Navbar/Navbar";
// import Layout from "./components/Layout/Layout";

// import Home from "./pages/Home/Home";
// import BookDetails from "./pages/BookDetails/BookDetails";
// import Borrowed from "./pages/Borrowed/Borrowed";
// import FillUpForm from "./components/FillUpForm/FillUpForm";
// import UploadBookPage from "./components/Upload/UploadBookPage";
// import AllGenres from "./pages/AllGenres/AllGenres";

// import AuthCallback from "./pages/auth/AuthCallback";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import DashRouter from "./routes/DashRouter";

// import AdminDashboard from "./pages/admin/AdminDashboard";
// import UserDashboard from "./pages/user/UserDashboard";
// import ManageBooks from "./pages/ManageBooks/ManageBooks";
// import ManageCategory from "./pages/ManageCategory/ManageCategory";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <main className="flex-grow">
//         <Routes>
//           {/* Public pages */}
//           <Route element={<Layout />}>
//             <Route path="/" element={<Home />} />
//             <Route path="/book/:id" element={<BookDetails />} />
//             <Route path="/borrowed" element={<Borrowed />} />
//             <Route path="/fill-up-form" element={<FillUpForm />} />
//             <Route path="/upload" element={<UploadBookPage />} />
//             <Route path="/all-genres" element={<AllGenres />} />
//           </Route>

//           {/* Auth callback */}
//           <Route path="/auth/callback" element={<AuthCallback />} />

//           {/* Role aware dashboard entry */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "user"]}>
//                 <DashRouter />
//               </ProtectedRoute>
//             }
//           />

//           {/* Admin area: uses your original Dashboard design */}
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute allowedRoles={["admin"]}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/manage-books"
//             element={
//               <ProtectedRoute allowedRoles={["admin"]}>
//                 <ManageBooks />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/manage-category"
//             element={
//               <ProtectedRoute allowedRoles={["admin"]}>
//                 <ManageCategory />
//               </ProtectedRoute>
//             }
//           />

//           {/* User area (your existing component) */}
//           <Route
//             path="/app"
//             element={
//               <ProtectedRoute allowedRoles={["user"]}>
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// }