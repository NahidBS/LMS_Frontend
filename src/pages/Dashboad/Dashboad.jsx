// Dashboard.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar/AdminDashboardSidebar";

const PLACEHOLDER_IMG =
  "https://via.placeholder.com/80x100.png?text=No+Cover";

export default function Dashboard() {
  const [statistics, setStatistics] = useState();
  const [borrowsRequests, setBorrowsRequests] = useState([]);
  const [overDue, setOverDue] = useState([]);
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState({
    borrowed: [0, 0, 0, 0, 0, 0, 0],
    returned: [0, 0, 0, 0, 0, 0, 0],
    overdue: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    document.title = "Library Dashboard";
  }, []);

  // --------- Fetch statistics ---------
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get("/borrow/list", {
          params: { size: 1000 } // fetch all borrows, adjust if backend paginates
        });
        const borrows = response.data.content || [];

        const stats = {
          total_borrowed_books: borrows.filter(b => b.status === "ACTIVE").length,
          total_returned_books: borrows.filter(b => b.status === "RETURNED").length,
          total_overdue_books: borrows.filter(b => b.is_overdue).length,
          current_total_books: new Set(borrows.map(b => b.book?.id)).size, // fallback
          new_members: new Set(borrows.map(b => b.user?.id)).size, // fallback if no /user API
          pending_borrows: borrows.filter(b => b.status === "PENDING").length,
          total_borrow_requests: borrows.length,
          total_borrow_rejected: borrows.filter(b => b.status === "REJECTED").length,
        };

        setStatistics(stats);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStatistics();
  }, []);

  // --------- Normalize for frontend table ---------
  function normalizeBookData(item) {
    return {
      id: item.id,
      user: item.user?.name ?? "—",
      userId: item.user?.id ?? "—",
      bookId: item.book?.id ?? "—",
      borrowed: item.borrow_date ?? "—",
      returned: item.due_date ?? "—",
      book: item.book?.name ?? "",
      cover: item.book?.book_cover_url ?? PLACEHOLDER_IMG,
    };
  }

  // -------- Fetch Recent Borrows --------
  useEffect(() => {
    const fetchRecentBorrows = async () => {
      try {
        const response = await api.get("/borrow/list", {
          params: { page: 0, size: 10 },
        });
        
        // Sort by created_at in descending order (newest first)
        const sortedBorrows = (response.data.content || []).sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        
        setRecentBorrows(sortedBorrows);
        console.log("Recent borrows:", sortedBorrows);
      } catch (error) {
        console.error("Error fetching recent borrows:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBorrows();
  }, []);

  // --------- Fetch borrow + overdue ---------
  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        // ✅ CHANGED: Fetch all borrows and filter for REQUESTED status
        const resAll = await api.get("/borrow/list", {
          params: { size: 1000 }, // Get all records
        });
        
        // Filter for REQUESTED status only for the borrow requests table
        const requestedBorrows = resAll.data.content.filter(
          borrow => borrow.status === "REQUESTED"
        );
        setBorrowsRequests(requestedBorrows.map(normalizeBookData));

        const resOverdue = await api.get("/borrow/overdue");
        setOverDue(resOverdue.data.map(normalizeBookData));

        // build weekly chart counts using all borrows
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const borrowed = Array(7).fill(0);
        const returned = Array(7).fill(0);
        const overdue = Array(7).fill(0);

        resAll.data.content.forEach((b) => {
          const d = new Date(b.borrow_date); // Use borrow_date from API
          borrowed[d.getDay() === 0 ? 6 : d.getDay() - 1]++;
          if (b.return_date) { // Use return_date from API
            const rd = new Date(b.return_date);
            returned[rd.getDay() === 0 ? 6 : rd.getDay() - 1]++;
          }
          if (b.is_overdue) { // Use is_overdue from API
            const od = new Date(b.due_date); // Use due_date from API
            overdue[od.getDay() === 0 ? 6 : od.getDay() - 1]++;
          }
        });

        setWeeklyData({ borrowed, returned, overdue });
      } catch (error) {
        console.error("Error fetching borrow requests:", error);
      }
    };
    fetchBorrows();
  }, []);




  // --------- Confirm modal + toast ---------
  const [confirm, setConfirm] = useState({ open: false, type: null, index: -1 });
  const openConfirm = (type, index) => setConfirm({ open: true, type, index });
  const closeConfirm = () => setConfirm({ open: false, type: null, index: -1 });

  const [toast, setToast] = useState({ show: false, type: "accept", message: "" });
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type, message: "" }), 2000);
  };

  const doConfirm = async () => {
    const { type, index } = confirm;
    if (index === -1) return;
    const borrow = borrowsRequests[index];
    if (!borrow?.id) return closeConfirm();

    try {
      const endpoint = type === "accept" ? "/borrow/accept" : "/borrow/reject";
      
      // Use the preserved IDs from normalizeBookData
      const userId = borrow.userId;
      const bookId = borrow.bookId;
      
      if (!userId || !bookId) {
        alert("Missing user ID or book ID");
        return closeConfirm();
      }

      await api.put(endpoint, null, {
        params: {
          userId: userId,
          bookId: bookId
        }
      });

      // Remove from borrow requests table
      setBorrowsRequests((prev) => prev.filter((_, i) => i !== index));
      // Refresh recent borrows to show updated status
      const response = await api.get("/borrow/list", {
        params: { page: 0, size: 10 },
      });
      // Sort by created_at in descending order (newest first)
      const sortedBorrows = (response.data.content || []).sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setRecentBorrows(sortedBorrows);
      
      showToast(type, type === "accept" ? "Request accepted" : "Request rejected");
    } catch (error) {
      console.error(`Error ${type} borrow request:`, error);
      alert("Action failed.");
    } finally {
      closeConfirm();
    }
  };

  // --------- Weekly chart ---------
  const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const series = useMemo(
    () => [
      { name: "Borrowed", color: "stroke-sky-500", dot: "fill-sky-500", values: weeklyData.borrowed },
      { name: "Returned", color: "stroke-amber-500", dot: "fill-amber-400", values: weeklyData.returned },
      { name: "Overdue", color: "stroke-rose-500", dot: "fill-rose-500", values: weeklyData.overdue },
    ],
    [weeklyData]
  );

  const chartBox = { w: 720, h: 200, padX: 36, padY: 20 };
  const allVals = series.flatMap((s) => s.values);
  const yMax = Math.max(1, Math.ceil(Math.max(...allVals) / 10) * 10);
  const yMin = 0;

  const sx = (i) =>
    chartBox.padX + (i * (chartBox.w - chartBox.padX * 2)) / (WEEK_LABELS.length - 1);
  const sy = (v) =>
    chartBox.h - chartBox.padY - ((v - yMin) / (yMax - yMin)) * (chartBox.h - chartBox.padY * 2);

  const makeSmoothPath = (vals) => {
    const pts = vals.map((v, i) => ({ x: sx(i), y: sy(v) }));
    if (!pts.length) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const xc = (pts[i - 1].x + pts[i].x) / 2;
      const yc = (pts[i - 1].y + pts[i].y) / 2;
      d += ` Q ${pts[i - 1].x} ${pts[i - 1].y}, ${xc} ${yc}`;
    }
    d += ` T ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
    return d;
  };

  const paths = series.map((s) => ({ ...s, d: makeSmoothPath(s.values) }));
  const pathRefs = useRef([]);
  useEffect(() => {
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.getBoundingClientRect();
      el.style.transition = `stroke-dashoffset 900ms ease ${i * 140}ms`;
      el.style.strokeDashoffset = "0";
    });
  }, [paths.map((p) => p.d).join("|")]);

  // timestamp
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminDashboardSidebar />
      <main className="flex-1 p-6 space-y-6">
        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Borrowed Books", value: statistics?.total_borrowed_books },
            { label: "Returned Books", value: statistics?.total_returned_books },
            { label: "Overdue Books", value: statistics?.total_overdue_books },
            { label: "Total Books", value: statistics?.current_total_books },
            { label: "New Members", value: statistics?.new_members },
            { label: "Pending", value: statistics?.pending_borrows },
            { label: "Total Requests", value: statistics?.total_borrow_requests },
            { label: "Rejected Requests", value: statistics?.total_borrow_rejected },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded shadow p-4 text-center">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-bold text-gray-800">{item.value ?? 0}</p>
            </div>
          ))}
        </div>

        {/* Chart + overdue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* chart */}
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold mb-2">Check-Out Statistics</h3>
              <span className="text-xs text-gray-500">Updated {hh}:{mm}:{ss}</span>
            </div>
            <div className="w-full flex justify-center">
              <svg
                viewBox={`0 0 ${chartBox.w} ${chartBox.h}`}
                width="100%"
                height="220"
                className="max-w-full"
              >
                {paths.map((p, idx) => (
                  <g key={idx}>
                    <path
                      ref={(el) => (pathRefs.current[idx] = el)}
                      d={p.d}
                      className={`${p.color}`}
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {p.values.map((v, i) => (
                      <circle
                        key={i}
                        cx={sx(i)}
                        cy={sy(v)}
                        r="3.4"
                        className={`${p.dot} stroke-white`}
                        strokeWidth="1.2"
                      />
                    ))}
                  </g>
                ))}
                {WEEK_LABELS.map((w, i) => (
                  <text
                    key={w}
                    x={sx(i)}
                    y={chartBox.h - 6}
                    textAnchor="middle"
                    className="fill-gray-400"
                    style={{ fontSize: 10 }}
                  >
                    {w}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* overdue list */}
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Overdue’s History</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th>#</th>
                  <th>Book name</th>
                  <th>User name</th>
                  <th>Returned Date</th>
                </tr>
              </thead>
              <tbody>
                {overDue.map((d, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td>{i + 1}</td>
                    <td className="py-3 px-4">{d.book}</td>
                    <td>{d.user}</td>
                    <td>{d.returned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Borrow Requests</h2>
          {loading ? (
            <p>Loading...</p>
          ) : recentBorrows.length > 0 ? (
            <ul className="space-y-4">
              {recentBorrows.map((borrow) => (
                <li
                  key={borrow.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={borrow.book?.book_cover_url|| PLACEHOLDER_IMG}
                      alt={borrow.book?.name}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{borrow.book?.name}</p>
                      <p className="text-sm text-gray-500">
                        Borrower: {borrow.user?.username || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      borrow.status === "ACTIVE"
                        ? "bg-blue-100 text-blue-800"
                        : borrow.status === "RETURNED"
                        ? "bg-green-100 text-green-800"
                        : borrow.status === "PENDING"
                        ? "bg-orange-100 text-orange-800"
                        : borrow.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {borrow.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent borrow requests found.</p>
          )}
        </div>

        {/* borrow request */}
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Borrow Request</h3>
            <Link to="#" className="text-xs text-green-600 hover:underline">
              View All
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th>#</th>
                <th>Book name</th>
                <th>User name</th>
                <th>Borrowed Date</th>
                <th>Returned Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowsRequests.map((r, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td>{i + 1}</td>
                  <td>{r.book}</td>
                  <td>{r.user}</td>
                  <td>{r.borrowed}</td>
                  <td>{r.returned}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openConfirm("accept", i)}
                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => openConfirm("reject", i)}
                        className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {borrowsRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No pending borrow requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* confirm modal + toast kept same as before... */}
      {/* Confirmation Modal */}
{confirm.open && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-lg font-semibold mb-4">
        {confirm.type === "accept" ? "Accept Request" : "Reject Request"}
      </h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to {confirm.type} this borrow request?
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={closeConfirm}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={doConfirm}
          className={`px-4 py-2 text-white rounded ${
            confirm.type === "accept" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {confirm.type === "accept" ? "Accept" : "Reject"}
        </button>
      </div>
    </div>
  </div>
)}

{/* Toast */}
{toast.show && (
  <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
    toast.type === "accept" ? "bg-green-500" : "bg-red-500"
  }`}>
    {toast.message}
  </div>
)}

    </div>
  );
  // -------- Small Stat Card Component --------
  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
      <div className="p-3 rounded-full bg-gray-100">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value ?? 0}</p>
      </div>
    </div>
);
}
