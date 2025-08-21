// src/pages/user/UserDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import api from "../../api";

const PLACEHOLDER_IMG = "https://via.placeholder.com/100x150?text=No+Cover";

export default function UserDashboard() {
  const [statistics, setStatistics] = useState({});
  const [currentBorrowed, setCurrentBorrowed] = useState([]);

  useEffect(() => {
    document.title = "My Library";
  }, []);

  // Normalize borrow data from API
  function normalizeBorrow(item) {
    return {
      id: item.id,
      user: item.user?.name ?? "—",
      borrowed: item.borrow_date ?? "—",
      returned: item.return_date ?? "—",
      book: item.book?.name ?? "—",
      cover: item.book?.book_cover_url ?? PLACEHOLDER_IMG,
      status: item.status === "ACTIVE" ? "Borrowed" : "Returned",
      canExtend: item.can_be_extended ?? false,
    };
  }

  // Load borrow list
  const loadBorrowed = async () => {
    try {
      const res = await api.get("/borrow/list", { params: { active: true } });
      setCurrentBorrowed(res.data.content.map(normalizeBorrow));

      // Compute basic statistics
      const totalBorrowed = res.data.total_elements;
      const totalOverdue = res.data.content.filter(b => b.is_overdue).length;
      const totalReturned = res.data.content.filter(b => b.status !== "ACTIVE").length;

      setStatistics({
        total_borrowed_books: totalBorrowed,
        total_overdue_books: totalOverdue,
        total_returned_books: totalReturned,
        total_borrow_request: totalBorrowed, // placeholder, adapt if you have another endpoint
        total_borrow_reject: 0, // placeholder
      });
    } catch (err) {
      console.error("Failed to fetch borrowed books:", err);
    }
  };

  useEffect(() => {
    loadBorrowed();
  }, []);

  // Status badge
  const statusBadge = (s) => {
    const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
    if (s === "Overdue") return `${base} bg-red-100 text-red-700`;
    if (s === "Borrowed") return `${base} bg-sky-100 text-sky-700`;
    return `${base} bg-green-100 text-green-700`;
  };

  // Modal state
  const [modal, setModal] = useState({ open: false, type: null, loan: null, date: "" });
  const openModal = (type, loan) => setModal({ open: true, type, loan, date: loan?.returned || "" });
  const closeModal = () => setModal({ open: false, type: null, loan: null, date: "" });

  // Toast
  const [toast, setToast] = useState({ show: false, msg: "" });
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 1800);
  };

  const confirmModal = async () => {
    try {
      if (!modal.loan) return;

      if (modal.type === "expected") {
        // Extend borrow
        const res = await api.patch(`/borrow/extend/${modal.loan.id}`, { return_date: modal.date });
        showToast(res.data.message || "Expected date updated");
      } else {
        // Return borrow
        const res = await api.post(`/borrow/return/${modal.loan.id}`);
        showToast(res.data.message || "Book returned");
      }
      loadBorrowed();
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      showToast(msg);
    }
    closeModal();
  };

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
        </div>

        {/* Borrowed books table */}
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">My current loans</h3>
            <Link to="/loans" className="text-xs text-green-600 hover:underline">View All</Link>
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
                {currentBorrowed.map((l, i) => (
                  <tr key={l.id} className="border-b border-gray-200">
                    <td className="py-2 px-3">{i + 1}</td>
                    <td className="py-2 px-3 font-medium">{l.book}</td>
                    <td className="py-2 px-3">{l.returned ?? l.borrowed}</td>
                    <td className="py-2 px-3">
                      <span className={statusBadge(l.status)}>{l.status}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {l.canExtend && (
                          <button
                            onClick={() => openModal("expected", l)}
                            className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                          >
                            Expected
                          </button>
                        )}
                        <button
                          onClick={() => openModal("return", l)}
                          className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                          Return
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentBorrowed.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">No active loans.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
