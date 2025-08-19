
// // src/pages/user/UserDashboard.jsx
import { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import api from "../../api";

export default function UserDashboard() {
  const [statistics, setStatistics] = useState([]);
  const [currentBorrowed, setCurrentBorrowed] = useState([]);

  useEffect(() => {
    document.title = "My Library";
  }, []);

  function normalizeBookData(item) {
    return {
      id: item.id,
      user: item.user?.name ?? "—",
      borrowed: item.borrowed_at ?? "—",
      returned: item.return_date ?? "—",
      book: item.book?.name ?? "", // Keep actual ID here
      cover: item.book?.book_cover_url ?? PLACEHOLDER_IMG,
      status: item.status,
    };
  }
  const loadStatistics = async () => {
    try {
      const res = await api.get("/user-dashboard/statistics");
      setStatistics(res.data.statistics);
      // console.log("Statistics:", res.data.statistics);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };
  const loadCurrentBorrowed = async () => {
    try {
      const res = await api.get("/user-dashboard/borrowed-books");
      setCurrentBorrowed(res.data.data.map(normalizeBookData));
      // console.log("Current Borrowed:", res.data.data);
    } catch (err) {
      console.error("Error fetching current borrowed books:", err);
    }
  };
  useEffect(() => {
    loadStatistics();
    loadCurrentBorrowed();
  }, []);
  // console.log("Current Borrowed:", currentBorrowed);
  // console.log("Statistics:", statistics);
  // demo data (replace with API later)
  const myLoans = [
    { id: "LO-2311", title: "Core Java", due: "2025-08-20", status: "Borrowed" },
    { id: "LO-2310", title: "SQL in 10 Minutes", due: "2025-08-10", status: "Overdue" },
  ];
  const counts = {
    borrowed: myLoans.filter((x) => x.status === "Borrowed").length,
    overdue: myLoans.filter((x) => x.status === "Overdue").length,
    returned: 3,
  };

  // current signed-in user's display name (for "User Name" column)
  const currentUserName = "Mark Wood";

  // small badge style for status
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
    type: null, // 'expected' | 'return'
    loan: null,
    date: "",
    note: "",
  });

  const openModal = (type, loan) =>
    setModal({
      open: true,
      type,
      loan,
      date: loan?.due || "",
      note: "",
    });
  const closeModal = () =>
    setModal({ open: false, type: null, loan: null, date: "", note: "" });

  // simple toast
  const [toast, setToast] = useState({ show: false, msg: "" });
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 1800);
  };

  const confirmModal = async () => {
    try {
      if (modal.type === "expected") {
        // Call extend API
        const res = await api.patch(`/borrow/extend/${modal.loan.id}`, {
          return_date: modal.date,
        });
        showToast(res.data.message || "Expected date saved");
        loadCurrentBorrowed();
      } else {
        // Call return API
        const res = await api.post(`/borrow/return/${modal.loan.id}`);
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Reused sidebar */}
      <UserSidebar active="dashboard" />

      {/* Main */}
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

          {/* Responsive container for table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3 min-w-[180px]">Title</th>
                  {/* <th className="py-2 px-3 min-w-[160px]">User Name</th> */}
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
                    {/* <td className="py-2 px-3">{l.user}</td> */}
                    <td className="py-2 px-3">{l.returned}</td>
                    <td className="py-2 px-3">
                      <span className={statusBadge(l.status)}>{l.status}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openModal("expected", l)}
                          className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
                ))}

                {currentBorrowed.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No active loans.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* small-screen hint */}
          <div className="px-1 pt-2 text-xs text-gray-500 md:hidden">
            Tip: swipe horizontally to see all columns.
          </div>
        </div>

        {/* Quick search placeholder */}
        {/* <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Find a book</h3>
          <input
            placeholder="Search by title, author, ISBN…"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div> */}
      </main>

      {/* ---- Modal (Expected / Return) ---- */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />

          {/* Panel */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200 opacity-0 translate-y-2 animate-[popIn_.22s_ease-out_forwards]">

              {/* Header */}
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

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                {modal.type === "expected" && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Expected Date
                    </label>
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
                    Are you sure you want to return{" "}
                    <strong>{modal.loan.book}</strong>?
                  </p>
                )}
              </div>

              {/* Footer */}
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
                  className={`rounded-md px-5 py-2 text-sm font-semibold text-white ${modal.type === "expected"
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
              <p className="text-xs text-gray-600">{toast.msg}</p>
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
