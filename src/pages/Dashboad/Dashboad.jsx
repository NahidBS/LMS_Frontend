// Dashboard.jsx (unchanged except for two new <li>s under Sidebar list)

import { useEffect } from "react";
import {
  CalendarDays,
  Upload,
  Users,
  BookOpen,
  HelpCircle,
  LogOut,
  Library,         // optional icon for Manage Books (we'll keep BookOpen for consistency if you prefer)
  Layers           // optional icon for Manage Category
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Library Dashboard";
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Library</h2>
          <ul className="space-y-3">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sky-600 font-medium"
              >
                <CalendarDays size={18} /> Dashboard
              </Link>
            </li>

            {/* NEW — Manage Books */}
            <li>
              <Link
                to="/admin/manage-books"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
              >
                <BookOpen size={18} /> Manage Books
              </Link>
            </li>

            {/* NEW — Manage Category */}
            <li>
              <Link
                to="/admin/manage-category"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
              >
                <Layers size={18} /> Manage Category
              </Link>
            </li>

            {/* <li>
              <Link
                to="/upload"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
              >
                <Upload size={18} /> Upload Books
              </Link>
            </li> */}
            <li>
              <Link
                to="/fill-up-form"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
              >
                <BookOpen size={18} /> Fill Up Form
              </Link>
            </li>
            <li>
              <Link
                to="/members"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
              >
                <Users size={18} /> Member
              </Link>
            </li>
            <li>
              <Link
                to="/borrowed"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
              >
                <BookOpen size={18} /> Check-out Books
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
              >
                <HelpCircle size={18} /> Help
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <Link
            to="/logout"
            className="flex items-center gap-2 text-red-600 font-medium hover:underline underline-offset-4"
          >
            <LogOut size={18} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Borrowed Books", value: 3504 },
            { label: "Returned Books", value: 683 },
            { label: "Overdue Books", value: 145 },
            { label: "Missing Books", value: 32 },
            { label: "Total Books", value: 5654 },
            { label: "Visitors", value: 1554 },
            { label: "New Members", value: 120 },
            { label: "Pending", value: 222 },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded shadow p-4 text-center">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-bold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Graph + Overdue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Check-Out Statistics</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Graph Placeholder
            </div>
          </div>

          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Overdue’s History</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th>Employee ID</th>
                  <th>Title</th>
                  <th>ISBN</th>
                  <th>Due</th>
                  <th>Fine</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td>BS1862</td>
                  <td className="font-semibold">Core Java</td>
                  <td>3223</td>
                  <td>6 days</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Checkouts */}
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Recent Check-Out’s</h3>
            <Link to="#" className="text-xs text-green-600 hover:underline">
              View All
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>ID</th>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author</th>
                <th>Employee</th>
                <th>Issue Date</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td>BS1862</td>
                <td>3223</td>
                <td>Core Java</td>
                <td>Gary S. Horstmann</td>
                <td>Sadia Prova</td>
                <td>29/07/2025</td>
                <td>03/08/2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}




































// // Dashboard.jsx (updated to match FillUpForm sidebar styling)

// import { useEffect } from "react";
// import {
//   CalendarDays,
//   Upload,
//   Users,
//   BookOpen,
//   HelpCircle,
//   LogOut,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function Dashboard() {
//   useEffect(() => {
//     document.title = "Library Dashboard";
//   }, []);

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
//         <div>
//           <h2 className="text-xl font-bold mb-6">Library</h2>
//           <ul className="space-y-3">
//             <li>
//               <Link
//                 to="/dashboard"
//                 className="flex items-center gap-2 text-sky-600 font-medium"
//               >
//                 <CalendarDays size={18} /> Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/upload"
//                 className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
//               >
//                 <Upload size={18} /> Upload Books
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/fill-up-form"
//                 className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
//               >
//                 <BookOpen size={18} /> Fill Up Form
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/members"
//                 className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
//               >
//                 <Users size={18} /> Member
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/borrowed"
//                 className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
//               >
//                 <BookOpen size={18} /> Check-out Books
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/help"
//                 className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
//               >
//                 <HelpCircle size={18} /> Help
//               </Link>
//             </li>
//           </ul>
//         </div>
//         <div>
//           <Link
//             to="/logout"
//             className="flex items-center gap-2 text-red-600 font-medium hover:underline underline-offset-4"
//           >
//             <LogOut size={18} /> Logout
//           </Link>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 p-6 space-y-6">
//         {/* Top Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             { label: "Borrowed Books", value: 3504 },
//             { label: "Returned Books", value: 683 },
//             { label: "Overdue Books", value: 145 },
//             { label: "Missing Books", value: 32 },
//             { label: "Total Books", value: 5654 },
//             { label: "Visitors", value: 1554 },
//             { label: "New Members", value: 120 },
//             { label: "Pending", value: 222 },
//           ].map((item, i) => (
//             <div key={i} className="bg-white rounded shadow p-4 text-center">
//               <p className="text-sm text-gray-500">{item.label}</p>
//               <p className="text-xl font-bold text-gray-800">{item.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Graph + Overdue */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white rounded shadow p-4">
//             <h3 className="font-semibold mb-2">Check-Out Statistics</h3>
//             <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
//               Graph Placeholder
//             </div>
//           </div>

//           <div className="bg-white rounded shadow p-4">
//             <h3 className="font-semibold mb-2">Overdue’s History</h3>
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left border-b">
//                   <th>Employee ID</th>
//                   <th>Title</th>
//                   <th>ISBN</th>
//                   <th>Due</th>
//                   <th>Fine</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-b">
//                   <td>BS1862</td>
//                   <td className="font-semibold">Core Java</td>
//                   <td>3223</td>
//                   <td>6 days</td>
//                   <td>-</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recent Checkouts */}
//         <div className="bg-white rounded shadow p-4">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="font-semibold">Recent Check-Out’s</h3>
//             <Link to="#" className="text-xs text-green-600 hover:underline">
//               View All
//             </Link>
//           </div>
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left border-b">
//                 <th>ID</th>
//                 <th>ISBN</th>
//                 <th>Title</th>
//                 <th>Author</th>
//                 <th>Employee</th>
//                 <th>Issue Date</th>
//                 <th>Return Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-b">
//                 <td>BS1862</td>
//                 <td>3223</td>
//                 <td>Core Java</td>
//                 <td>Gary S. Horstmann</td>
//                 <td>Sadia Prova</td>
//                 <td>29/07/2025</td>
//                 <td>03/08/2025</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// }