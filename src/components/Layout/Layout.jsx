

// // components/Layout/Layout.jsx
// import { Outlet, useLocation, Link } from "react-router-dom";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import Newsletter from "../Newsletter/Newsletter";
// import Sidebar from "../Sidebar/Sidebar";

// export default function Layout() {
//   const location = useLocation();
//   const isBookDetailsPage = location.pathname.startsWith("/book/");
//   const isHomePage = location.pathname === "/";

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Fixed Navbar */}
//       <Navbar />

//       {/* Spacer for fixed navbar height */}
// <div className="pt-16">
//   {/* Blue Header Section */}
//   <div className="bg-sky-500 text-white">
//     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//       <div className="py-4 sm:py-6">
//         <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
//           My Library
//         </h1>
//       </div>
//     </div>
//   </div>

//   {/* Breadcrumb with links */}
//   <div className="bg-gray-100 border-b border-gray-200">
//     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//       <nav className="flex items-center py-2 text-sm" aria-label="Breadcrumb">
//         <ol className="inline-flex items-center space-x-1 sm:space-x-2">
//           <li>
//             <Link
//               to="/dashboard"
//               className="text-gray-600 hover:text-sky-600 hover:underline transition-colors"
//             >
//               Dashboard
//             </Link>
//           </li>
//           <li>
//             <span className="text-gray-400">/</span>
//           </li>
//           <li>
//             <Link
//               to="/"
//               className="text-gray-600 hover:text-sky-600 hover:underline transition-colors"
//             >
//               Site Page
//             </Link>
//           </li>
//           <li>
//             <span className="text-gray-400">/</span>
//           </li>
//           <li>
//             <Link
//               to="/all-genres"
//               className="font-medium text-gray-900 hover:text-sky-600 hover:underline transition-colors"
//             >
//               My Library
//             </Link>
//           </li>
//         </ol>
//       </nav>
//     </div>
//   </div>

//   {/* Main Content Layout */}
//   <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
//     <div className="flex flex-col md:flex-row gap-6">
//       {/* Sidebar appears ONLY on Book Details here (Home renders its own) */}
//       {isBookDetailsPage && (
//         <aside className="w-full md:w-64 lg:w-72 flex-none">
//           <Sidebar />
//         </aside>
//       )}

//       {/* Main content */}
//       <main className="flex-1 min-w-0">
//         <Outlet />
//       </main>
//     </div>
//   </div>
// </div>


//       {/* Newsletter only on home page */}
//       {isHomePage && <Newsletter />}
//       <Footer />
//     </div>
//   );
// }




// // components/Layout/Layout.jsx
// import { Outlet, useLocation, Link } from "react-router-dom";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import Newsletter from "../Newsletter/Newsletter";
// import Sidebar from "../Sidebar/Sidebar";

// export default function Layout() {
//   const location = useLocation();
//   const isBookDetailsPage = location.pathname.startsWith("/book/");
//   const isHomePage = location.pathname === "/";

//   const pageTitle = "Dashboard";

//   // Colors locked to your screenshots
//   const BASE_BLUE = "#06B5EE"; // flat header blue
//   const BTN_BG = "#0696C9";
//   const BTN_BG_H = "#058AB9";

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Fixed Navbar (unchanged) */}
//       <Navbar />

//       {/* Spacer for fixed navbar height */}
//       <div className="pt-16">
//         {/* ================== BLUE HEADER ================== */}
//         <div className="relative overflow-hidden">
//           {/* Flat blue bar */}
//           <div style={{ backgroundColor: BASE_BLUE }} className="h-28 sm:h-32">
//             <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
//               <div className="relative z-10 h-full flex items-center justify-between">
//                 <h1 className="text-white text-3xl sm:text-4xl font-bold">
//                   {pageTitle}
//                 </h1>

//                 <button
//                   type="button"
//                   className="hidden sm:inline-flex items-center rounded text-white text-sm font-semibold px-4 py-2 shadow-sm transition"
//                   style={{ backgroundColor: BTN_BG }}
//                   onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BTN_BG_H)}
//                   onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BTN_BG)}
//                 >
//                   Customise this page
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* === White polygon SHADOWS over the blue bar (two layers) === */}
//           {/* TOP ridge — sharper peak slightly left of center, then gentle fall (matches close-up 1) */}
//           <svg
//             className="absolute inset-0 w-full h-full"
//             viewBox="0 0 1440 200"
//             preserveAspectRatio="none"
//             aria-hidden="true"
//           >
//             <polygon
//               fill="white"
//               opacity="0.12"
//               points="
//                 0,96     180,110   360,104   560,114
//                 760,62   980,96    1200,88   1440,94
//                 1440,0   0,0
//               "
//             />
//           </svg>

//           {/* BOTTOM ridge — broad shelf under the button area (matches close-up 2) */}
//           <svg
//             className="absolute inset-0 w-full h-full"
//             viewBox="0 0 1440 200"
//             preserveAspectRatio="none"
//             aria-hidden="true"
//           >
//             <polygon
//               fill="white"
//               opacity="0.10"
//               points="
//                 0,156    200,134   420,150   640,132
//                 860,146  1100,132  1320,146  1440,150
//                 1440,0   0,0
//               "
//             />
//           </svg>
//         </div>
//         {/* ================ /BLUE HEADER =================== */}

//         {/* Breadcrumb bar (centered, unchanged) */}
//         <div className="bg-[#F1F1F2] border-t border-[#E7E7E9]">
//           <div className="mx-auto max-w-7xl">
//             <div className="py-3 text-center">
//               <Link
//                 to="/dashboard"
//                 className="text-gray-700 text-sm sm:text-base font-medium hover:text-sky-600"
//               >
//                 {pageTitle}
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Layout (unchanged) */}
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col md:flex-row gap-6">
//             {isBookDetailsPage && (
//               <aside className="w-full md:w-64 lg:w-72 flex-none">
//                 <Sidebar />
//               </aside>
//             )}
//             <main className="flex-1 min-w-0">
//               <Outlet />
//             </main>
//           </div>
//         </div>
//       </div>

//       {/* Newsletter only on home page (unchanged) */}
//       {isHomePage && <Newsletter />}
//       <Footer />
//     </div>
//   );
// }



// // components/Layout/Layout.jsx
// import { Outlet, useLocation, Link } from "react-router-dom";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import Newsletter from "../Newsletter/Newsletter";
// import Sidebar from "../Sidebar/Sidebar";

// export default function Layout() {
//   const location = useLocation();
//   const isBookDetailsPage = location.pathname.startsWith("/book/");
//   const isHomePage = location.pathname === "/";

//   // If you want a dynamic title, swap this with your own logic:
//   const pageTitle = "Dashboard";

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Fixed Navbar */}
//       <Navbar />

//       {/* Spacer for fixed navbar height */}
//       <div className="pt-16">
//         {/* ===== Blue Header: matches demo exactly ===== */}
//         {/* The background color is now #05b3f3 with 40px vertical padding */}
//         <div className="relative overflow-hidden bg-[#05b3f3] py-10 h-28 sm:h-32">
//           {/* Polygon “mountains” layer 1 */}
//           <svg
//             className="absolute bottom-0 left-0 w-full h-full"
//             viewBox="0 0 1440 150"
//             preserveAspectRatio="none"
//           >
//             <polygon
//               fill="#42A5F5" // lighter blue with opacity
//               fillOpacity="0.5"
//               points="0,80 300,40 600,70 900,30 1200,60 1440,20 1440,0 0,0"
//             />
//           </svg>

//           {/* Polygon “mountains” layer 2 */}
//           <svg
//             className="absolute bottom-0 left-0 w-full h-full"
//             viewBox="0 0 1440 150"
//             preserveAspectRatio="none"
//           >
//             <polygon
//               fill="#42A5F5" // lighter blue with opacity
//               fillOpacity="0.5"
//               points="0,110 250,60 500,100 800,50 1100,90 1440,40 1440,0 0,0"
//             />
//           </svg>

//           {/* Header content: Dashboard title and button */}
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between z-10 relative">
//             <h1 className="text-white text-2xl sm:text-3xl font-semibold">
//               Dashboard
//             </h1>
//             <button className="bg-sky-600 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base transition-colors duration-200">
//               Customise this page
//             </button>
//           </div>
//         </div>

//         {/* ===== Slim light breadcrumb bar (unchanged) ===== */}
//         <div className="bg-gray-100 border-t border-gray-200">
//           <div className="mx-auto max-w-7xl">
//             <div className="py-3 text-center">
//               {/* Keep it clickable but styled like plain text */}
//               <Link
//                 to="/dashboard"
//                 className="text-gray-700 text-sm sm:text-base font-medium hover:text-sky-600"
//               >
//                 {pageTitle}
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* ===== Main Content (unchanged) ===== */}
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col md:flex-row gap-6">
//             {isBookDetailsPage && (
//               <aside className="w-full md:w-64 lg:w-72 flex-none">
//                 <Sidebar />
//               </aside>
//             )}
//             <main className="flex-1 min-w-0">
//               <Outlet />
//             </main>
//           </div>
//         </div>
//       </div>

//       {/* Newsletter only on home page */}
//       {isHomePage && <Newsletter />}
//       <Footer />
//     </div>
//   );
// }



// components/Layout/Layout.jsx
import { Outlet, useLocation, Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Newsletter from "../Newsletter/Newsletter";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const location = useLocation();
  const isBookDetailsPage = location.pathname.startsWith("/book/");
  const isHomePage = location.pathname === "/";

  // If you want a dynamic title, swap this with your own logic:
  const pageTitle = "Dashboard";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Spacer for fixed navbar height */}
      <div className="pt-16">
        {/* ===== Blue Header ===== */}
        <div className="relative overflow-hidden bg-[#05b3f3] py-10 h-28 sm:h-32">
          <svg
            className="absolute bottom-0 left-0 w-full h-full"
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
          >
            <polygon
              fill="#42A5F5"
              fillOpacity="0.5"
              points="0,80 300,40 600,70 900,30 1200,60 1440,20 1440,0 0,0"
            />
          </svg>
          <svg
            className="absolute bottom-0 left-0 w-full h-full"
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
          >
            <polygon
              fill="#42A5F5"
              fillOpacity="0.5"
              points="0,110 250,60 500,100 800,50 1100,90 1440,40 1440,0 0,0"
            />
          </svg>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between z-10 relative">
            <h1 className="text-white text-2xl sm:text-3xl font-semibold">
              Dashboard
            </h1>
            {/* <button className="bg-sky-600 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base transition-colors duration-200">
              Customise this page
            </button> */}
          </div>
        </div>

        {/* ===== New Breadcrumb with links ===== */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center py-2 text-sm" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 sm:space-x-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-sky-600 hover:underline transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400">/</span>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-sky-600 hover:underline transition-colors"
                  >
                    Site Page
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400">/</span>
                </li>
                <li>
                  <Link
                    to="/all-genres"
                    className="font-medium text-gray-900 hover:text-sky-600 hover:underline transition-colors"
                  >
                    My Library
                  </Link>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* ===== Main Content (unchanged) ===== */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {isBookDetailsPage && (
              <aside className="w-full md:w-64 lg:w-72 flex-none">
                <Sidebar />
              </aside>
            )}
            <main className="flex-1 min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      {/* Newsletter only on home page */}
      {isHomePage && <Newsletter />}
      <Footer />
    </div>
  );
}