// src/pages/DonationRequest/DonationRequest.jsx
import { useEffect, useMemo, useState } from "react";
import {
  HandHeart,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../../components/DashboardSidebar/DashboardSidebar";

// ---- LocalStorage key ----
const LS_KEY = "donation_requests_v1";

// ---- Seed data if LS is empty (demo) ----
const SEED = [
  { id: "DR-1001", donorName: "Mahin Hasan", email: "mahin@example.com", amount: 2000, bookTitle: "JavaScript and jQuery", note: "For student program", createdAt: "2025-08-10T09:22:00Z", status: "pending" },
  { id: "DR-1002", donorName: "Farhana Akter", email: "farhana@example.com", amount: 1200, bookTitle: "Entrepreneurship", note: "", createdAt: "2025-08-12T12:05:00Z", status: "pending" },
  { id: "DR-1003", donorName: "Rakibul Islam", email: "rakibul@example.com", amount: 600, bookTitle: "Cloud Computing", note: "Small library", createdAt: "2025-08-14T15:50:00Z", status: "accepted" },
  { id: "DR-1004", donorName: "Sumaiya Noor", email: "sumaiya@example.com", amount: 900, bookTitle: "HTML & CSS", note: "", createdAt: "2025-08-15T18:30:00Z", status: "rejected" },
];

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function DonationRequest() {
  useEffect(() => {
    document.title = "Donation Request";
  }, []);

  // ---------- Data ----------
  const [items, setItems] = useState([]);     // requests (pending/accepted/rejected)
  const [history, setHistory] = useState([]); // actions log

  // Load from LS (or seed)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setItems(Array.isArray(parsed.items) ? parsed.items : []);
        setHistory(Array.isArray(parsed.history) ? parsed.history : []);
      } else {
        const seeded = SEED;
        const initialHistory = seeded
          .filter((it) => it.status !== "pending")
          .map((it, idx) => ({
            id: `${it.id}-INIT-${idx}`,
            requestId: it.id,
            action: it.status, // accepted | rejected
            at: new Date().toISOString(),
            amount: it.amount,
            donorName: it.donorName,
            bookTitle: it.bookTitle,
          }));
        localStorage.setItem(LS_KEY, JSON.stringify({ items: seeded, history: initialHistory }));
        setItems(seeded);
        setHistory(initialHistory);
      }
    } catch {
      // Fallback to seed on parse error
      localStorage.setItem(LS_KEY, JSON.stringify({ items: SEED, history: [] }));
      setItems(SEED);
      setHistory([]);
    }
  }, []);

  // Keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setItems(Array.isArray(parsed.items) ? parsed.items : []);
          setHistory(Array.isArray(parsed.history) ? parsed.history : []);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (nextItems, nextHistory) => {
    setItems(nextItems);
    setHistory(nextHistory);
    localStorage.setItem(LS_KEY, JSON.stringify({ items: nextItems, history: nextHistory }));
  };

  // ---------- UI state ----------
  const [page, setPage] = useState(1); // 1 = overview, 2 = full history
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | accepted | rejected

  // ---------- Toast (animated popup) ----------
  const [toast, setToast] = useState({ open: false, type: "accepted", msg: "" });
  const showToast = (type, msg) => {
    setToast({ open: true, type, msg });
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast((t) => ({ ...t, open: false })), 1800);
  };

  // ---------- Derived ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const matchQ =
        !q ||
        it.donorName.toLowerCase().includes(q) ||
        it.email.toLowerCase().includes(q) ||
        it.bookTitle.toLowerCase().includes(q) ||
        String(it.amount).includes(q) ||
        it.id.toLowerCase().includes(q);
      const matchS = statusFilter === "all" ? true : it.status === statusFilter;
      return matchQ && matchS;
    });
  }, [items, query, statusFilter]);

  const pending = filtered.filter((x) => x.status === "pending");
  const accepted = filtered.filter((x) => x.status === "accepted");
  const rejected = filtered.filter((x) => x.status === "rejected");

  const totalAccepted = items.filter((x) => x.status === "accepted").length;
  const totalRejected = items.filter((x) => x.status === "rejected").length;

  // ---------- Actions (Accept/Reject) with persistent history ----------
  const actOn = (id, action) => {
    if (action !== "accepted" && action !== "rejected") return;

    const src = items.find((x) => x.id === id);
    // Update item status
    const nextItems = items.map((it) =>
      it.id === id ? { ...it, status: action } : it
    );

    // Log to history
    const entry = src
      ? {
          id: `${id}-${Date.now()}`, // unique
          requestId: id,
          action,                    // accepted | rejected
          at: new Date().toISOString(),
          amount: src.amount,
          donorName: src.donorName,
          bookTitle: src.bookTitle,
        }
      : null;

    const nextHistory = entry ? [entry, ...history] : history;

    // Persist to LS so a page refresh shows the new history
    persist(nextItems, nextHistory);

    // Animated toast
    showToast(
      action,
      `${action === "accepted" ? "Accepted" : "Rejected"}: ${src?.donorName || "Request"}`
    );

    // Optional UX: jump to History page after decision
    setPage(2);
  };

  // ---------- Small UI components ----------
  const StatCard = ({ icon, label, value, tone = "sky" }) => (
    <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm">
      <div
        className={`rounded-full p-2 ${
          tone === "green"
            ? "bg-green-50 text-green-600"
            : tone === "rose"
            ? "bg-rose-50 text-rose-600"
            : "bg-sky-50 text-sky-600"
        }`}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-lg font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );

  // NOTE: Columns trimmed per your request (no email, amount, date; SL # instead of ID)
  const Table = ({ rows, showActions }) => (
    <div className="overflow-x-hidden overflow-y-hidden no-scrollbar rounded-lg border border-gray-300">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-700 border-b border-gray-300">
          <tr className="text-left">
            <th className="px-4 py-2 whitespace-nowrap">Serial No #</th>
            <th className="px-4 py-2">Donor</th>
            <th className="px-4 py-2">Book / Purpose</th>
            <th className="px-4 py-2">Status</th>
            {showActions && <th className="px-4 py-2 text-right">Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 5 : 4} className="px-4 py-6 text-center text-gray-500">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={r.id} className="border-t border-gray-300">
                <td className="px-4 py-2 font-medium">{idx + 1}</td>
                <td className="px-4 py-2">{r.donorName}</td>
                <td className="px-4 py-2">
                  <div className="font-medium">{r.bookTitle}</div>
                  {r.note && <div className="text-xs text-gray-500">{r.note}</div>}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border
                      ${
                        r.status === "accepted"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : r.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                  >
                    {r.status === "accepted" ? (
                      <CheckCircle2 size={14} />
                    ) : r.status === "rejected" ? (
                      <XCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </td>
                {showActions && (
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => actOn(r.id, "accepted")}
                        className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500"
                      >
                        <CheckCircle2 size={14} /> Accept
                      </button>
                      <button
                        onClick={() => actOn(r.id, "rejected")}
                        className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // History page — trimmed columns (no date/email/amount), shows Serial No #
  const HistoryTable = ({ rows }) => (
    <div className="overflow-x-hidden overflow-y-hidden no-scrollbar rounded-lg border border-gray-300">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-700 border-b border-gray-300">
          <tr className="text-left">
            <th className="px-4 py-2">Serial No #</th>
            <th className="px-4 py-2">Donor</th>
            <th className="px-4 py-2">Book / Purpose</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No history yet.
              </td>
            </tr>
          ) : (
            rows.map((h, idx) => (
              <tr key={h.id} className="border-t border-gray-300">
                <td className="px-4 py-2 font-medium">{idx + 1}</td>
                <td className="px-4 py-2">{h.donorName}</td>
                <td className="px-4 py-2">{h.bookTitle}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border
                      ${
                        h.action === "accepted"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                  >
                    {h.action === "accepted" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {h.action.charAt(0).toUpperCase() + h.action.slice(1)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <HandHeart className="text-sky-600" /> Donation Request
            </h1>
            <p className="text-sm text-gray-600">
              Accept / Reject commissions and view full history (persists on refresh).
            </p>
          </div>

          {/* Simple 2-page pagination */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-sm font-medium">Page {page} / 2</span>
            <button
              onClick={() => setPage((p) => Math.min(2, p + 1))}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <section className="bg-white rounded-lg shadow border border-gray-300">
          <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by donor, book or ID"
                className="w-64 md:w-80 rounded border border-gray-300 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </section>

        {page === 1 ? (
          <>
            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={<Clock size={18} />} label="Pending" value={pending.length} />
              <StatCard icon={<CheckCircle2 size={18} />} label="Accepted" value={totalAccepted} tone="green" />
              <StatCard icon={<XCircle size={18} />} label="Rejected" value={totalRejected} tone="rose" />
            </section>

            {/* Pending (Accept/Reject) */}
            <section className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-300">
                <h3 className="text-sm font-semibold text-gray-800">Pending Requests</h3>
              </div>
              <div className="p-4">
                <Table rows={pending} showActions />
              </div>
            </section>

            {/* Accepted / Rejected (read-only) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <section className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-300">
                  <h3 className="text-sm font-semibold text-gray-800">Accepted</h3>
                </div>
                <div className="p-4">
                  <Table rows={accepted} showActions={false} />
                </div>
              </section>

              <section className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-300">
                  <h3 className="text-sm font-semibold text-gray-800">Rejected</h3>
                </div>
                <div className="p-4">
                  <Table rows={rejected} showActions={false} />
                </div>
              </section>
            </div>
          </>
        ) : (
          // Page 2: Full History (persists on refresh)
          <section className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-300">
              <h3 className="text-sm font-semibold text-gray-800">Full History (Accepted & Rejected)</h3>
              <p className="text-xs text-gray-500 mt-1">
                Every accept/reject action is recorded and saved to your browser. Refresh the page and it remains.
              </p>
            </div>
            <div className="p-4">
              <HistoryTable rows={history} />
            </div>
          </section>
        )}
      </main>

      {/* Animated Toast (Professional) */}
      {toast.open && (
        <div className="fixed bottom-6 right-6 z-[60] animate-[toastIn_.22s_ease-out]">
          <div className="bg-white border border-gray-300 shadow-xl rounded-xl p-4 w-[300px]">
            <div className="flex items-start gap-3">
              <div
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                  toast.type === "accepted" ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600"
                }`}
              >
                {toast.type === "accepted" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">
                  {toast.msg}
                </div>
                <div className="text-xs text-gray-600">Action recorded in history.</div>
              </div>
            </div>
            <div className="mt-3 h-0.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-sky-500 origin-left animate-[barShrink_1.6s_linear]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Styles: no-scrollbar + animations */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes toastIn { 0% { transform: translateY(10px); opacity: 0 } 100% { transform: translateY(0); opacity: 1 } }
        @keyframes barShrink { 0% { transform: scaleX(1) } 100% { transform: scaleX(0) } }
      `}</style>
    </div>
  );
}