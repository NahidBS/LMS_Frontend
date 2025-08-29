
//Navbar.jsx
import {
  Bell,
  MessageSquare,
  Search,
  Upload,
  UserCircle,
  X,
  GraduationCap,
  Home,
  BookOpen,
  Calendar,
} from "lucide-react";
import { CgMenuGridR } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  // UI state
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [openNoti, setOpenNoti] = useState(false);
  const [openMsg, setOpenMsg] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  // NEW: grid/app-launcher menu
  const [openGrid, setOpenGrid] = useState(false);

  const searchRef = useRef(null);
  const gridRef = useRef(null); // anchor for the grid icon/menu

  // Auth state (simple)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser")) || null;
    } catch {
      return null;
    }
  });

  // Load books for search
  useEffect(() => {
    let alive = true;
    fetch("/books.json")
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setBooks(Array.isArray(data) ? data : []);
      })
      .catch(() => setBooks([]));
    return () => {
      alive = false;
    };
  }, []);

  // Close popups on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!searchRef.current) return;

      // Close popovers if click is outside both search area and the grid launcher
      const clickedInsideSearch = searchRef.current.contains(e.target);
      const clickedInsideGrid =
        gridRef.current && gridRef.current.contains(e.target);

      if (!clickedInsideSearch && !clickedInsideGrid) {
        setOpenNoti(false);
        setOpenMsg(false);
        setOpenUser(false);
        setOpenGrid(false); // close grid as well
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Demo notification/message data (customize freely later)
  const notifications = [
    { id: "n1", title: "New review on “Clean Code”", time: "2m ago" },
    { id: "n2", title: "Your upload was approved", time: "1h ago" },
    { id: "n3", title: "Weekly digest is ready", time: "Yesterday" },
  ];
  const messages = [
    { id: "m1", from: "Admin", text: "Your membership has been upgraded.", time: "5m" },
    { id: "m2", from: "Support", text: "Let us know if the PDF link works.", time: "1h" },
    { id: "m3", from: "Librarian", text: "Return reminder for 2 books due tomorrow.", time: "Yesterday" },
  ];

  // Live search results (by title, authors, category, summary)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hit = (v) => typeof v === "string" && v.toLowerCase().includes(q);
    return books
      .filter(
        (b) =>
          hit(b.title) ||
          hit(b.authors || b.author || "") ||
          hit(b.category || "") ||
          hit(b.summary || b.description || "")
      )
      .slice(0, 8);
  }, [books, query]);

  const goToBook = (id) => {
    setQuery("");
    setShowSearch(false);
    navigate(`/book/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (results[0]) goToBook(results[0].id);
  };

  const toggleSignIn = () => {
    if (user) {
      // sign out
      localStorage.removeItem("authUser");
      setUser(null);
      setOpenUser(false);
      navigate("/");
    } else {
      // (Demo) mark as signed in; navigate to dashboard
      const demoUser = { name: "Member" };
      localStorage.setItem("authUser", JSON.stringify(demoUser));
      setUser(demoUser);
      setOpenUser(false);
      navigate("/dashboard");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Container */}
      <div className="flex items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 h-16">
        {/* Left: Logo + Grid */}
        <div className="flex items-center h-full">
          <Link to="/" className="flex items-center h-full">
            <img
              src="/BSlogo-removebg-preview.png"
              alt="Logo"
              className="h-[80] w-auto max-h-[120px] object-contain cursor-pointer px-15"
            />
          </Link>

          {/* Grid / App Launcher */}
          <div className="relative ml-2" ref={gridRef}>
            <button
              type="button"
              aria-label="Open app menu"
              onClick={() => {
                setOpenGrid((v) => !v);
                // close others to avoid overlap
                setOpenNoti(false);
                setOpenMsg(false);
                setOpenUser(false);
              }}
              className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <CgMenuGridR className="w-6 h-6 text-gray-600" />
            </button>

            {openGrid && (
              <div className="absolute left-0 top-10 w-64 bg-white border border-gray-200 rounded-xl shadow-lg">
                {/* Subtle elevation and rounded look to match the screenshot */}
                <ul className="py-2">
                  <li>
                    <Link
                      to="https://lms.elearning23.com/my/courses.php"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800"
                      onClick={() => setOpenGrid(false)}
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                        <GraduationCap className="w-4 h-4 text-gray-700" />
                      </span>
                      <span className="text-sm font-medium">My courses</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800"
                      onClick={() => setOpenGrid(false)}
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                        <Home className="w-4 h-4 text-gray-700" />
                      </span>
                      <span className="text-sm font-medium">Site home</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="https://lms.elearning23.com/course/"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800"
                      onClick={() => setOpenGrid(false)}
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                        <BookOpen className="w-4 h-4 text-gray-700" />
                      </span>
                      <span className="text-sm font-medium">All courses</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/calendar"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800"
                      onClick={() => setOpenGrid(false)}
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                        <Calendar className="w-4 h-4 text-gray-700" />
                      </span>
                      <span className="text-sm font-medium">Calendar</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right: Upload button + icons */}
        <div className="flex items-center gap-3 sm:gap-4 h-full" ref={searchRef}>
          {/* Upload (unchanged) */}
          <Link
            to="/upload"
            className="flex items-center gap-1 px-3 py-1 sm:px-4 sm:py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-sm sm:text-base"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-3 sm:gap-4 relative">
            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setOpenNoti((v) => !v);
                setOpenMsg(false);
                setOpenUser(false);
                setOpenGrid(false);
              }}
              className="relative"
            >
              <Bell className="w-5 h-5 text-gray-700 cursor-pointer" />
              {/* unread dot */}
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {/* Messages */}
            <button
              type="button"
              aria-label="Messages"
              onClick={() => {
                setOpenMsg((v) => !v);
                setOpenNoti(false);
                setOpenUser(false);
                setOpenGrid(false);
              }}
            >
              <MessageSquare className="w-5 h-5 text-gray-700 cursor-pointer" />
            </button>

            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                setShowSearch((v) => !v);
                setOpenGrid(false);
              }}
            >
              <Search className="w-5 h-5 text-gray-700 cursor-pointer" />
            </button>

            {/* User */}
            <button
              type="button"
              aria-label="User menu"
              onClick={() => {
                setOpenUser((v) => !v);
                setOpenNoti(false);
                setOpenMsg(false);
                setOpenGrid(false);
              }}
            >
              <UserCircle className="w-6 h-6 text-gray-700 cursor-pointer" />
            </button>

            {/* Notifications panel */}
            {openNoti && (
              <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b font-semibold text-gray-800">
                  Notifications
                </div>
                <ul className="max-h-80 overflow-auto">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="px-4 py-3 hover:bg-gray-50 text-sm text-gray-700"
                    >
                      <div className="font-medium">{n.title}</div>
                      <div className="text-xs text-gray-500">{n.time}</div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2 text-xs text-sky-600 font-medium hover:underline cursor-pointer">
                  View all
                </div>
              </div>
            )}

            {/* Messages panel */}
            {openMsg && (
              <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b font-semibold text-gray-800">
                  Messages
                </div>
                <ul className="max-h-80 overflow-auto">
                  {messages.map((m) => (
                    <li
                      key={m.id}
                      className="px-4 py-3 hover:bg-gray-50 text-sm text-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{m.from}</div>
                        <div className="text-xs text-gray-500">{m.time}</div>
                      </div>
                      <div className="text-gray-600 text-sm">{m.text}</div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2 text-xs text-sky-600 font-medium hover:underline cursor-pointer">
                  View inbox
                </div>
              </div>
            )}

            {/* User menu */}
            {openUser && (
              <div className="absolute right-0 top-10 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <div className="text-sm text-gray-600">
                    {user ? "Signed in as" : "Welcome"}
                  </div>
                  <div className="font-semibold text-gray-800">
                    {user?.name || "Guest"}
                  </div>
                </div>
                <ul className="py-1 text-sm">
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/dashboard");
                      }}
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/upload");
                      }}
                    >
                      Upload a Book
                    </button>
                  </li>
                </ul>
                <div className="border-t">
                  <button
                    className="w-full px-4 py-2 text-left text-sky-600 font-semibold hover:bg-gray-50"
                    onClick={toggleSignIn}
                  >
                    {user ? "Sign Out" : "Sign In"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animated search bar overlay (responsive) */}
      <div
        className={`transition-[max-height] duration-300 ease-out overflow-hidden border-t border-gray-100 ${
          showSearch ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 h-11"
          >
            <Search className="w-5 h-5 text-gray-500" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, category…"
              className="flex-1 bg-transparent outline-none text-sm px-3"
            />
            {query && (
              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-200"
                onClick={() => setQuery("")}
                aria-label="Clear"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <button
              type="submit"
              className="ml-2 px-4 h-8 rounded-full text-white bg-sky-500 hover:bg-sky-600 text-sm font-medium"
            >
              Search
            </button>

            {/* Results dropdown */}
            {showSearch && (results.length > 0 || query) && (
              <div className="absolute left-0 right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {results.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-gray-500">
                    No matches for “{query}”
                  </div>
                ) : (
                  <ul className="max-h-80 overflow-auto divide-y">
                    {results.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => goToBook(b.id)}
                      >
                        <img
                          src={b.coverImage || b.image}
                          alt={b.title}
                          className="w-10 h-14 object-cover rounded"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {b.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {(b.authors || b.author) ?? "Unknown"} • {b.category ?? "General"}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </header>
  );
}