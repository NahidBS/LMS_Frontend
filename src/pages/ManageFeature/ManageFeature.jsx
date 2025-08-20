// src/pages/ManageFeature/ManageFeature.jsx
import { useEffect, useMemo, useState } from "react";
import {
  SlidersHorizontal,
  RefreshCcw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  BookOpen,
  Search,
  Filter,
  Check,
} from "lucide-react";
import Sidebar from "../../components/DashboardSidebar/DashboardSidebar";
import sectionedBooks from "../../data/sampleBooks";

/* ---------- Small UI bits ---------- */

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

/* ---------- Helpers to normalize data ---------- */

const normalizeFeatured = (item) => {
  const book = item.book || item;
  const cover =
    book.coverImage || book.image || "https://dummyimage.com/160x160/e5e7eb/9ca3af&text=📘";
  return {
    featuredId: String(item.id ?? book.id ?? Math.random().toString(36).slice(2)),
    bookId: String(item.book_id ?? item.bookId ?? book.book_id ?? item.id ?? ""),
    title: book.title || "—",
    author: book.author || book.authors || "—",
    category: book.category || "—",
  };
};

const normalizeCatalog = (b, fallbackIndex) => {
  const cover =
    b.coverImage || b.image || "https://dummyimage.com/160x160/e5e7eb/9ca3af&text=📘";
  return {
    id: String(b.id ?? b.book_id ?? fallbackIndex ?? Math.random().toString(36).slice(2)),
    title: b.title || "—",
    author: b.author || b.authors || "—",
    category: b.category || "—",
    cover,
  };
};

/* ---------- Page ---------- */

export default function ManageFeature() {
  useEffect(() => {
    document.title = "• Featured Books";
  }, []);

  // server state
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState([]); // array of normalizeFeatured
  const [error, setError] = useState("");

  // catalog (cards)
  const [catalog, setCatalog] = useState([]); // array of normalizeCatalog
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all"); // all | checked | unchecked

  // per-card pending toggles
  const [pendingById, setPendingById] = useState({});

  // remove confirm
  const [confirm, setConfirm] = useState({ open: false, book: null });

  // toast
  const [toast, setToast] = useState({ show: false, msg: "" });
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 1600);
  };

  /* -------- load featured list from backend -------- */
  const fetchFeatured = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/featured-books/list", { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.data || [];
      setFeatured(arr.map(normalizeFeatured));
    } catch (e) {
      setError("Could not load featured books. Try Refresh.");
      setFeatured([]);
    } finally {
      setLoading(false);
    }
  };

  /* -------- build catalog from books.json + sectionedBooks fallback -------- */
  useEffect(() => {
    (async () => {
      try {
        const url = `${import.meta.env.BASE_URL}books.json`;
        const res = await fetch(url);
        const data = res.ok ? await res.json() : [];
        const list = Array.isArray(data) ? data : [];
        const normalized = list.map((b, i) => normalizeCatalog(b, i));
        if (normalized.length) {
          setCatalog(normalized);
          return;
        }
      } catch {
        /* fall back to sectionedBooks */
      }

      // fallback to sectionedBooks
      const pool = [];
      if (sectionedBooks && typeof sectionedBooks === "object") {
        let i = 0;
        Object.values(sectionedBooks).forEach((arr) => {
          if (Array.isArray(arr)) {
            arr.forEach((b) => pool.push(normalizeCatalog(b, i++)));
          }
        });
      }
      setCatalog(pool);
    })();

    fetchFeatured();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- fast lookups -------- */
  const featuredMapByBookId = useMemo(() => {
    const m = new Map();
    featured.forEach((f) => m.set(f.bookId, f));
    return m;
  }, [featured]);

  /* -------- filtered catalog for search/view -------- */
  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = catalog.filter((c) => {
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });

    if (view === "checked") {
      return base.filter((c) => featuredMapByBookId.has(c.id));
    }
    if (view === "unchecked") {
      return base.filter((c) => !featuredMapByBookId.has(c.id));
    }
    return base;
  }, [catalog, search, view, featuredMapByBookId]);

  const checkedCount = featured.length;

  /* -------- actions: check/uncheck (POST/DELETE) -------- */
  const setPending = (bookId, v) =>
    setPendingById((prev) => ({ ...prev, [bookId]: v }));

  const handleCheck = async (book) => {
    // if already checked → just no-op
    if (featuredMapByBookId.has(book.id)) return;
    setPending(book.id, true);
    setError("");
    try {
      const res = await fetch(`/api/featured-books/${encodeURIComponent(book.id)}/add`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // best: API returns created row; try to read id; otherwise refresh
      try {
        const data = await res.json().catch(() => null);
        if (data && (data.id || data?.data?.id)) {
          const created = normalizeFeatured(data.id ? data : data.data);
          setFeatured((prev) => [{ ...created, title: book.title, author: book.author, category: book.category }, ...prev]);
        } else {
          await fetchFeatured();
        }
      } catch {
        await fetchFeatured();
      }
      showToast("Book marked as Featured.");
    } catch (e) {
      setError("Add failed. Please try again.");
    } finally {
      setPending(book.id, false);
    }
  };

  const askUncheck = (book) => setConfirm({ open: true, book });
  const closeConfirm = () => setConfirm({ open: false, book: null });

  const doUncheck = async () => {
    const book = confirm.book;
    if (!book) return;
    const f = featuredMapByBookId.get(book.id);
    if (!f) {
      closeConfirm();
      return;
    }
    setPending(book.id, true);
    setError("");
    try {
      const res = await fetch(`/api/featured-books/remove/${encodeURIComponent(f.featuredId)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFeatured((prev) => prev.filter((x) => x.featuredId !== f.featuredId));
      showToast("Removed from Featured.");
      closeConfirm();
    } catch (e) {
      setError("Remove failed. Please try again.");
    } finally {
      setPending(book.id, false);
    }
  };

  /* -------- UI -------- */
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            {/* <SlidersHorizontal className="text-gray-700" size={20} />
            Manage Feature */}
            <span className="text-gray-400 font-normal">• Featured Books</span>
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchFeatured}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-gray-200 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCcw size={16} />}
              Refresh
            </button>
          </div>
        </header>

        {/* Toolbar: search + filters + counts */}
        <section className="bg-white rounded-lg shadow border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, author, category, or ID…"
                  className="w-full rounded border border-gray-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setView("all")}
                  className={`px-3 py-1.5 text-sm ${view === "all" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-700"}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setView("checked")}
                  className={`px-3 py-1.5 text-sm ${view === "checked" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-700"}`}
                >
                  Checked
                </button>
                <button
                  type="button"
                  onClick={() => setView("unchecked")}
                  className={`px-3 py-1.5 text-sm ${view === "unchecked" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-700"}`}
                >
                  Unchecked
                </button>
              </div>

              <span className="hidden md:inline-flex items-center gap-1 text-sm text-gray-600">
                <Filter size={16} />
                <span>Featured:</span>
                <span className="font-semibold">{checkedCount}</span>
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* Cards grid */}
        <section className="bg-white rounded-lg shadow border border-gray-200 p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Loading skeletons while GET featured in progress (optional) */}
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={`sk-${i}`} className="rounded-lg border border-gray-200 p-4 animate-pulse">
                  <div className="h-28 w-full rounded bg-gray-100 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-3/5 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/5 mb-4" />
                  <div className="h-9 bg-gray-100 rounded" />
                </div>
              ))}

            {!loading && filteredCatalog.length === 0 && (
              <div className="col-span-full text-sm text-gray-500">
                No books match your search.
              </div>
            )}

            {!loading &&
              filteredCatalog.map((b) => {
                const checked = featuredMapByBookId.has(b.id);
                const pending = !!pendingById[b.id];

                return (
                  <article
                    key={b.id}
                    className={`rounded-lg border p-4 cursor-pointer transition
                                ${checked ? "border-sky-300 ring-1 ring-sky-100 bg-sky-50/30" : "border-gray-200 bg-white"}
                               `}
                    onClick={() => (checked ? askUncheck(b) : handleCheck(b))}
                  >
                    <div className="h-28 w-full rounded bg-gray-50 overflow-hidden ring-1 ring-gray-200 flex items-center justify-center">
                      {b.cover ? (
                        <img src={b.cover} alt={b.title} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-400" size={24} />
                      )}
                    </div>

                    <div className="min-h-[56px] mt-3">
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <BookOpen size={15} className="text-gray-400" />
                        <span className="line-clamp-2">{b.title}</span>
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">{b.author}</p>
                      <p className="text-xs text-gray-500">{b.category}</p>
                    </div>

                    {/* Top-right small switch */}
                    <div className="flex items-center justify-between mt-3">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full ring-1
                          ${checked ? "bg-green-50 text-green-700 ring-green-200" : "bg-gray-50 text-gray-600 ring-gray-200"}
                        `}
                      >
                        {checked ? "Checked" : "Unchecked"}
                      </span>

                      <Switch
                        checked={checked}
                        disabled={pending}
                        onChange={(on) => {
                          if (on) handleCheck(b);
                          else askUncheck(b);
                        }}
                      />
                    </div>

                    {/* Primary action button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (checked) askUncheck(b);
                        else handleCheck(b);
                      }}
                      className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold shadow
                        ${
                          checked
                            ? "bg-red-600 text-white hover:bg-red-500 focus:ring-2 focus:ring-red-400"
                            : "bg-sky-600 text-white hover:bg-sky-500 focus:ring-2 focus:ring-sky-400"
                        }
                      `}
                      disabled={pending}
                    >
                      {pending ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : checked ? (
                        <>
                          Uncheck
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Check
                        </>
                      )}
                    </button>
                  </article>
                );
              })}
          </div>
        </section>
      </main>

      {/* ===== Uncheck Confirmation Modal ===== */}
      {confirm.open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeConfirm();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />
          {/* Panel */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200 opacity-0 translate-y-2 animate-[popIn_.22s_ease-out_forwards]">
              <div className="px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <AlertTriangle className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Remove from Featured?</h3>
                    {confirm.book && (
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">{confirm.book.title}</span> will be removed
                        from the featured list.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeConfirm}
                  className="rounded-md px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={doUncheck}
                  className="rounded-md px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 focus:ring-2 focus:ring-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Toast ===== */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[60] pointer-events-none animate-[toastIn_.25s_ease-out]">
          <div className="pointer-events-auto flex items-start gap-3 rounded-xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-3">
            <div className="mt-0.5">
              <CheckCircle2 className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Success</p>
              <p className="text-xs text-gray-600">{toast.msg}</p>
            </div>
          </div>
        </div>
      )}

      {/* animations */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) } }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px) scale(.98) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  );
}