// src/pages/AdminDonationRequest/AdminDonationRequest.jsx
import { useEffect, useState } from "react";
import {
  HandHeart,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar/AdminDashboardSidebar";
import api from "../../api";

function StatusBadge({ status }) {
  let colors = { bg: "bg-gray-100", text: "text-gray-800", icon: <Clock size={14} /> };
  if (status === "APPROVED") colors = { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle2 size={14} /> };
  if (status === "REJECTED") colors = { bg: "bg-red-100", text: "text-red-800", icon: <XCircle size={14} /> };
  if (status === "PENDING") colors = { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Clock size={14} /> };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {colors.icon} {status}
    </span>
  );
}

export default function AdminDonationRequest() {
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const loadDonationRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/donation-req/list");
      setDonationRequests(res.data?.content || []);
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

  const handleAction = async (id, action) => {
    try {
      setUpdatingId(id);
      const endpoint =
        action === "approve"
          ? `/donation-req/approve/${id}`
          : `/donation-req/reject/${id}`;
      await api.put(endpoint);
      await loadDonationRequests();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} request`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Split requests
  const pendingRequests = donationRequests.filter(r => r.status === "PENDING");
  const processedRequests = donationRequests.filter(r => r.status !== "PENDING");

  const renderTable = (title, requests, showActions = false) => (
    <section className="bg-white rounded-lg shadow border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              {showActions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 5 : 4} className="text-center py-6 text-gray-500">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map(req => (
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
                  {showActions && (
                    <td className="px-6 py-4 flex gap-2">
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
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminDashboardSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <HandHeart className="text-sky-600" /> Donation Requests
        </h1>

        {error && <div className="text-red-600">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-10 w-10 border-b-2 border-sky-600 rounded-full"></div>
          </div>
        ) : (
          <>
            {renderTable("Pending Requests", pendingRequests, true)}
            {renderTable("Approved & Rejected Requests", processedRequests, false)}
          </>
        )}
      </main>
    </div>
  );
}
