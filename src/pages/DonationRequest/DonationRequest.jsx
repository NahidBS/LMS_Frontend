// src/pages/DonationRequest/DonationRequest.jsx
import { useEffect, useMemo, useState } from "react";
import {
  HandHeart,
  Clock,
  Plus,
  BookOpen,
  User,
  Phone,
  MapPin,
  Edit3,
  Calendar
} from "lucide-react";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import api from "../../api";

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export default function DonationRequest() {
  useEffect(() => {
    document.title = "Donation Request";
  }, []);

  // ---------- Data ----------
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state for creating donation request
  const [formData, setFormData] = useState({
    bookTitle: "",
    authorName: "",
    reason: "",
    brainStationId: "",
    phoneNumber: "",
    address: ""
  });

  // Load donation requests from API
  const loadDonationRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all donation requests for the user
      const response = await api.get("/Donations/user");
      
      if (response.data && Array.isArray(response.data)) {
        setDonationRequests(response.data);
      } else {
        setDonationRequests([]);
      }
    } catch (err) {
      console.error("Error loading donation requests:", err);
      setError("Failed to load donation requests");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDonationRequests();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/Donations", formData);
      
      if (response.status === 200 || response.status === 201) {
        // Reload the donation requests to include the new one
        await loadDonationRequests();
        setShowCreateForm(false);
        setFormData({
          bookTitle: "",
          authorName: "",
          reason: "",
          brainStationId: "",
          phoneNumber: "",
          address: ""
        });
        
        // Show success message
        setError(null);
      }
    } catch (err) {
      console.error("Error creating donation request:", err);
      setError("Failed to submit donation request");
    } finally {
      setLoading(false);
    }
  };

  // Create Donation Request Form
  const CreateDonationForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Create Donation Request</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Enter book title"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Enter author name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Donation *</label>
            <div className="relative">
              <Edit3 className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Why are you donating this book?"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">BrainStation ID</label>
            <input
              type="text"
              name="brainStationId"
              value={formData.brainStationId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Enter your BrainStation ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Enter your address"
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
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";
    
    if (status === "Approved") {
      bgColor = "bg-green-100";
      textColor = "text-green-800";
    } else if (status === "Rejected") {
      bgColor = "bg-red-100";
      textColor = "text-red-800";
    } else if (status === "Pending") {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
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
              <HandHeart className="text-sky-600" /> Donation Request
            </h1>
            <p className="text-sm text-gray-600">
              Manage your book donation requests and track their status.
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
              <h3 className="text-lg font-semibold text-gray-800">Donation Requests</h3>
              <span className="text-sm text-gray-500">{donationRequests.length} requests</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donationRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No donation requests found.
                      </td>
                    </tr>
                  ) : (
                    donationRequests.map((request) => (
                      <tr key={request.donationRequestId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{request.donationRequestId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{request.bookTitle}</div>
                          {request.authorName && (
                            <div className="text-xs text-gray-500">by {request.authorName}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-400" />
                            {fmtDate(request.requestDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.processedDate ? (
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1 text-gray-400" />
                              {fmtDate(request.processedDate)}
                            </div>
                          ) : (
                            "—"
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

      {/* Create Donation Form Modal */}
      {showCreateForm && <CreateDonationForm />}

      {/* Styles: no-scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}