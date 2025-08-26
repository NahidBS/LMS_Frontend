// UserSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  LogOut,
  Settings,
  HandHeart,
} from "lucide-react";

export default function UserSidebar() {
  const { pathname } = useLocation();

  // style tokens
  const base = "flex items-center gap-2";
  const on = `${base} text-sky-600 font-medium`;
  const off = `${base} text-gray-700 hover:text-sky-500`;

  // helpers
  const exact = (...paths) => paths.some((p) => pathname === p);
  const has = (...prefixes) =>
    prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // active checks
  const isDashboard = exact("/user/dashboard", "/user");
  const isUpload = has("/donation-request", "/user/upload");
  const isHistory = has("/history", "/user/history");
  const isSettings = has("/settings", "/user/settings");

  return (
    <aside className="w-60 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">My Library</h2>
        <ul className="space-y-3">
          <li>
            <Link to="/user/dashboard" className={isDashboard ? on : off}>
              <BookOpen size={18} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/donation-request" className={isUpload ? on : off}>
              <HandHeart size={18} /> Donation Request
            </Link>
          </li>
          <li>
            <Link to="/history" className={isHistory ? on : off}>
              <CheckCircle size={18} /> History
            </Link>
          </li>
          {/* <li>
            <Link to="/settings" className={isSettings ? on : off}>
              <Settings size={18} /> Settings
            </Link>
          </li> */}
        </ul>
      </div>
      <div>
        <Link
          to="/"
          className="flex items-center gap-2 text-red-600 font-medium hover:underline underline-offset-4"
        >
          <LogOut size={18} /> Logout
        </Link>
      </div>
    </aside>
  );
}



// // UserSidebar.jsx
// import { Link, useLocation } from "react-router-dom";
// import { BookOpen, Clock, CheckCircle, LogOut, Upload, Settings, HandHeart } from "lucide-react";

// export default function UserSidebar({ active = "dashboard" }) {
//   const { pathname } = useLocation();

//   // style tokens (unchanged)
//   const base = "flex items-center gap-2";
//   const on  = `${base} text-sky-600 font-medium`;
//   const off = `${base} text-gray-700 hover:text-sky-500`;

//   // helpers to decide "active" by route (supports /user, /app, /employee prefixes)
//   const exact = (...paths) => paths.some((p) => pathname === p);
//   const has   = (...prefixes) =>
//     prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));

//   const isDashboard =
//     active === "dashboard" ||
//     exact("/user", "/app", "/employee");

//   const isUpload =
//     active === "upload" ||
//     has("/donation-request", "/user/upload", "/app/upload", "/employee/upload");

//   const isLoans =
//     active === "loans" ||
//     has("/loans", "/user/loans", "/app/loans", "/employee/loans");

//   const isHistory =
//     active === "history" ||
//     has("/history", "/user/history", "/app/history", "/employee/history");

//   const isSettings =
//     active === "settings" ||
//     has("/settings", "/user/settings", "/app/settings", "/employee/settings");

//   return (
//     <aside className="w-60 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
//       <div>
//         <h2 className="text-xl font-bold mb-6">My Library</h2>
//         <ul className="space-y-3">
//           <li>
//             <Link to="/user/dashboard" className={isDashboard ? on : off}>
//               <BookOpen size={18} /> Dashboard
//             </Link>
//           </li>
//           <li>
//             <Link to="/donation-request" className={isUpload ? on : off}>
//               <HandHeart size={18} /> Donation Request
//             </Link>
//           </li>
//           {/* <li>
//             <Link to="/loans" className={isLoans ? on : off}>
//               <Clock size={18} /> My Loans
//             </Link>
//           </li> */}
//           <li>
//             <Link to="/history" className={isHistory ? on : off}>
//               <CheckCircle size={18} /> History
//             </Link>
//           </li>
//           <li>
//             <Link to="/settings" className={isSettings ? on : off}>
//               <Settings size={18} /> Settings
//             </Link>
//           </li>
//         </ul>
//       </div>
//       <div>
//         <Link
//           to="/"
//           className="flex items-center gap-2 text-red-600 font-medium hover:underline underline-offset-4"
//         >
//           <LogOut size={18} /> Logout
//         </Link>
//       </div>
//     </aside>
//   );
// }