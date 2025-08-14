// import { useNavigate } from "react-router-dom";

// export default function DevLogin() {
//   const navigate = useNavigate();

//   const loginAs = (role) => {
//     localStorage.setItem("token", "dev-token");
//     localStorage.setItem("user", JSON.stringify({ id: 1, name: "Dev User", role }));
//     navigate("/dashboard", { replace: true });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/", { replace: true });
//   };

//   return (
//     <div className="min-h-screen grid place-items-center bg-gray-100">
//       <div className="bg-white rounded shadow p-6 space-y-4">
//         <h1 className="text-xl font-bold">Dev Login</h1>
//         <div className="flex gap-3">
//           <button
//             onClick={() => loginAs("admin")}
//             className="rounded bg-sky-600 text-white px-4 py-2 font-semibold hover:bg-sky-500"
//           >
//             Login as Admin
//           </button>
//           <button
//             onClick={() => loginAs("user")}
//             className="rounded bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-500"
//           >
//             Login as User
//           </button>
//         </div>
//         <button
//           onClick={logout}
//           className="rounded bg-gray-200 text-gray-800 px-4 py-2 font-semibold hover:bg-gray-300"
//         >
//           Clear & Logout
//         </button>
//       </div>
//     </div>
//   );
// }