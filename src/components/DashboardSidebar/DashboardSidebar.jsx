// src/components/Sidebar/Sidebar.jsx
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Users,
  BookOpen,
  HelpCircle,
  LogOut,
  Layers,
} from "lucide-react";

const navItemClass = "flex items-center gap-2 px-3 py-3 text-gray-700 hover:text-sky-500 transition-colors whitespace-nowrap";
const navItemActiveClass = "flex items-center gap-2 px-3 py-3 text-sky-600 font-medium whitespace-nowrap";
export default function Sidebar({ activePage }) {
  return (
    <aside className="hidden md:block w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between flex-shrink-0">
      <div>
        <h2 className="text-xl font-bold mb-6 whitespace-nowrap">Library</h2>
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={activePage === "dashboard" ? navItemActiveClass : navItemClass}
            >
              <CalendarDays size={18} /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/manage-books"
              className={activePage === "manage-books" ? navItemActiveClass : navItemClass}
            >
              <BookOpen size={18} /> Manage Books
            </Link>
          </li>
          <li>
            <Link
              to="/manage-category"
              className={activePage === "manage-category" ? navItemActiveClass : navItemClass}
            >
              <Layers size={18} /> Manage Category
            </Link>
          </li>
          <li>
            <Link
              to="/members"
              className={activePage === "members" ? navItemActiveClass : navItemClass}
            >
              <Users size={18} /> Members
            </Link>
          </li>
          <li>
            <Link
              to="/borrowed"
              className={activePage === "borrowed" ? navItemActiveClass : navItemClass}
            >
              <BookOpen size={18} /> Check-out Books
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              className={activePage === "help" ? navItemActiveClass : navItemClass}
            >
              <HelpCircle size={18} /> Help
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Link
          to="/logout"
          className="flex items-center gap-2 px-3 py-3 text-red-600 font-medium hover:underline underline-offset-4 whitespace-nowrap"
        >
          <LogOut size={18} /> Logout
        </Link>
      </div>
    </aside>
  );
}