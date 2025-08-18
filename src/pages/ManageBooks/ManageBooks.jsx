// src/pages/ManageBooks/ManageBooks.jsx
import { useEffect, useState } from "react";
import axios from 'axios';
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
  FileText,
  FileAudio2,
  CheckCircle2,
  Search,
} from "lucide-react";
import Sidebar from "../../components/DashboardSidebar/DashboardSidebar";

const API_BASE_URL = 'http://localhost:8080/api';
const PLACEHOLDER_IMG = "https://dummyimage.com/80x80/e5e7eb/9ca3af&text=📘";

function normalizeBook(book) {
  return {
    id: book.id,
    name: book.name || "—",
    author: book.author || "—",
    categoryName: book.category?.name || "—",
    categoryId: book.category?.id || null,
    totalCopies: book.total_copies || 0,
    availableCopies: book.available_copies || 0,
    updatedAt: book.updated_at || "",
    coverImageUrl: book.book_cover_url || PLACEHOLDER_IMG,
    pdfUrl: book.pdf_file_url || "",
    audioUrl: book.audio_file_url || "",
    shortDetails: book.short_details || "",
    isbn: book.isbn || "",
    publicationYear: book.publication_year || "",
    format: book.format || "",
  };
}

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        size: pagination.size,
      };
      
      let response;
      if (searchQuery) {
        response = await axios.get(`${API_BASE_URL}/book/search`, {
          params: { query: searchQuery, ...params }
        });
      } else {
        response = await axios.get(`${API_BASE_URL}/book/list`, { params });
      }
      
      setBooks(response.data.content.map(normalizeBook));
      setPagination(prev => ({
        ...prev,
        totalElements: response.data.totalElements
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Manage Books";
    fetchBooks();
  }, [pagination.page, pagination.size, searchQuery]);

  // Modal states
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);

  // Delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Form state
  const emptyForm = {
    name: "",
    author: "",
    categoryId: "",
    shortDetails: "",
    totalCopies: "",
    availableCopies: "",
    isbn: "",
    publicationYear: "",
    format: "",
    coverFile: null,
    coverUrl: "",
    imageLoading: false,
    pdfFile: null,
    pdfUrl: "",
    pdfLoading: false,
    audioFile: null,
    audioUrl: "",
    audioLoading: false,
  };
  const [form, setForm] = useState(emptyForm);

  const rowToForm = (book) => ({
    name: book.name || "",
    author: book.author || "",
    categoryId: book.categoryId || "",
    shortDetails: book.shortDetails || "",
    totalCopies: book.totalCopies?.toString() || "",
    availableCopies: book.availableCopies?.toString() || "",
    isbn: book.isbn || "",
    publicationYear: book.publicationYear?.toString() || "",
    format: book.format || "",
    coverFile: null,
    coverUrl: book.coverImageUrl || "",
    imageLoading: false,
    pdfFile: null,
    pdfUrl: book.pdfUrl || "",
    pdfLoading: false,
    audioFile: null,
    audioUrl: book.audioUrl || "",
    audioLoading: false,
  });

  const onOpenCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const onOpenEdit = (book) => {
    setMode("edit");
    setEditingId(book.id);
    setForm(rowToForm(book));
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e, kind) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    
    if (kind === "image") {
      setForm((f) => ({ ...f, imageLoading: true }));
      setTimeout(() => {
        setForm((f) => ({
          ...f,
          coverFile: file,
          coverUrl: url,
          imageLoading: false,
        }));
      }, 500);
    } else if (kind === "pdf") {
      setForm((f) => ({ ...f, pdfLoading: true }));
      setTimeout(() => {
        setForm((f) => ({
          ...f,
          pdfFile: file,
          pdfUrl: url,
          pdfLoading: false,
        }));
      }, 500);
    } else if (kind === "audio") {
      setForm((f) => ({ ...f, audioLoading: true }));
      setTimeout(() => {
        setForm((f) => ({
          ...f,
          audioFile: file,
          audioUrl: url,
          audioLoading: false,
        }));
      }, 500);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.author) {
      alert("Please enter book name and author");
      return;
    }

    setSaving(true);
    try {
      const bookData = {
        name: form.name,
        author: form.author,
        category_id: form.categoryId ? Number(form.categoryId) : null,
        short_details: form.shortDetails,
        total_copies: parseInt(form.totalCopies) || 0,
        available_copies: parseInt(form.availableCopies) || parseInt(form.totalCopies) || 0,
        isbn: form.isbn,
        publication_year: form.publicationYear ? parseInt(form.publicationYear) : null,
        format: form.format,
      };

      if (mode === "edit" && editingId) {
        if (form.coverFile || form.pdfFile || form.audioFile) {
          const formData = new FormData();
          formData.append('bookData', JSON.stringify(bookData));
          if (form.coverFile) formData.append('bookCover', form.coverFile);
          if (form.pdfFile) formData.append('pdfFile', form.pdfFile);
          if (form.audioFile) formData.append('audioFile', form.audioFile);

          await axios.post(`${API_BASE_URL}/book/create/file`, formData);
        }
        await axios.put(`${API_BASE_URL}/book/edit/${editingId}`, bookData);
      } else {
        if (form.coverFile || form.pdfFile || form.audioFile) {
          const formData = new FormData();
          formData.append('bookData', JSON.stringify(bookData));
          if (form.coverFile) formData.append('bookCover', form.coverFile);
          if (form.pdfFile) formData.append('pdfFile', form.pdfFile);
          if (form.audioFile) formData.append('audioFile', form.audioFile);

          await axios.post(`${API_BASE_URL}/book/create/file`, formData);
        } else {
          await axios.post(`${API_BASE_URL}/book/create`, bookData);
        }
      }

      await fetchBooks();
      setOpen(false);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await axios.delete(`${API_BASE_URL}/book/delete/${pendingDeleteId}`);
      await fetchBooks();
      setConfirmOpen(false);
    } catch (err) {
      alert(`Error deleting book: ${err.response?.data?.message || err.message}`);
    }
  };

  // Toast state
  const [savedToast, setSavedToast] = useState(false);

  // Pagination controls
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (size) => {
    setPagination(prev => ({ ...prev, size, page: 0 }));
  };

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
       <Sidebar activePage="manage-books" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Manage Books</h1>

        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            
            <button
              type="button"
              onClick={onOpenCreate}
              className="w-full md:w-auto inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <Plus size={16} /> Add Book
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="py-3 px-4 min-w-[200px]">Book</th>
                    <th className="py-3 px-4 min-w-[150px]">Author</th>
                    <th className="py-3 px-4 min-w-[120px]">Category</th>
                    <th className="py-3 px-4 min-w-[100px]">Total Copies</th>
                    <th className="py-3 px-4 min-w-[100px]">Available</th>
                    <th className="py-3 px-4 min-w-[150px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImageUrl}
                            alt={book.name}
                            className="h-10 w-10 rounded object-cover bg-gray-100 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = PLACEHOLDER_IMG;
                            }}
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{book.name}</p>
                            {book.isbn && (
                              <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{book.author}</td>
                      <td className="py-3 px-4 text-gray-700">{book.categoryName}</td>
                      <td className="py-3 px-4 text-gray-700">{book.totalCopies}</td>
                      <td className="py-3 px-4 text-gray-700">{book.availableCopies}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenEdit(book)}
                            className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => requestDelete(book.id)}
                            className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={pagination.size}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  {[5, 10, 20, 50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 0}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page + 1} of {Math.ceil(pagination.totalElements / pagination.size)}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={(pagination.page + 1) * pagination.size >= pagination.totalElements}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Add/Edit Modal */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background overlay */}
              <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)}/>
              
               {/* Modal */}
              <div className="relative z-10 bg-white rounded-lg shadow-xl sm:max-w-4xl sm:w-full p-6">
                <div className="bg-white px-6 py-4">
                  <div className="flex items-center gap-2">
                    {mode === "edit" ? (
                      <Pencil size={20} className="text-gray-700" />
                    ) : (
                      <Plus size={20} className="text-gray-700" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">
                      {mode === "edit" ? "Edit Book" : "Add New Book"}
                    </h3>
                  </div>
                </div>

                <div className="px-6 pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Book Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-1">Book Name*</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter book name"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        required
                      />
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Author*</label>
                      <input
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        placeholder="Enter author name"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        required
                      />
                    </div>

                    {/* Category ID */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Category ID</label>
                      <input
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        placeholder="Enter category ID"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        type="number"
                      />
                    </div>

                    {/* Total Copies */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Total Copies*</label>
                      <input
                        name="totalCopies"
                        value={form.totalCopies}
                        onChange={handleChange}
                        placeholder="Enter total copies"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        type="number"
                        min="1"
                        required
                      />
                    </div>

                    {/* Available Copies */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Available Copies</label>
                      <input
                        name="availableCopies"
                        value={form.availableCopies}
                        onChange={handleChange}
                        placeholder="Enter available copies"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        type="number"
                        min="0"
                      />
                    </div>

                    {/* ISBN */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">ISBN</label>
                      <input
                        name="isbn"
                        value={form.isbn}
                        onChange={handleChange}
                        placeholder="Enter ISBN"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    {/* Publication Year */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Publication Year</label>
                      <input
                        name="publicationYear"
                        value={form.publicationYear}
                        onChange={handleChange}
                        placeholder="Enter publication year"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        type="number"
                        min="0"
                      />
                    </div>

                    {/* Format */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Format</label>
                      <select
                        name="format"
                        value={form.format}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      >
                        <option value="">Select format</option>
                        <option value="HARD_COPY">Hard Copy</option>
                        <option value="E_BOOK">E-Book</option>
                        <option value="AUDIO">Audio</option>
                      </select>
                    </div>

                    {/* Cover Image */}
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-1">Cover Image</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFile(e, "image")}
                          className="w-full rounded border border-gray-300 px-3 py-2 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                        <div className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                          {form.imageLoading ? (
                            <Loader2 className="animate-spin text-gray-400" size={20} />
                          ) : form.coverUrl ? (
                            <img
                              src={form.coverUrl}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">Preview</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PDF File */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">PDF File</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(e) => handleFile(e, "pdf")}
                          className="w-full rounded border border-gray-300 px-3 py-2 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                        <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                          {form.pdfLoading ? (
                            <Loader2 className="animate-spin text-gray-400" size={20} />
                          ) : form.pdfUrl ? (
                            <FileText className="text-sky-600" size={24} />
                          ) : (
                            <span className="text-xs text-gray-400">PDF</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Audio File */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Audio File</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleFile(e, "audio")}
                          className="w-full rounded border border-gray-300 px-3 py-2 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                        <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                          {form.audioLoading ? (
                            <Loader2 className="animate-spin text-gray-400" size={20} />
                          ) : form.audioUrl ? (
                            <FileAudio2 className="text-sky-600" size={24} />
                          ) : (
                            <span className="text-xs text-gray-400">Audio</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-1">Description</label>
                      <textarea
                        name="shortDetails"
                        value={form.shortDetails}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Enter book description"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-md px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-70"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        {mode === "edit" ? "Updating..." : "Saving..."}
                      </span>
                    ) : mode === "edit" ? "Update Book" : "Add Book"}
                  </button>
                </div>
              </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"> */}
              <div className="fixed inset-0 bg-black/50" onClick={() => setConfirmOpen(false)}/>
                {/* <div className="absolute inset-0 bg-black/50"></div> */}
              {/* </div> */}
              
               {/* Modal */}
              <div className="relative z-10 bg-white rounded-lg shadow-xl sm:max-w-lg sm:w-full p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" size={24} />
                  </div>  
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Confirm Delete
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Are you sure you want to delete this book? This action cannot be undone.
                      </p>
                    </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(false)}
                    className="rounded-md px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="rounded-md px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500"
                  >
                    Delete Book
                  </button>
                </div>
              </div>
          </div>
        )}

        {/* Saved Toast */}
        {savedToast && (
          <div className="fixed bottom-6 right-6 z-[60] animate-[toastIn_.25s_ease-out]">
            <div className="flex items-start gap-3 rounded-xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-3">
              <CheckCircle2 className="text-green-600 mt-0.5" size={22} />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {mode === "edit" ? "Book Updated" : "Book Added"}
                </p>
                <p className="text-xs text-gray-600">
                  {mode === "edit" 
                    ? "Your changes have been saved successfully." 
                    : "The new book has been added to the library."}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}