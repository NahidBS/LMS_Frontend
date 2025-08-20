import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api";
import Sidebar from "../../components/Sidebar/Sidebar";
import BookCard from "../../components/BookCard/BookCard"; // <-- import BookCard

const normalizeBook = (apiBook) => ({
  id: apiBook.id,
  category: apiBook.category?.name || "Unknown",
  title: apiBook.name || "Unknown",
  author: apiBook.author || "Unknown",
  shortDescription: apiBook.short_description || "Unknown",
  totalCopies: apiBook.total_copies || "",
  availableCopies: apiBook.available_copies || "",
  rating: apiBook.average_rating || 0,
  ratingCount: apiBook.rating_count || apiBook.total_ratings,
  coverImage: apiBook.book_cover_url, // 🔑 match BookCard's expected prop
  pdfUrl: apiBook.pdf_file_url,
  audioUrl: apiBook.audio_file_url,
  status: apiBook.status || "Available", // 🔑 add status so BookCard works
});

export default function AllGenres() {
  const navigate = useNavigate();
  const location = useLocation();

  const categoryFilter = location.state?.category || null;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: page - 1, size: perPage };
        let endpoint = "/book/list";
        if (categoryFilter) {
          endpoint = `/book/category/${categoryFilter}`;
        }

        const response = await api.get(endpoint, { params });

        if (response.data && Array.isArray(response.data.content)) {
          const normalizedBooks = response.data.content.map(normalizeBook);
          setBooks(normalizedBooks);
          setLastPage(response.data.total_pages || 1);
        } else {
          setError("Invalid response from server");
          setBooks([]);
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load books");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, categoryFilter]);

  const paginationButtons = [];
  for (let i = 1; i <= lastPage; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => setPage(i)}
        className={`px-3 py-1 rounded-md border ${
          i === page
            ? "bg-sky-600 text-white border-sky-600"
            : "bg-white text-sky-600 border-sky-600 hover:bg-sky-600 hover:text-white"
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">
          {categoryFilter ? `Category: ${categoryFilter}` : "All Genres"}
        </h1>

        {loading && <div className="text-gray-500">Loading books...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {!loading && !error && (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {books.length > 0 ? (
                books.map((book) => <BookCard key={book.id} book={book} />)
              ) : (
                <div className="text-sm text-gray-500">No books found.</div>
              )}
            </div>

            <div className="mt-8 flex justify-center items-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-md border bg-white text-sky-600 border-sky-600 hover:bg-sky-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {paginationButtons}

              <button
                disabled={page === lastPage}
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                className="px-3 py-1 rounded-md border bg-white text-sky-600 border-sky-600 hover:bg-sky-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
