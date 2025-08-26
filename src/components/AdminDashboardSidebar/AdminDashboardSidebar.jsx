import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  BookOpen,
  Layers,
  HandHeart,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminDashboardSidebar() {
  const location = useLocation();

  const navItem =
    "flex items-center gap-2 px-3 py-3 text-gray-700 hover:text-sky-500 transition-colors";
  const navItemActive =
    "flex items-center gap-2 px-3 py-3 text-sky-600 font-medium";

  return (
    <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Library</h2>
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin/dashboard"
              className={
                location.pathname === "/admin/dashboard" ? navItemActive : navItem
              }
            >
              <CalendarDays size={18} /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/manage-books"
              className={
                location.pathname === "/manage-books" ? navItemActive : navItem
              }
            >
              <BookOpen size={18} /> Manage Books
            </Link>
          </li>
          <li>
            <Link
              to="/manage-category"
              className={
                location.pathname === "/manage-category" ? navItemActive : navItem
              }
            >
              <Layers size={18} /> Manage Category
            </Link>
          </li>
          <li>
            <Link
              to="/manage-donation-request"
              className={
                location.pathname === "/manage-donation-request"
                  ? navItemActive
                  : navItem
              }
            >
              <HandHeart size={18} /> Manage Donation Requests
            </Link>
          </li>
          <li>
            <Link
              to="/manage-feature"
              className={
                location.pathname === "/manage-feature" ? navItemActive : navItem
              }
            >
              <Layers size={18} /> Manage Feature
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className={
                location.pathname === "/admin/settings" ? navItemActive : navItem
              }
            >
              <Settings size={18} /> Settings
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Link
          to="/logout"
          className="flex items-center gap-2 px-3 py-3 text-red-600 font-medium hover:underline underline-offset-4"
        >
          <LogOut size={18} /> Logout
        </Link>
      </div>
    </aside>
  );
}
