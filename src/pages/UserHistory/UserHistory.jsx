// UserHistory.jsx
import { useEffect, useMemo, useState } from "react";
import { Search, Eye, X } from "lucide-react";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import api from "../../api";

const badge = (type) => {
  const base = "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium";
  switch ((type || "").toUpperCase()) {
    case "REQUESTED": return `${base} bg-amber-100 text-amber-700`;
    case "ACCEPTED": return `${base} bg-blue-100 text-blue-700`;
    case "ACTIVE": return `${base} bg-sky-100 text-sky-700`;
    case "RETURNED": return `${base} bg-green-100 text-green-700`;
    case "OVERDUE": return `${base} bg-red-100 text-red-700`;
    case "REJECTED": return `${base} bg-violet-100 text-violet-700`;
    default: return `${base} bg-gray-100 text-gray-700`;
  }
};

const DEFAULT_COVER = "https://via.placeholder.com/80x120?text=No+Cover";

export default function UserHistory() {
  const [borrowedHistory, setBorrowedHistory] = useState([]);
  const [detail, setDetail] = useState(null);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    document.title = "History";
    loadBorrowHistory();
  }, []);

  const normalizeBorrow = (item) => ({
    id: item.id,
    book: item.book?.name ?? "—",
    cover: item.book?.book_cover_url ?? DEFAULT_COVER,
    borrowed: item.borrow_date ?? "—",
    due: item.due_date ?? "—",
    returned: item.return_date ?? "—",
     status: (item.status || "").toUpperCase(),
    canBeExtended: item.can_be_extended ?? false,
    note: item.note ?? "",
  });

  const loadBorrowHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.userId) return;

      const response = await api.get(`/borrow/user/${user.userId}/history`);
      const data = response.data.content.map(normalizeBorrow);
      setBorrowedHistory(data);
    } catch (error) {
      console.error("Failed to load borrowed history:", error);
    }
  };

    // Filters / search
    const filtered = useMemo(() => {
      const term = q.trim().toLowerCase();
      return borrowedHistory.filter((r) => {
        const matchesType = typeFilter === "All" || r.status.toLowerCase() === typeFilter.toLowerCase();
        const matchesSearch =
          !term ||
          [r.id, r.book, r.status]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(term));
        return matchesType && matchesSearch;
      });
    }, [borrowedHistory, q, typeFilter]);

  const openDetail = (row) => setDetail(row);
  const closeDetail = () => setDetail(null);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <UserSidebar active="history" />

      <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">History</h1>

        {/* Filters */}
        <div className="p-3 md:p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
              Type:
            </span>
            {["All", "Requested", "Accepted", "Active", "Returned", "Overdue", "Rejected"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ring-1 transition ${
                  typeFilter === t
                    ? "bg-sky-50 text-sky-700 ring-sky-200"
                    : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by book, status…"
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Table */}
        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white">
                <tr className="text-left">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4 min-w-[220px]">Book</th>
                  <th className="py-3 px-4 min-w-[130px]">Borrowed On</th>
                  <th className="py-3 px-4 min-w-[120px]">Due Date</th>
                  <th className="py-3 px-4 min-w-[130px]">Returned On</th>
                  <th className="py-3 px-4 min-w-[120px]">Status</th>
                  <th className="py-3 px-4 min-w-[140px] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((r, i) => (
                  <tr key={r.id} className="even:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{r.book}</td>
                    <td className="py-3 px-4 text-gray-700">{r.borrowed}</td>
                    <td className="py-3 px-4 text-gray-700">{r.due}</td>
                    <td className="py-3 px-4 text-gray-700">{r.returned}</td>
                    <td className="py-3 px-4">
                      <span className={badge(r.status)}>{r.status}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => openDetail(r)}
                        className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      No matching history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Details Modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => { if (e.target === e.currentTarget) closeDetail(); }}
        >
          <div className="absolute inset-0 bg-black/50 animate-[fadeIn_.2s_ease-out_forwards]" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-lg mx-4 rounded-lg bg-white shadow-lg border border-gray-200 animate-[popIn_.22s_ease-out_forwards]">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">History Details</h3>
                <button onClick={closeDetail} className="p-1 rounded hover:bg-gray-100" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="px-4 md:px-6 py-4 md:py-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Record ID</span>
                  <span className="font-medium text-gray-800">{detail.id}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Book</span>
                  <span className="font-medium text-gray-800">{detail.book}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Status</span>
                  <span className={badge(detail.status)}>{detail.status}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="rounded border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 mb-1">Borrowed On</p>
                    <p className="font-medium text-gray-800">{detail.borrowed}</p>
                  </div>
                  <div className="rounded border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 mb-1">Due Date</p>
                    <p className="font-medium text-gray-800">{detail.due}</p>
                  </div>
                  <div className="rounded border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 mb-1">Returned On</p>
                    <p className="font-medium text-gray-800">{detail.returned}</p>
                  </div>
                </div>

                {detail.note && (
                  <div className="rounded border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 mb-1">Note</p>
                    <p className="text-gray-800">{detail.note}</p>
                  </div>
                )}
              </div>

              <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-white flex justify-end">
                <button
                  type="button"
                  onClick={closeDetail}
                  className="rounded-md px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) } }
        .scrollbar-none::-webkit-scrollbar{ display:none }
        .scrollbar-none{ -ms-overflow-style:none; scrollbar-width:none }
      `}</style>
    </div>
  );
}
