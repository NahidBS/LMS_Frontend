// ManageCategory.jsx

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Upload,
  Users,
  BookOpen,
  HelpCircle,
  LogOut,
  Layers,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

const categories = [
  { id: 1, name: "Web Design", slug: "web-design", status: "Enable" },
  { id: 2, name: "Web Development", slug: "web-development", status: "Enable" },
  { id: 3, name: "Programming", slug: "programming", status: "Enable" },
  { id: 4, name: "Commerce", slug: "commerce", status: "Disable" },
];

function StatusPill({ status }) {
  const on = status?.toLowerCase() === "enable";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        on ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function ManageCategory() {
  useEffect(() => {
    document.title = "Manage Category";
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar — identical styling */}
      <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Library</h2>
          <ul className="space-y-3">
            <li>
              <Link
                to="/admin"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
              >
                <CalendarDays size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-books"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500 transition-colors"
              >
                <BookOpen size={18} /> Manage Books
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-category"
                className="flex items-center gap-2 text-sky-600 font-medium"
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
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Manage Category
          </h1>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        <div className="bg-white rounded shadow">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-4 min-w-[80px]">#</th>
                  <th className="py-3 px-4 min-w-[220px]">Category</th>
                  <th className="py-3 px-4 min-w-[220px]">Slug</th>
                  <th className="py-3 px-4 min-w-[140px]">Status</th>
                  <th className="py-3 px-4 min-w-[160px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c, idx) => (
                  <tr key={c.id} className="border-b last:border-0 even:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{idx + 1}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{c.name}</td>
                    <td className="py-3 px-4 text-gray-700">{c.slug}</td>
                    <td className="py-3 px-4">
                      <StatusPill status={c.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 text-xs text-gray-500 md:hidden">
            Tip: swipe horizontally to see all columns.
          </div>
        </div>
      </main>
    </div>
  );
}