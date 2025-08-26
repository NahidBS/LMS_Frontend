// src/pages/ManageFeature/ManageFeature.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar/AdminDashboardSidebar";

/* ---------- Switch Component ---------- */
function Switch({ checked, onChange, disabled }) {
  return (
    <label className="inline-flex items-center select-none">
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={!!checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
        />
        <span
          className={`
            h-5 w-9 rounded-full transition-colors
            ${checked ? "bg-sky-600" : "bg-gray-300"}
            ${disabled ? "opacity-60" : ""}
            relative after:content-[''] after:absolute after:top-0.5 after:left-0.5
            after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform
            ${checked ? "peer-checked:after:translate-x-4 after:translate-x-4" : ""}
          `}
        />
      </span>
    </label>
  );
}

/* ---------- ManageFeature Page ---------- */
export default function ManageFeature() {
  useEffect(() => {
    document.title = "• Featured Books";
  }, []);

  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [view, setView] = useState("checked"); // 'checked', 'unchecked'
  const [pendingById, setPendingById] = useState({});
  const [confirm, setConfirm] = useState({ open: false, book: null });
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [error, setError] = useState("");

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 1600);
  };

  /* -------- Fetch All Books -------- */
  const fetchAllBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/book/list?non_featured=true`);
      const books = response.data?.content ?? [];
      setCatalog(
        books.map((b) => ({
          id: String(b.id),
          title: b.name || "No title",
          author: b.author || "Unknown",
          category:
            typeof b.category === "object"
              ? b.category.name
              : b.category || "Uncategorized",
          coverImage: b.book_cover_url,
          short_description: b.short_details,
        }))
      );
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Could not load books. Try Refresh.");
      setCatalog([]);
    } finally {
      setLoading(false);
    }
  };

  /* -------- Fetch Featured Books -------- */
  const fetchFeatured = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/book/list?categoryId=7`); // 7 = Featured
      const featuredBooks = response.data?.content ?? [];
      setFeatured(
        featuredBooks.map((b) => ({
          bookId: String(b.id),
          title: b.name,
          author: b.author,
          category: "Featured",
          coverImage: b.book_cover_url,
          summary: b.short_details,
        }))
      );
    } catch (error) {
      console.error("Error fetching featured books:", error);
      setError("Could not load featured books. Try Refresh.");
      setFeatured([]);
    } finally {
      setLoading(false);
    }
  };

  /* -------- Load Initial Data -------- */
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchAllBooks(), fetchFeatured()]);
    } catch {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* -------- Fast Lookup Map -------- */
  const featuredMapByBookId = useMemo(() => {
    const m = new Map();
    featured.forEach((f) => m.set(f.bookId, f));
    return m;
  }, [featured]);

  /* -------- Filtered Catalog -------- */
  const filteredCatalog = useMemo(() => {
    if (view === "checked") return featured;
    if (view === "unchecked") return catalog;
    return [];
  }, [catalog, view, featured]);

  /* -------- Actions -------- */
  const setPending = (bookId, v) =>
    setPendingById((prev) => ({ ...prev, [bookId]: v }));

  const handleCheck = async (book) => {
    const bookId = book.bookId || book.id;
    if (!bookId || featuredMapByBookId.has(bookId)) return;

    setPending(bookId, true);
    setError("");
    try {
      await api.patch(`/book/${bookId}/category?categoryId=7`); // 7 = Featured
      await loadData();
      showToast("Book marked as Featured.");
    } catch {
      setError("Add failed. Please try again.");
    } finally {
      setPending(bookId, false);
    }
  };

  const askUncheck = (book) => setConfirm({ open: true, book });
  const closeConfirm = () => setConfirm({ open: false, book: null });

  const doUncheck = async () => {
    const book = confirm.book;
    if (!book) return;

    const bookId = book.bookId || book.id;
    setPending(bookId, true);
    setError("");
    try {
      await api.patch(`/book/${bookId}/category?categoryId=1`); // 1 = Default/Uncategorized
      await loadData();
      showToast("Removed from Featured.");
      closeConfirm();
    } catch {
      setError("Remove failed. Please try again.");
    } finally {
      setPending(bookId, false);
    }
  };

  /* -------- UI -------- */
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminDashboardSidebar />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-gray-400 font-normal">• Featured Books</span>
          </h1>
        </header>

        {/* Toolbar */}
        <section className="bg-white rounded-lg shadow border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setView("checked")}
                className={`px-3 py-1.5 text-sm ${
                  view === "checked"
                    ? "bg-gray-100 text-gray-800 font-medium"
                    : "text-gray-700"
                }`}
              >
                Checked
              </button>
              <button
                type="button"
                onClick={() => setView("unchecked")}
                className={`px-3 py-1.5 text-sm ${
                  view === "unchecked"
                    ? "bg-gray-100 text-gray-800 font-medium"
                    : "text-gray-700"
                }`}
              >
                Unchecked
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* Cards */}
        <section className="bg-white rounded-lg shadow border border-gray-200 p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white shadow rounded-lg overflow-hidden animate-pulse min-h-[320px]"
                >
                  <div className="h-40 w-full bg-gray-100" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-100 rounded w-3/5 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/5 mb-2" />
                    <div className="h-8 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}

            {!loading &&
              filteredCatalog.map((b) => {
                const bookId = b.bookId || b.id;
                const checked = featuredMapByBookId.has(bookId);
                const pending = !!pendingById[bookId];

                return (
                  <div
                    key={bookId}
                    className="flex flex-col justify-between rounded-lg shadow overflow-hidden bg-white transition min-h-[320px]"
                  >
                    {/* Cover */}
                    <div className="h-40 w-full overflow-hidden flex items-center justify-center bg-gray-50">
                      {b.coverImage ? (
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-gray-400" size={24} />
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                          {b.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">{b.category}</p>
                        <p className="mt-1 text-xs text-gray-600">{b.author}</p>
                      </div>

                      {/* Bottom actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-3">
                        <Switch
                          checked={checked}
                          disabled={pending}
                          onChange={(on) => {
                            if (on) handleCheck(b);
                            else askUncheck(b);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (checked) askUncheck(b);
                            else handleCheck(b);
                          }}
                          className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold shadow ${
                            checked
                              ? "bg-red-600 text-white hover:bg-red-500 focus:ring-2 focus:ring-red-400"
                              : "bg-sky-600 text-white hover:bg-sky-500 focus:ring-2 focus:ring-sky-400"
                          }`}
                          disabled={pending}
                        >
                          {pending ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : checked ? (
                            <>Uncheck</>
                          ) : (
                            <>
                              <Check size={16} />
                              Check
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </main>

      {/* Confirm Modal */}
      {confirm.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => e.target === e.currentTarget && closeConfirm()}
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 flex items-start gap-3">
              <AlertTriangle className="text-amber-500" size={24} />
              <div>
                <h3 className="text-lg font-semibold">Remove from Featured?</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{confirm.book?.title}</span> will be removed from Featured.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeConfirm} className="px-4 py-2 rounded bg-gray-200">
                Cancel
              </button>
              <button
                onClick={doUncheck}
                className="px-5 py-2 rounded bg-red-600 text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white shadow-lg rounded-xl px-4 py-3 flex items-start gap-3">
            <CheckCircle2 className="text-green-600" size={22} />
            <div>
              <p className="text-sm font-semibold">Success</p>
              <p className="text-xs text-gray-600">{toast.msg}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
