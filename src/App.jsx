

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

import UserSettings from './pages/UserSettings/UserSettings';
import DonationRequest from './pages/DonationRequest/DonationRequest';
import AdminSettings from './pages/AdminSettings/AdminSettings';
import UserHistory from './pages/UserHistory/UserHistory';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import Logout from './pages/auth/Logout';
import ManageFeature from './pages/ManageFeature/ManageFeature';
import ProtectedRoute from "./routes/ProtectedRoute";
import DashRouter from './routes/DashRouter';
import UserDashboard from './pages/user/UserDashboard';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Wrap everything with your Layout */}

          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/all-genres" element={<AllGenres />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/borrowed" element={<Borrowed />} />
            <Route path="/fill-up-form/:id" element={<FillUpForm />} />
            <Route path="/upload" element={<UploadBookPage />} />
           
            <Route path="/manage-books" element={<ManageBooks />} />
            <Route path="/manage-category" element={<ManageCategory />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/history" element={<UserHistory />} />
            <Route path="/setting" element={<AdminSettings />} />
            <Route path="/manage-feature" element={<ManageFeature />} />
            <Route path="/donation-request" element={<DonationRequest />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "user"]}>
                  <DashRouter />
                </ProtectedRoute>
              }
            />
          {/* User-protected routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/borrowed" element={<Borrowed />} />
            <Route path="/fill-up-form" element={<FillUpForm />} />
            <Route path="/upload" element={<UploadBookPage />} />
            <Route path="/all-genres" element={<AllGenres />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/donation-request" element={<DonationRequest />} />
          </Route>

          {/* Admin-only routes */}
          <Route 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/manage-books" element={<ManageBooks />} />
            <Route path="/admin/manage-category" element={<ManageCategory />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* User-only routes */}
          <Route 
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/manage-books" element={<ManageBooks />} />
            <Route path="/user/manage-category" element={<ManageCategory />} />
            <Route path="/user/settings" element={<UserSettings />} />
          </Route>

          {/* Quick redirect aliases */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />



          
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