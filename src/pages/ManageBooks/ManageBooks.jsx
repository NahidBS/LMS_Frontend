// src/pages/ManageBooks/ManageBooks.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
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
  AlertTriangle,
} from "lucide-react";

import sectionedBooks from "../../data/sampleBooks";

const PLACEHOLDER_IMG =
  "https://dummyimage.com/80x80/e5e7eb/9ca3af&text=📘";

// ---------- helpers ----------
function toYMD(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function normalizeFromSection(item) {
  return {
    id: String(item.id ?? crypto.randomUUID()),
    title: item.title ?? "—",
    author: item.author ?? item.authors ?? "—",
    category: item.category ?? "—",
    copies: "—",
    updatedOn: toYMD(item.publishDate ?? item.stockDate ?? ""),
    cover: item.image ?? item.coverImage ?? PLACEHOLDER_IMG,
    publisher: item.publisher ?? "—",
    isbn: item.isbn ?? "—",
    rack: item.rack ?? "—",
    status:
      item.status?.toLowerCase().includes("disable") ||
      item.status?.toLowerCase().includes("out of stock")
        ? "Disable"
        : "Enable",
  };
}

function normalizeFromJson(item) {
  return {
    id: String(item.id ?? crypto.randomUUID()),
    title: item.title ?? "—",
    author: item.authors ?? item.author ?? "—",
    category: item.category ?? "—",
    copies: "—",
    updatedOn: toYMD(item.publishDate ?? ""),
    cover: item.coverImage ?? PLACEHOLDER_IMG,
    publisher: item.publisher ?? "—",
    isbn: item.isbn ?? "—",
    rack: item.rack ?? "—",
    status: String(item.summary || "")
      .toLowerCase()
      .includes("out of stock")
      ? "Disable"
      : "Enable",
  };
}

const withCurrent = (arr, curr) =>
  Array.from(new Set([...(curr ? [curr] : []), ...arr]));

export default function ManageBooks() {
  useEffect(() => {
    document.title = "Manage Books";
  }, []);

  // --------- load books.json from PUBLIC ----------
  const [booksJson, setBooksJson] = useState([]);
  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}books.json`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setBooksJson(Array.isArray(data) ? data : []))
      .catch(() => setBooksJson([]));
  }, []);

  // build table data (normalized)
  const baseBooks = useMemo(() => {
    const fromSections = [];
    if (sectionedBooks) {
      const {
        recommended = [],
        popular = [],
        business = [],
        featuredBooks = [],
        relatedBooks = [],
      } = sectionedBooks;
      [...recommended, ...popular, ...business, ...featuredBooks, ...relatedBooks].forEach(
        (b) => fromSections.push(normalizeFromSection(b))
      );
    }
    const fromJson = booksJson.map(normalizeFromJson);

    // dedupe by title+author
    const seen = new Set();
    const combined = [];
    [...fromSections, ...fromJson].forEach((b) => {
      const key = `${(b.title || "").trim().toLowerCase()}__${(b.author || "")
        .trim()
        .toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(b);
      }
    });

    combined.sort((a, b) => String(b.updatedOn).localeCompare(String(a.updatedOn)));
    return combined;
  }, [booksJson]);

  // displayed list (allows local add/edit/delete)
  const [displayed, setDisplayed] = useState([]);
  useEffect(() => setDisplayed(baseBooks), [baseBooks]);

  // --------- Add/Edit modal state ----------
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("create"); // 'create' | 'edit'
  const [editingIndex, setEditingIndex] = useState(-1);

  // --------- Delete confirmation modal state ----------
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(-1);

  const options = useMemo(() => {
    const authors = new Set();
    const publishers = new Set();
    const categories = new Set();
    baseBooks.forEach((b) => {
      if (b.author && b.author !== "—") authors.add(b.author);
      if (b.publisher && b.publisher !== "—") publishers.add(b.publisher);
      if (b.category && b.category !== "—") categories.add(b.category);
    });
    return {
      authors: Array.from(authors).sort(),
      publishers: Array.from(publishers).sort(),
      categories: Array.from(categories).sort(),
      racks: ["R1", "R2", "R3", "R4"],
      status: ["Enable", "Disable"],
    };
  }, [baseBooks]);

  const emptyForm = {
    title: "",
    isbn: "",
    copies: "",
    author: "",
    publisher: "",
    category: "",
    rack: "",
    status: "",
  };
  const [form, setForm] = useState(emptyForm);

  const rowToForm = (row) => ({
    title: row.title && row.title !== "—" ? row.title : "",
    isbn: row.isbn && row.isbn !== "—" ? row.isbn : "",
    copies:
      row.copies !== undefined && row.copies !== "—" ? String(row.copies) : "",
    author: row.author && row.author !== "—" ? row.author : "",
    publisher: row.publisher && row.publisher !== "—" ? row.publisher : "",
    category: row.category && row.category !== "—" ? row.category : "",
    rack: row.rack && row.rack !== "—" ? row.rack : "",
    status: row.status && row.status !== "—" ? row.status : "",
  });

  const onOpenCreate = () => {
    setMode("create");
    setEditingIndex(-1);
    setForm(emptyForm);
    setOpen(true);
  };

  const onOpenEdit = (row, index) => {
    setMode("edit");
    setEditingIndex(index);
    setForm(rowToForm(row));
    setOpen(true);
  };

  const onClose = useCallback(() => setOpen(false), []);
  const onCloseConfirm = useCallback(() => setConfirmOpen(false), []);

  // lock page scroll when any modal open
  useEffect(() => {
    const anyOpen = open || confirmOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
  }, [open, confirmOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.title) {
      alert("Please enter a book name.");
      return;
    }
    setSaving(true);

    if (mode === "edit" && editingIndex >= 0) {
      setDisplayed((prev) => {
        const next = [...prev];
        const row = { ...next[editingIndex] };
        row.title = form.title || "—";
        row.isbn = form.isbn || "—";
        row.copies = form.copies || "—";
        row.author = form.author || "—";
        row.publisher = form.publisher || "—";
        row.category = form.category || "—";
        row.rack = form.rack || "—";
        row.status = form.status || "Enable";
        row.updatedOn = toYMD(new Date().toISOString());
        next[editingIndex] = row;
        return next;
      });
    } else {
      const newRow = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: form.title || "—",
        author: form.author || "—",
        category: form.category || "—",
        copies: form.copies || "—",
        updatedOn: toYMD(new Date().toISOString()),
        cover: PLACEHOLDER_IMG,
        isbn: form.isbn || "—",
        publisher: form.publisher || "—",
        rack: form.rack || "—",
        status: form.status || "Enable",
      };
      setDisplayed((prev) => [newRow, ...prev]);
    }

    setSaving(false);
    setOpen(false);
  };

  const requestDelete = (index) => {
    setPendingDeleteIndex(index);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteIndex < 0) return;
    setDisplayed((prev) => prev.filter((_, i) => i !== pendingDeleteIndex));
    setPendingDeleteIndex(-1);
    setConfirmOpen(false);
  };

  const navItem =
    "flex items-center gap-2 px-3 py-3 text-gray-700 hover:text-sky-500 transition-colors";
  const navItemActive =
    "flex items-center gap-2 px-3 py-3 text-sky-600 font-medium";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Library</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/admin" className={navItem}>
                <CalendarDays size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/manage-books" className={navItemActive}>
                <BookOpen size={18} /> Manage Books
              </Link>
            </li>
            <li>
              <Link to="/admin/manage-category" className={navItem}>
                <Layers size={18} /> Manage Category
              </Link>
            </li>
            {/* <li>
              <Link to="/upload" className={navItem}>
                <Upload size={18} /> Upload Books
              </Link>
            </li> */}
            <li>
              <Link to="/members" className={navItem}>
                <Users size={18} /> Member
              </Link>
            </li>
            <li>
              <Link to="/borrowed" className={navItem}>
                <BookOpen size={18} /> Check-out Books
              </Link>
            </li>
            <li>
              <Link to="/help" className={navItem}>
                <HelpCircle size={18} /> Help
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

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Manage Books</h1>

        {/* Card with ash border */}
        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-medium text-gray-700">Books List</span>
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <Plus size={16} /> Add Book
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left border-b">
                    <th className="py-3 px-4">Book</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 whitespace-nowrap">No of copy</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((b, i) => (
                    <tr
                      key={`${(b.title || "").toLowerCase()}__${(b.author || "")
                        .toLowerCase()}__${i}`}
                      className={`border-b last:border-0 ${
                        i % 2 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.cover || PLACEHOLDER_IMG}
                            alt={b.title}
                            className="h-10 w-10 rounded object-cover bg-gray-100 flex-shrink-0"
                          />
                          <p className="font-semibold text-gray-800 truncate">
                            {b.title}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{b.author}</td>
                      <td className="py-3 px-4 text-gray-700">{b.category}</td>
                      <td className="py-3 px-4 text-gray-700">{b.copies ?? "—"}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenEdit(b, i)}
                            className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(i)}
                            className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {displayed.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                        No books found in your data sources.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Add/Edit Book Modal (no inner scroll, 2-column layout) ---------- */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />
          <div className="absolute inset-0 flex items-start justify-center pt-8 md:pt-12">
            <div
              className="
                w-full max-w-3xl md:max-w-4xl mx-4 rounded-lg bg-white shadow-lg border border-gray-200
                opacity-0 translate-y-3 scale-[0.98] animate-[popIn_.22s_ease-out_forwards]
              "
            >
              <div className="px-6 py-4 border-b flex items-center gap-2">
                {mode === "edit" ? (
                  <Pencil size={20} className="text-gray-700" />
                ) : (
                  <Plus size={20} className="text-gray-700" />
                )}
                <h3 className="text-lg font-semibold text-gray-800">
                  {mode === "edit" ? "Edit book" : "Add book"}
                </h3>
              </div>

              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Book</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="book name"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">ISBN No</label>
                    <input
                      name="isbn"
                      value={form.isbn}
                      onChange={handleChange}
                      placeholder="isbn name"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">No of copy</label>
                    <input
                      name="copies"
                      value={form.copies}
                      onChange={handleChange}
                      placeholder="No of copy"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Author</label>
                    <select
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="">Select</option>
                      {withCurrent(options.authors, form.author).map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Publisher</label>
                    <select
                      name="publisher"
                      value={form.publisher}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="">Select</option>
                      {withCurrent(options.publishers, form.publisher).map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="">Select</option>
                      {withCurrent(options.categories, form.category).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Rack</label>
                    <select
                      name="rack"
                      value={form.rack}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="">Select</option>
                      {withCurrent(options.racks, form.rack).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="">Select</option>
                      {withCurrent(options.status, form.status).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-md px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-70"
                >
                  {mode === "edit" ? (saving ? "Updating…" : "Update") : saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Delete Confirmation Modal ---------- */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseConfirm();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />

          {/* Panel */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200 opacity-0 translate-y-2 animate-[popIn_.2s_ease-out_forwards]">
              <div className="px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <AlertTriangle className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Are you sure you want to delete this record?
                    </h3>
                    {pendingDeleteIndex > -1 && (
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">
                          {displayed[pendingDeleteIndex]?.title || "This book"}
                        </span>{" "}
                        will be permanently removed from the list.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t bg-white flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseConfirm}
                  className="rounded-md px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* animations */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}


















// // src/pages/ManageBooks/ManageBooks.jsx
// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   CalendarDays,
//   Upload,
//   Users,
//   BookOpen,
//   HelpCircle,
//   LogOut,
//   Layers,
//   Plus,
//   Pencil,
//   Trash2,
// } from "lucide-react";

// // Sectioned data from src (recommended, popular, etc.)
// import sectionedBooks from "../../data/sampleBooks";

// const PLACEHOLDER_IMG =
//   "https://dummyimage.com/80x80/e5e7eb/9ca3af&text=📘";

// // ---- UI helpers ----
// function toYMD(dateStr) {
//   if (!dateStr) return "—";
//   const d = new Date(dateStr);
//   if (isNaN(d.getTime())) return dateStr;
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${dd}`;
// }

// // Normalize from sampleBooks.js
// function normalizeFromSection(item) {
//   return {
//     id: String(item.id ?? crypto.randomUUID()),
//     title: item.title ?? "—",
//     author: item.author ?? item.authors ?? "—",
//     category: item.category ?? "—",
//     copies: "—",
//     // kept for sorting/dedup only
//     updatedOn: toYMD(item.publishDate ?? item.stockDate ?? ""),
//     cover: item.image ?? item.coverImage ?? PLACEHOLDER_IMG,
//   };
// }

// // Normalize from public/books.json
// function normalizeFromJson(item) {
//   return {
//     id: String(item.id ?? crypto.randomUUID()),
//     title: item.title ?? "—",
//     author: item.authors ?? item.author ?? "—",
//     category: item.category ?? "—",
//     copies: "—",
//     // kept for sorting/dedup only
//     updatedOn: toYMD(item.publishDate ?? ""),
//     cover: item.coverImage ?? PLACEHOLDER_IMG,
//   };
// }

// export default function ManageBooks() {
//   useEffect(() => {
//     document.title = "Manage Books";
//   }, []);

//   // Fetch books.json from PUBLIC (don’t import from public/)
//   const [booksJson, setBooksJson] = useState([]);
//   useEffect(() => {
//     const url = `${import.meta.env.BASE_URL}books.json`;
//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`Failed to load ${url}`);
//         return res.json();
//       })
//       .then((data) => setBooksJson(Array.isArray(data) ? data : []))
//       .catch(() => setBooksJson([]));
//   }, []);

//   // Build table data
//   const tableBooks = useMemo(() => {
//     const fromSections = [];
//     if (sectionedBooks) {
//       const {
//         recommended = [],
//         popular = [],
//         business = [],
//         featuredBooks = [],
//         relatedBooks = [],
//       } = sectionedBooks;
//       [...recommended, ...popular, ...business, ...featuredBooks, ...relatedBooks].forEach(
//         (b) => fromSections.push(normalizeFromSection(b))
//       );
//     }

//     const fromJson = booksJson.map(normalizeFromJson);

//     // de-duplicate by title+author (case/space insensitive)
//     const seen = new Set();
//     const combined = [];
//     [...fromSections, ...fromJson].forEach((b) => {
//       const key = `${(b.title || "").trim().toLowerCase()}__${(b.author || "")
//         .trim()
//         .toLowerCase()}`;
//       if (!seen.has(key)) {
//         seen.add(key);
//         combined.push(b);
//       }
//     });

//     // optional sort by date (kept internally; not displayed)
//     combined.sort((a, b) => String(b.updatedOn).localeCompare(String(a.updatedOn)));

//     return combined;
//   }, [booksJson]);

//   // Sidebar item sizing (same look, just comfy height)
//   const navItem =
//     "flex items-center gap-2 px-3 py-3 text-gray-700 hover:text-sky-500 transition-colors";
//   const navItemActive =
//     "flex items-center gap-2 px-3 py-3 text-sky-600 font-medium";

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
//         <div>
//           <h2 className="text-xl font-bold mb-6">Library</h2>
//           <ul className="space-y-2">
//             <li>
//               <Link to="/dashboard" className={navItem}>
//                 <CalendarDays size={18} /> Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link to="/manage-books" className={navItemActive}>
//                 <BookOpen size={18} /> Manage Books
//               </Link>
//             </li>
//             <li>
//               <Link to="/manage-category" className={navItem}>
//                 <Layers size={18} /> Manage Category
//               </Link>
//             </li>
//             <li>
//               <Link to="/upload" className={navItem}>
//                 <Upload size={18} /> Upload Books
//               </Link>
//             </li>
//             <li>
//               <Link to="/fill-up-form" className={navItem}>
//                 <BookOpen size={18} /> Fill Up Form
//               </Link>
//             </li>
//             <li>
//               <Link to="/members" className={navItem}>
//                 <Users size={18} /> Member
//               </Link>
//             </li>
//             <li>
//               <Link to="/borrowed" className={navItem}>
//                 <BookOpen size={18} /> Check-out Books
//               </Link>
//             </li>
//             <li>
//               <Link to="/help" className={navItem}>
//                 <HelpCircle size={18} /> Help
//               </Link>
//             </li>
//           </ul>
//         </div>
//         <div>
//           <Link
//             to="/logout"
//             className="flex items-center gap-2 px-3 py-3 text-red-600 font-medium hover:underline underline-offset-4"
//           >
//             <LogOut size={18} /> Logout
//           </Link>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 p-6 space-y-6">
//         <h1 className="text-xl md:text-2xl font-bold text-gray-800">Manage Books</h1>

//         {/* Card with ash border (table stays inside) */}
//         <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
//           <div className="flex items-center justify-between px-4 py-3 border-b">
//             <span className="text-sm font-medium text-gray-700">Books List</span>
//             <button
//               type="button"
//               className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
//             >
//               <Plus size={16} /> Add Book
//             </button>
//           </div>

//           <div className="px-4 pb-4">
//             {/* No horizontal scroll needed anymore; but keep safety wrapper */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border-collapse">
//                 <thead className="bg-gray-50">
//                   <tr className="text-left border-b">
//                     <th className="py-3 px-4">Book</th>
//                     {/* Removed: ISBN */}
//                     <th className="py-3 px-4">Author</th>
//                     <th className="py-3 px-4">Category</th>
//                     <th className="py-3 px-4 whitespace-nowrap">No of copy</th>
//                     {/* Removed: Status */}
//                     {/* Removed: Updated On */}
//                     <th className="py-3 px-4">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tableBooks.map((b, i) => (
//                     <tr
//                       // Composite key prevents duplicate-id warnings
//                       key={`${(b.title || "").toLowerCase()}__${(b.author || "")
//                         .toLowerCase()}__${i}`}
//                       className={`border-b last:border-0 ${
//                         i % 2 ? "bg-white" : "bg-gray-50"
//                       }`}
//                     >
//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={b.cover || PLACEHOLDER_IMG}
//                             alt={b.title}
//                             className="h-10 w-10 rounded object-cover bg-gray-100 flex-shrink-0"
//                           />
//                           <p className="font-semibold text-gray-800 truncate">
//                             {b.title}
//                           </p>
//                         </div>
//                       </td>

//                       {/* Removed: ISBN cell */}
//                       <td className="py-3 px-4 text-gray-700">{b.author}</td>
//                       <td className="py-3 px-4 text-gray-700">{b.category}</td>
//                       <td className="py-3 px-4 text-gray-700">{b.copies ?? "—"}</td>

//                       {/* Removed: Status pill */}
//                       {/* Removed: Updated On date */}

//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-2">
//                           <button
//                             type="button"
//                             className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
//                           >
//                             <Pencil size={14} /> Edit
//                           </button>
//                           <button
//                             type="button"
//                             className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
//                           >
//                             <Trash2 size={14} /> Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}

//                   {tableBooks.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
//                         No books found in your data sources.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Helper stays inside the card */}
//             <div className="pt-3 text-xs text-gray-500 md:hidden">
//               Tip: swipe horizontally to see all columns.
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }