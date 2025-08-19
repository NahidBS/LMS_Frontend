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
        const response = await api.get("/admin-dashboard/statistics");
        setStatistics(response.data);
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
      borrowed: item.borrowDate ?? "—",
      returned: item.returnDate ?? "—",
      book: item.book?.name ?? "",
      cover: item.book?.bookCoverUrl ?? PLACEHOLDER_IMG,
    };
  }

  // --------- Fetch borrow + overdue ---------
  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        // ✅ CHANGED: use real backend API
        const resActive = await api.get("/borrow/list", {
          params: { active: true },
        });
        setBorrowsRequests(resActive.data.content.map(normalizeBookData));

        const resOverdue = await api.get("/borrow/overdue");
        setOverDue(resOverdue.data.map(normalizeBookData));

        // build weekly chart counts
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const borrowed = Array(7).fill(0);
        const returned = Array(7).fill(0);
        const overdue = Array(7).fill(0);

        resActive.data.content.forEach((b) => {
          const d = new Date(b.borrowDate);
          borrowed[d.getDay() === 0 ? 6 : d.getDay() - 1]++;
          if (b.returnDate) {
            const rd = new Date(b.returnDate);
            returned[rd.getDay() === 0 ? 6 : rd.getDay() - 1]++;
          }
          if (b.isOverdue) {
            const od = new Date(b.dueDate);
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
      // ✅ CHANGED: call your backend approve/reject API (adjust if needed)
      const url =
        type === "accept"
          ? `/admin-dashboard/borrows/${borrow.id}/approve`
          : `/admin-dashboard/borrows/${borrow.id}/reject`;

      await api.get(url);

      setBorrowsRequests((prev) => prev.filter((_, i) => i !== index));
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
            { label: "Borrowed Books", value: statistics?.total_borrows },
            { label: "Returned Books", value: statistics?.total_returns },
            { label: "Overdue Books", value: statistics?.overdue_borrows },
            { label: "Total Books", value: statistics?.current_total_books },
            { label: "New Members", value: statistics?.new_members },
            { label: "Pending", value: statistics?.pending_borrows },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded shadow p-4 text-center">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-bold text-gray-800">{item.value}</p>
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
    </div>
  );
}
