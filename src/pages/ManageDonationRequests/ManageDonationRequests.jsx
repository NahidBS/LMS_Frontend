// src/pages/AdminDonationRequest/AdminDonationRequest.jsx
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
  Edit,
  User,
  Mail,
  MapPin,
  Phone,
  BookOpen,
  Calendar
} from "lucide-react";
// import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar/AdminDashboardSidebar";
import api from "../../api";

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function fmtDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function AdminDonationRequest() {
  // ---------- State ----------
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch donation requests
  const loadDonationRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/donation-req/list");
      setDonationRequests(res.data?.content || []); // <- matches backend response shape
    } catch (err) {
      console.error(err);
      setError("Failed to load donation requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin - Donation Requests";
    loadDonationRequests();
  }, []);

  // Approve / Reject request
  const handleAction = async (id, action, notes = "") => {
    try {
      setUpdatingId(id);
      const endpoint =
        action === "approve"
          ? `/donation-req/approve/${id}?adminNotes=${encodeURIComponent(notes)}`
          : `/donation-req/reject/${id}?adminNotes=${encodeURIComponent(notes)}`;

      await api.put(endpoint);
      // Refresh list after update
      await loadDonationRequests();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} request`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Status badge
  const StatusBadge = ({ status }) => {
    let colors = { bg: "bg-gray-100", text: "text-gray-800", icon: <Clock size={14} /> };
    if (status === "APPROVED") colors = { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 size={14} /> };
    if (status === "REJECTED") colors = { bg: "bg-red-100", text: "text-red-800", icon: <XCircle size={14} /> };
    if (status === "PENDING") colors = { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Clock size={14} /> };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
        {colors.icon} {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminDashboardSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <HandHeart className="text-sky-600" /> Donation Requests
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-10 w-10 border-b-2 border-sky-600 rounded-full"></div>
          </div>
        ) : (
          <section className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">All Donation Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donationRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-gray-500">
                        No requests found
                      </td>
                    </tr>
                  ) : (
                    donationRequests.map((req) => (
                      <tr key={req.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">#{req.id}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium">{req.book_title}</div>
                          <div className="text-xs text-gray-500">{req.author}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium">{req.user.name}</div>
                          <div className="text-xs text-gray-500">{req.user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          {req.status === "PENDING" && (
                            <>
                              <button
                                disabled={updatingId === req.id}
                                onClick={() => handleAction(req.id, "approve")}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                {updatingId === req.id ? "..." : "Approve"}
                              </button>
                              <button
                                disabled={updatingId === req.id}
                                onClick={() => handleAction(req.id, "reject")}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                {updatingId === req.id ? "..." : "Reject"}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}