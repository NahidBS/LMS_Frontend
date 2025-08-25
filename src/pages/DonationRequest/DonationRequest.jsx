// src/pages/DonationRequest/DonationRequest.jsx
import { useEffect, useState } from "react";
import {
  HandHeart,
  Plus,
  BookOpen,
  User,
  Calendar,
  Hash,
  FileText,
} from "lucide-react";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import api from "../../api";

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

export default function DonationRequest() {
  useEffect(() => {
    document.title = "Donation Request";
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userId = storedUser.userId;

  // ---------- State ----------
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    bookTitle: "",
    author: "",
    isbn: "",
    description: "",
  });

  // Load user's donation requests
  const loadDonationRequests = async () => {
    if (!userId) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/donation-req/user/${userId}`);
      setDonationRequests(res.data || []);
    } catch (err) {
      console.error("Error loading donation requests:", err);
      setError("Failed to load donation requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonationRequests();
  }, [userId]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle create
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setLoading(true);

      const payload = { ...formData, userId };

      const res = await api.post("/donation-req/create", payload);

      if (res.status === 200 || res.status === 201) {
        await loadDonationRequests();
        setShowCreateForm(false);
        setFormData({ bookTitle: "", author: "", isbn: "", description: "" });
      }
    } catch (err) {
      console.error("Error creating donation request:", err);
      setError("Failed to submit donation request");
    } finally {
      setLoading(false);
    }
  };

  // Status badge
  const StatusBadge = ({ status }) => {
    const map = {
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          map[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <UserSidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <HandHeart className="text-sky-600" /> My Donation Requests
            </h1>
            <p className="text-sm text-gray-600">
              Track and manage the donation requests you submitted.
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500"
          >
            <Plus size={16} /> New Request
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <section className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Your Requests</h3>
              <span className="text-sm text-gray-500">{donationRequests.length} requests</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Book Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donationRequests.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No donation requests found.
                      </td>
                    </tr>
                  ) : (
                    donationRequests.map((req) => (
                      <tr key={req.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{req.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{req.book_title}</div>
                          {req.author && (
                            <div className="text-xs text-gray-500">by {req.author}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-400" />
                            {fmtDate(req.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={req.status} />
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

      {/* Modal Inline */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Create Donation Request</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Title *
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="bookTitle"
                    value={formData.bookTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter book title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter author"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter ISBN"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Condition or details about the book"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
