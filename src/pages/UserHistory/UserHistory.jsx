// UserHistory.jsx (fully responsive; table stays inside ash border)
import { use, useEffect, useMemo, useState } from "react";
import { Search, Filter, Eye, X } from "lucide-react";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import api from "../../api"; // your axios instance from api.js
import { b } from "framer-motion/client";

const badge = (type) => {
  const base = "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium";
  switch (type) {
    case "borrowed":  return `${base} bg-sky-100 text-sky-700`;
    case "returned":  return `${base} bg-green-100 text-green-700`;
    case "pending":    return `${base} bg-amber-100 text-amber-700`;
    case "reject":  return `${base} bg-violet-100 text-violet-700`;
    default:          return `${base} bg-gray-100 text-gray-700`;
  }
};

export default function UserHistory() {
  const [borrowedHistory, setBorrowedHistory] = useState([]);
  useEffect(() => { document.title = "History"; }, []);

  // Demo dataset (hook up to API later)
  const rows = [
    { id: "HIS-1015", book: "Core Java", user: "Mark Wood",   type: "Borrowed", borrowedOn: "2025-08-01", dueOn: "2025-08-15", returnedOn: "", note: "First-time borrower" },
    { id: "HIS-1014", book: "Clean Code", user: "Sadia Prova", type: "Returned", borrowedOn: "2025-07-10", dueOn: "2025-07-20", returnedOn: "2025-07-18", note: "Returned in good condition" },
    { id: "HIS-1013", book: "Design Patterns", user: "Arman Hasan", type: "Booked", bookedOn: "2025-08-11", note: "Reservation for next week" },
    { id: "HIS-1012", book: "SQL in 10 Minutes", user: "Mark Wood", type: "Borrowed", borrowedOn: "2025-08-05", dueOn: "2025-08-19" },
    { id: "HIS-1011", book: "Eloquent JavaScript", user: "Nadia Islam", type: "Donation", donatedOn: "2025-08-12", note: "Like new, paperback" },
    { id: "HIS-1010", book: "You Don't Know JS", user: "Mark Wood", type: "Returned", borrowedOn: "2025-06-28", dueOn: "2025-07-10", returnedOn: "2025-07-09" },
  ];
  function normalizeBookData(item) {
    return {
      id: item.id,
      user: item.user?.name ?? "—",
      borrowed: item.borrowed_at ?? "—",
      return_date: item.return_date ?? "—",
      returned_at: item.returned_at ?? "—",
      book: item.book?.name ?? "", // Keep actual ID here
      cover: item.book?.book_cover_url ?? PLACEHOLDER_IMG,
      status: item.status,
    };
  }
  
  const loadBorrowHistory = async () => {
    try {
      const response = await api.get("/borrow/list");
      const data = response.data.data.map(normalizeBookData);
      setBorrowedHistory(data);
    } catch (error) {
      console.error("Failed to load borrowed history:", error);
    }
  };

  useEffect(() => {
    loadBorrowHistory();
  }, []);

  // Filters / search
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesType   = typeFilter === "All" || r.type === typeFilter;
      const matchesSearch =
        !term ||
        [r.id, r.book, r.user, r.type]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term));
      return matchesType && matchesSearch;
    });
  }, [rows, q, typeFilter]);

  // Details modal
  const [detail, setDetail] = useState(null);
  const openDetail = (row) => setDetail(row);
  const closeDetail = () => setDetail(null);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <UserSidebar active="history" />

      <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">History</h1>

        {/* Card with clipped contents so table never escapes the border */}
        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Header: controls */}
          {/* <div className="p-3 md:p-4 border-b border-gray-200">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="inline-flex items-center gap-1 text-sm text-gray-600 flex-shrink-0">
                  <Filter size={16} /> Type:
                </span>
                <div className="flex items-center gap-2">
                  {["All", "Borrowed", "Returned", "Booked", "Donation"].map((t) => (
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
              </div>

              <div className="relative w-full md:w-80">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by book, user, id…"
                  className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>
          </div> */}

          {/* Mobile: card list (inside the same bordered card) */}
          {/* <ul className="md:hidden divide-y divide-gray-200 px-3 pb-3">
            {borrowedHistory.map((r, i) => (
              <li key={r.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">#{i + 1}</p>
                      <span className={badge(r.status)}>{r.status}</span>
                    </div>
                    <h3 className="mt-1 font-semibold text-gray-900">{r.book}</h3>
                    <p className="text-sm text-gray-600">{r.user}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDetail(r)}
                    className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <Eye size={14} /> View
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded border border-gray-200 p-2">
                    <p className="text-[11px] text-gray-500">Borrowed On</p>
                    <p className="text-sm text-gray-800">{r.borrowed || "—"}</p>
                  </div>
                  <div className="rounded border border-gray-200 p-2">
                    <p className="text-[11px] text-gray-500">Due Date</p>
                    <p className="text-sm text-gray-800">{r.return_date || "—"}</p>
                  </div>
                  <div className="rounded border border-gray-200 p-2 col-span-2">
                    <p className="text-[11px] text-gray-500">Returned On</p>
                    <p className="text-sm text-gray-800">{r.returned_at || "—"}</p>
                  </div>
                  {r.bookedOn && (
                    <div className="rounded border border-gray-200 p-2 col-span-2">
                      <p className="text-[11px] text-gray-500">Booked On</p>
                      <p className="text-sm text-gray-800">{r.bookedOn}</p>
                    </div>
                  )}
                  {r.donatedOn && (
                    <div className="rounded border border-gray-200 p-2 col-span-2">
                      <p className="text-[11px] text-gray-500">Donation Requested On</p>
                      <p className="text-sm text-gray-800">{r.donatedOn}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="py-6 text-center text-gray-500">No matching history found.</li>
            )}
          </ul> */}

          {/* Desktop: table (always inside card; card grows with rows) */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr className="text-left">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4 min-w-[220px]">Book</th>
                    {/* <th className="py-3 px-4 min-w-[160px]">User</th> */}
                    <th className="py-3 px-4 min-w-[130px]">Borrowed On</th>
                    <th className="py-3 px-4 min-w-[120px]">Due Date</th>
                    <th className="py-3 px-4 min-w-[130px]">Returned On</th>
                    <th className="py-3 px-4 min-w-[120px]">Type</th>
                    <th className="py-3 px-4 min-w-[140px] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {borrowedHistory.map((r, i) => (
                    <tr key={r.id} className="even:bg-gray-50">
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{r.book}</td>
                      {/* <td className="py-3 px-4 text-gray-700">{r.user}</td> */}
                      <td className="py-3 px-4 text-gray-700">{r.borrowed || "—"}</td>
                      <td className="py-3 px-4 text-gray-700">{r.return_date || "—"}</td>
                      <td className="py-3 px-4 text-gray-700">{r.returned_at || "—"}</td>
                      <td className="py-3 px-4"><span className={badge(r.status)}>{r.status}</span></td>
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
                  {borrowedHistory.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-gray-500">
                        No matching history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-lg mx-4 rounded-lg bg-white shadow-lg border border-gray-200 opacity-0 translate-y-2 animate-[popIn_.22s_ease-out_forwards]">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">History Details</h3>
                <button onClick={closeDetail} className="p-1 rounded hover:bg-gray-100" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="px-4 md:px-6 py-4 md:py-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><span className="text-gray-500">Record ID</span><span className="font-medium text-gray-800">{detail.id}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500">Book</span><span className="font-medium text-gray-800">{detail.book}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500">User</span><span className="font-medium text-gray-800">{detail.user}</span></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500">Type</span><span className={badge(detail.status)}>{detail.status}</span></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="rounded border border-gray-200 p-3"><p className="text-xs text-gray-500 mb-1">Borrowed On</p><p className="font-medium text-gray-800">{detail.borrowed || "—"}</p></div>
                  <div className="rounded border border-gray-200 p-3"><p className="text-xs text-gray-500 mb-1">Due Date</p><p className="font-medium text-gray-800">{detail.return_date || "—"}</p></div>
                  <div className="rounded border border-gray-200 p-3"><p className="text-xs text-gray-500 mb-1">Returned On</p><p className="font-medium text-gray-800">{detail.return_at || "—"}</p></div>
                </div>

                {(detail.bookedOn || detail.donatedOn) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detail.bookedOn && (
                      <div className="rounded border border-gray-200 p-3"><p className="text-xs text-gray-500 mb-1">Booked On</p><p className="font-medium text-gray-800">{detail.bookedOn}</p></div>
                    )}
                    {detail.donatedOn && (
                      <div className="rounded border border-gray-200 p-3"><p className="text-xs text-gray-500 mb-1">Donation Requested On</p><p className="font-medium text-gray-800">{detail.donatedOn}</p></div>
                    )}
                  </div>
                )}

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

      {/* small helpers */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        .scrollbar-none::-webkit-scrollbar{ display:none }
        .scrollbar-none{ -ms-overflow-style:none; scrollbar-width:none }
      `}</style>
    </div>
  );
}