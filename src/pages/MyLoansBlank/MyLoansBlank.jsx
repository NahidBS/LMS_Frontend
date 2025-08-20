// ManageCategory.jsx

import { useEffect, useState, useMemo } from "react";
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
  CheckCircle2,
  AlertTriangle, // NEW: for delete confirm
} from "lucide-react";
import sectionedBooks from "../../data/sampleBooks";
import UserSidebar from "../../components/UserSidebar/UserSidebar";

// seed (only used if no categories found) — status removed
const seedCategories = [
  { id: 1, name: "Web Design", slug: "web-design" },
  { id: 2, name: "Web Development", slug: "web-development" },
  { id: 3, name: "Programming", slug: "programming" },
  { id: 4, name: "Commerce", slug: "commerce" },
];

// helper: slugify category names
const slugify = (s = "") =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function MyLoansBlank() {
  useEffect(() => {
    document.title = "My Loans";
  }, []);

  // Load books.json (public)
  const [booksJson, setBooksJson] = useState([]);
  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}books.json`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setBooksJson(Array.isArray(data) ? data : []))
      .catch(() => setBooksJson([]));
  }, []);

  // Build unique category list from sampleBooks + books.json
  const computedCategories = useMemo(() => {
    const set = new Set();

    if (sectionedBooks && typeof sectionedBooks === "object") {
      Object.values(sectionedBooks).forEach((arr) => {
        if (Array.isArray(arr)) {
          arr.forEach((item) => {
            if (item && item.category) set.add(String(item.category).trim());
          });
        }
      });
    }

    booksJson.forEach((b) => {
      if (b && b.category) set.add(String(b.category).trim());
    });

    const list = Array.from(set).sort((a, b) => a.localeCompare(b));
    if (list.length === 0) return seedCategories;

    return list.map((name, i) => ({
      id: i + 1,
      name,
      slug: slugify(name),
    }));
  }, [booksJson]);

  // Local rows (so add/edit/delete reflect immediately)
  const [categories, setCategories] = useState(seedCategories);
  useEffect(() => setCategories(computedCategories), [computedCategories]);

  // Modal state (Add / Edit)
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // 'create' | 'edit'
  const [editingIndex, setEditingIndex] = useState(-1);
  const [form, setForm] = useState({ name: "" }); // status removed

  const onOpenCreate = () => {
    setMode("create");
    setEditingIndex(-1);
    setForm({ name: "" });
    setOpen(true);
  };
  const onOpenEdit = (row, index) => {
    setMode("edit");
    setEditingIndex(index);
    setForm({ name: row.name || "" });
    setOpen(true);
  };
  const onClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Saved toast (2s)
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Please enter a category name.");
      return;
    }
    const row = {
      id:
        mode === "edit" && editingIndex > -1
          ? categories[editingIndex]?.id ?? editingIndex + 1
          : (categories[categories.length - 1]?.id || 0) + 1,
      name: form.name.trim(),
      slug: slugify(form.name),
    };

    if (mode === "edit" && editingIndex > -1) {
      setCategories((prev) => {
        const next = [...prev];
        next[editingIndex] = row;
        return next;
      });
    } else {
      setCategories((prev) => [...prev, row]);
    }

    setOpen(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  // Delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(-1);

  const requestDelete = (index) => {
    setPendingDeleteIndex(index);
    setConfirmOpen(true);
  };
  const onCloseConfirm = () => {
    setPendingDeleteIndex(-1);
    setConfirmOpen(false);
  };
  const confirmDelete = () => {
    if (pendingDeleteIndex < 0) return;
    setCategories((prev) => prev.filter((_, i) => i !== pendingDeleteIndex));
    setPendingDeleteIndex(-1);
    setConfirmOpen(false);
  };

  // ===================== MY LOANS (now 5 rows) =====================
  const myLoans = [
    { id: "LO-2315", title: "JavaScript: The Good Parts", due: "2025-08-22", status: "Borrowed" },
    { id: "LO-2314", title: "Clean Code",                  due: "2025-08-18", status: "Borrowed" },
    { id: "LO-2313", title: "Design Patterns",             due: "2025-08-15", status: "Returned" },
    { id: "LO-2312", title: "You Don't Know JS",           due: "2025-08-12", status: "Overdue" },
    { id: "LO-2311", title: "Core Java",                   due: "2025-08-10", status: "Overdue" },
  ];
  const currentUserName = "Mark Wood";

  const statusBadge = (s) => {
    const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
    if (s === "Overdue") return `${base} bg-red-100 text-red-700`;
    if (s === "Borrowed") return `${base} bg-sky-100 text-sky-700`;
    return `${base} bg-green-100 text-green-700`;
  };

  // Popup for Expected / Return
  const [loanModal, setLoanModal] = useState({
    open: false,
    type: null, // 'expected' | 'return'
    loan: null,
    date: "",
    note: "",
  });

  const openLoanModal = (type, loan) =>
    setLoanModal({
      open: true,
      type,
      loan,
      date: loan?.due || "",
      note: "",
    });
  const closeLoanModal = () =>
    setLoanModal({ open: false, type: null, loan: null, date: "", note: "" });

  const [loanToast, setLoanToast] = useState({ show: false, msg: "" });
  const showLoanToast = (msg) => {
    setLoanToast({ show: true, msg });
    setTimeout(() => setLoanToast({ show: false, msg: "" }), 1800);
  };
  const confirmLoanModal = () => {
    if (loanModal.type === "expected") showLoanToast("Expected date saved");
    else showLoanToast("Return recorded");
    closeLoanModal();
  };
  // ================================================================================

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar — identical styling */}
      <UserSidebar />

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            My Loans
          </h1>
          {/* <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <Plus size={16} /> Add Category
          </button> */}
        </div>

        <div className="bg-white rounded shadow">
          <div className="w-full overflow-x-auto">
            {/* === My Loans table (ash borders, centered Action) === */}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-3 px-4 min-w-[70px]">#</th>
                  <th className="py-3 px-4 min-w-[220px]">Title</th>
                  <th className="py-3 px-4 min-w-[180px]">User Name</th>
                  <th className="py-3 px-4 min-w-[160px]">Due Date</th>
                  <th className="py-3 px-4 min-w-[140px]">Status</th>
                  <th className="py-3 px-4 min-w-[240px] text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {myLoans.map((l, i) => (
                  <tr key={l.id} className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-700">{i + 1}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{l.title}</td>
                    <td className="py-3 px-4 text-gray-700">{currentUserName}</td>
                    <td className="py-3 px-4 text-gray-700">{l.due}</td>
                    <td className="py-3 px-4">
                      <span className={statusBadge(l.status)}>{l.status}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openLoanModal("expected", l)}
                          className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                          Expected
                        </button>
                        <button
                          type="button"
                          onClick={() => openLoanModal("return", l)}
                          className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                          Return
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {myLoans.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No active loans.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* === /My Loans table === */}
          </div>

          <div className="px-4 py-3 text-xs text-gray-500 md:hidden">
            Tip: swipe horizontally to see all columns.
          </div>
        </div>
      </main>

      {/* -------- Modal: Add/Edit Category -------- */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />
          {/* Panel */}
          <div className="absolute inset-0 flex items-start justify-center pt-10">
            <div className="w-full max-w-2xl mx-4 rounded-lg bg-white shadow-lg border border-gray-200 opacity-0 translate-y-2 animate-[popIn_.22s_ease-out_forwards]">
              <div className="px-6 py-4 border-b flex items-center gap-2">
                <Plus size={20} className="text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {mode === "edit" ? "Edit category" : "Add category"}
                </h3>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Type category name"
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t bg-white flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------- Delete Confirmation Modal -------- */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseConfirm();
          }}
        >
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg opacity-0 translate-y-2 animate-[popIn_.2s_ease-out_forwards]">
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
                          {categories[pendingDeleteIndex]?.name || "This category"}
                        </span>{" "}
                        will be permanently removed from the list.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-white flex justify-end gap-3">
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

      {/* -------- Saved Toast (2s) -------- */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-[60] pointer-events-none animate-[toastIn_.25s_ease-out]">
          <div className="pointer-events-auto flex items-start gap-3 rounded-xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-3">
            <div className="mt-0.5">
              <CheckCircle2 className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Saved</p>
              <p className="text-xs text-gray-600">Category has been updated.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Loans Popup (Expected / Return) ===== */}
      {loanModal.open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLoanModal();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />
          {/* Panel */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200 opacity-0 translate-y-2 animate-[popIn_.22s_ease-out_forwards]">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  {loanModal.type === "expected" ? "Set Expected Date" : "Confirm Return"}
                </h3>
                {loanModal.loan && (
                  <p className="mt-1 text-sm text-gray-600">
                    {loanModal.loan.title} — current due {loanModal.loan.due}
                  </p>
                )}
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    {loanModal.type === "expected" ? "Expected Date" : "Return Date"}
                  </label>
                  <input
                    type="date"
                    value={loanModal.date}
                    onChange={(e) => setLoanModal((m) => ({ ...m, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Note (optional)</label>
                  <textarea
                    rows={3}
                    value={loanModal.note}
                    onChange={(e) => setLoanModal((m) => ({ ...m, note: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder={
                      loanModal.type === "expected"
                        ? "Any extra info for the expected date…"
                        : "Condition / remarks on return…"
                    }
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeLoanModal}
                  className="rounded-md px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLoanModal}
                  className={`rounded-md px-5 py-2 text-sm font-semibold text-white ${
                    loanModal.type === "expected"
                      ? "bg-sky-600 hover:bg-sky-500 focus:ring-2 focus:ring-sky-400"
                      : "bg-green-600 hover:bg-green-500 focus:ring-2 focus:ring-green-400"
                  }`}
                >
                  {loanModal.type === "expected" ? "Save Expected" : "Confirm Return"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loans toast */}
      {loanToast.show && (
        <div className="fixed bottom-6 right-6 z-[60] pointer-events-none animate-[toastIn_.25s_ease-out]">
          <div className="pointer-events-auto flex items-start gap-3 rounded-xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-3">
            <div className="mt-0.5">
              <svg
                className="text-green-600"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Success</p>
              <p className="text-xs text-gray-600">{loanToast.msg}</p>
            </div>
          </div>
        </div>
      )}

      {/* animations */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}