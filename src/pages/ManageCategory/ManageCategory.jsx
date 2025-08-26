// ManageCategory.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar/AdminDashboardSidebar";

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
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Add Category Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // change this if you want more rows per page

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
        const msg =
          err.response?.data?.message ||
          "Failed to delete category. Please try again.";
        alert(msg);
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
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
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id ? response.data : cat
          )
        );
        setEditingCategory(null);
        alert("Category updated successfully!");
      }
    } catch (err) {
      console.error("Error updating category:", err);
      alert(
        err.response?.data?.message ||
          "Failed to update category. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const response = await api.post("/category/create", newCategory);
      if (response.data) {
        setCategories([...categories, response.data]);
        setIsAddModalOpen(false);
        setNewCategory({ name: "", description: "" });
        alert("Category created successfully!");
      }
    } catch (err) {
      console.error("Error creating category:", err);
      alert(err.response?.data?.message || "Failed to create category.");
    } finally {
      setIsAdding(false);
    }
  };

  // ✅ Pagination calculations
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = categories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminDashboardSidebar />

      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Manage Category
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <Plus size={16} /> Add Category
          </button>
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
                    <th className="py-3 px-4 min-w-[160px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((category, idx) => (
                      <tr
                        key={category.id}
                        className="border-b last:border-0 even:bg-gray-50 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-700">
                          {startIndex + idx + 1}
                        </td>
                        <td className="py-3 px-4 text-gray-800 font-medium">
                          {category.name}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {category.description || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {category.book_count || category.bookCount || 0}
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
                      <td
                        colSpan="7"
                        className="py-4 text-center text-gray-500"
                      >
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-4 py-3 border-t">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
