// src/pages/AddBook/AddBook.jsx
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, X } from "lucide-react";
import api from "../../api";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar/AdminDashboardSidebar";

export default function AddBook() {
  const [form, setForm] = useState({
    name: "",
    author: "",
    about: "",
    short_details: "",
    isbn: "",
    format: "HARD_COPY",
    categoryId: "",
    total_copies: "",
    available_copies: "",
    publication_year: "",
    book_cover_url: "",
    pdf_file_url: "",
    audio_file_url: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/list");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/book/create", {
        ...form,
        total_copies: parseInt(form.total_copies),
        available_copies: parseInt(form.available_copies),
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      });
      setMessage({ type: "success", text: "Book added successfully ✅" });
      setForm({
        name: "",
        author: "",
        about: "",
        short_details: "",
        isbn: "",
        format: "HARD_COPY",
        categoryId: "",
        total_copies: "",
        available_copies: "",
        publication_year: "",
        book_cover_url: "",
        pdf_file_url: "",
        audio_file_url: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add book ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <AdminDashboardSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Add New Book</h1>

        {message && (
          <div
            className={`p-3 mb-4 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 /> : <X />}
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Book Name"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            placeholder="ISBN"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="publication_year"
            value={form.publication_year}
            onChange={handleChange}
            placeholder="Publication Year"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="total_copies"
            value={form.total_copies}
            onChange={handleChange}
            placeholder="Total Copies"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="available_copies"
            value={form.available_copies}
            onChange={handleChange}
            placeholder="Available Copies"
            className="border p-2 rounded"
          />
          <textarea
            name="short_details"
            value={form.short_details}
            onChange={handleChange}
            placeholder="Short Details"
            className="border p-2 rounded md:col-span-2"
          />
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="About"
            className="border p-2 rounded md:col-span-2"
          />

          {/* Category Dropdown */}
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="border p-2 rounded md:col-span-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Links */}
          <input
            type="text"
            name="book_cover_url"
            value={form.book_cover_url}
            onChange={handleChange}
            placeholder="Cover Image Link"
            className="border p-2 rounded md:col-span-2"
          />
          <input
            type="text"
            name="pdf_file_url"
            value={form.pdf_file_url}
            onChange={handleChange}
            placeholder="PDF File Link"
            className="border p-2 rounded md:col-span-2"
          />
          <input
            type="text"
            name="audio_file_url"
            value={form.audio_file_url}
            onChange={handleChange}
            placeholder="Audio File Link"
            className="border p-2 rounded md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 md:col-span-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
