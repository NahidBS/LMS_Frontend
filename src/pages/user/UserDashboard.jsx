// src/pages/user/UserDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import api from "../../api";

const PLACEHOLDER_IMG = "https://via.placeholder.com/80x120?text=No+Cover";

export default function UserDashboard() {
  const [statistics, setStatistics] = useState({
    total_borrowed_books: 0,
    total_overdue_books: 0,
    total_returned_books: 0,
    total_borrow_request: 0,
    total_borrow_reject: 0,
  });
  const [currentBorrowed, setCurrentBorrowed] = useState([]);

  useEffect(() => {
    document.title = "My Library";
  }, []);

  const statusBadge = (s) => {
    const base =
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
    if (s === "Overdue") return `${base} bg-red-100 text-red-700`;
    if (s === "Borrowed") return `${base} bg-sky-100 text-sky-700`;
    return `${base} bg-green-100 text-green-700`;
  };

  // ---------- Modal state (Expected / Return) ----------
  const [modal, setModal] = useState({
    open: false,
    type: null,
    loan: null,
    date: "",
  });

  const openModal = (type, loan) =>
    setModal({ open: true, type, loan, date: loan?.due_date || "" });
  const closeModal = () => setModal({ open: false, type: null, loan: null, date: "" });

  const [toast, setToast] = useState({ show: false, msg: "" });
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 1800);
  };

  const confirmModal = async () => {
    try {
      if (modal.type === "expected") {
        const res = await api.put(`/borrow/date_extend/${modal.loan.id}`, {
          return_date: modal.date,
        });
        showToast(res.data.message || "Expected date saved");
        loadCurrentBorrowed();
      } else {
        const res = await api.delete(`/borrow/return/${modal.loan.id}`);
        showToast(res.data.message || "Return recorded");
        loadCurrentBorrowed();
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong";
      showToast(msg);
    }
    closeModal();
  };

  // Load borrow statistics
  const loadStatistics = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) {
        console.warn("No user ID found in localStorage");
        return;
      }

      const res = await api.get("/borrow/list", { params: { userId: user.id } });
      console.log("Borrow list response:", res.data.content);

      const borrows = res.data.content || [];
      const totalBorrowed = borrows.length;
      const overdue = borrows.filter((b) => b.is_overdue).length;
      const returned = borrows.filter((b) => b.status === "RETURNED").length;
      const requests = borrows.filter((b) => b.status === "PENDING").length;
      const rejected = borrows.filter((b) => b.status === "REJECTED").length;

      setStatistics({
        total_borrowed_books: totalBorrowed,
        total_overdue_books: overdue,
        total_returned_books: returned,
        total_borrow_request: requests,
        total_borrow_reject: rejected,
      });
    } catch (err) {
      console.error("Error loading statistics:", err);
    }
  };

  // Load current active borrows
  const loadCurrentBorrowed = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) return;

      const res = await api.get("/borrow/list", { params: { userId: user.id, active: true } });
      console.log("Current borrowed response:", res.data.content);

      setCurrentBorrowed(
        (res.data.content || []).map((item) => ({
          id: item.id,
          book: item.book?.name ?? "—",
          cover: item.book?.book_cover_url ?? PLACEHOLDER_IMG,
          borrow_date: item.borrow_date ?? "—",
          due_date: item.due_date ?? "—",
          status: item.is_overdue ? "Overdue" : "Borrowed",
          canExtend: item.can_be_extended,
        }))
      );
    } catch (err) {
      console.error("Error loading borrowed books:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) {
      loadStatistics();
      loadCurrentBorrowed();
      clearInterval(interval);
    }
  }, 50); // poll every 50ms
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <UserSidebar active="dashboard" />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Welcome back!</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-sm text-gray-500">Total Borrowed</p>
            <p className="text-xl font-bold text-gray-800">{statistics.total_borrowed_books}</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-xl font-bold text-red-600">{statistics.total_overdue_books}</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-sm text-gray-500">Returned</p>
            <p className="text-xl font-bold text-gray-800">{statistics.total_returned_books}</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-sm text-gray-500">Total Request</p>
            <p className="text-xl font-bold text-gray-800">{statistics.total_borrow_request}</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-sm text-gray-500">Total Reject</p>
            <p className="text-xl font-bold text-red-600">{statistics.total_borrow_reject}</p>
          </div>
        </div>

        {/* My Loans */}
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">My current loans</h3>
            <Link to="/loans" className="text-xs text-green-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3 min-w-[180px]">Title</th>
                  <th className="py-2 px-3 min-w-[140px]">Due Date</th>
                  <th className="py-2 px-3 min-w-[120px]">Status</th>
                  <th className="py-2 px-3 min-w-[220px] text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentBorrowed.length > 0 ? (
                  currentBorrowed.map((l, i) => (
                    <tr key={l.id} className="border-b border-gray-200">
                      <td className="py-2 px-3">{i + 1}</td>
                      <td className="py-2 px-3 font-medium">{l.book}</td>
                      <td className="py-2 px-3">{l.due_date}</td>
                      <td className="py-2 px-3">
                        <span className={statusBadge(l.status)}>{l.status}</span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openModal("expected", l)}
                            className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            disabled={!l.canExtend}
                          >
                            Expected
                          </button>
                          <button
                            type="button"
                            onClick={() => openModal("return", l)}
                            className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                          >
                            Return
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No active loans.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-1 pt-2 text-xs text-gray-500 md:hidden">
            Tip: swipe horizontally to see all columns.
          </div>
        </div>
      </main>

      {/* ---- Modal (Expected / Return) ---- */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200 opacity-0 translate-y-2 animate-[popIn_.22s_ease-out_forwards]">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  {modal.type === "expected" ? "Set Expected Date" : "Confirm Return"}
                </h3>
                {modal.loan && (
                  <p className="mt-1 text-sm text-gray-600">
                    {modal.loan.book} — current due {modal.loan.returned}
                  </p>
                )}
              </div>

              <div className="px-6 py-5 space-y-4">
                {modal.type === "expected" && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Expected Date</label>
                    <input
                      type="date"
                      value={modal.date}
                      onChange={(e) =>
                        setModal((m) => ({ ...m, date: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                )}
                {modal.type === "return" && (
                  <p className="text-sm text-gray-700">
                    Are you sure you want to return <strong>{modal.loan.book}</strong>?
                  </p>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmModal}
                  className={`rounded-md px-5 py-2 text-sm font-semibold text-white ${
                    modal.type === "expected"
                      ? "bg-sky-600 hover:bg-sky-500 focus:ring-2 focus:ring-sky-400"
                      : "bg-green-600 hover:bg-green-500 focus:ring-2 focus:ring-green-400"
                  }`}
                >
                  {modal.type === "expected" ? "Save Expected" : "Confirm Return"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Toast ---- */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[60] pointer-events-none animate-[toastIn_.25s_ease-out]">
          <div className="pointer-events-auto flex items-start gap-3 rounded-xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-3">
            <div className="mt-0.5">
              <svg className="text-green-600" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Success</p>
              <p className="text-xs text-gray-600">{toast.msg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}
