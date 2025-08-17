// ManageCategory.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Sidebar from "../../components/DashboardSidebar/DashboardSidebar";

function StatusPill({ status }) {
  const on = status?.toLowerCase() === "enable";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        on ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function ManageCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Manage Category";
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/category/list");

      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (err) {
      setError("Failed to load categories. Please try again later.");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/category/delete/${categoryId}`);
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      description: category.description || ""
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.put(
        `category/edit/${editingCategory.id}`,
        editFormData
      );
      
      if (response.data) {
        // Update the category in the list
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? response.data : cat
        ));
        setEditingCategory(null);
        alert("Category updated successfully!");
      }
    } catch (err) {
      console.error("Error updating category:", err);
      alert(err.response?.data?.message || "Failed to update category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar activePage="manage-category" />

      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Manage Category
          </h1>
          <Link
            to="/admin/add-category"
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <Plus size={16} /> Add Category
          </Link>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-600"></div>
            <p className="mt-2">Loading categories...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded shadow">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-3 px-4 min-w-[80px]">#</th>
                    <th className="py-3 px-4 min-w-[220px]">Category</th>
                    <th className="py-3 px-4 min-w-[220px]">Description</th>
                    <th className="py-3 px-4 min-w-[120px]">Books</th>
                    <th className="py-3 px-4 min-w-[140px]">Created At</th>
                    <th className="py-3 px-4 min-w-[140px]">Status</th>
                    <th className="py-3 px-4 min-w-[160px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category, idx) => (
                      <tr
                        key={category.id}
                        className="border-b last:border-0 even:bg-gray-50 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-700">{idx + 1}</td>
                        <td className="py-3 px-4 text-gray-800 font-medium">
                          {category.name}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {category.description || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {category.book_count || category.bookCount || 0}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(category.created_at || category.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <StatusPill status="Enable" />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(category)}
                              className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-4 text-center text-gray-500">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 text-xs text-gray-500 md:hidden border-t">
              Tip: swipe horizontally to see all columns.
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95">
           <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Edit Category</h2>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      "Update Category"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}