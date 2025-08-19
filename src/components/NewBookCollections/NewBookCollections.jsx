// NewBookCollections.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import api from "../../api";

export default function NewBookCollections() {
  const [visibleCount, setVisibleCount] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/book/new-collection");
        const rawBooks = response.data || response.data.data || [];

        const normalizedBooks = rawBooks.map((book) => ({
          id: book.id,
          title: book.name || book.title || "Untitled",
          author: book.authors || book.author || "Unknown",
          coverImage: book.book_cover_url || book.image || "",
          rating: book.average_rating || book.rating || 0,
          status: book.available_copies > 0 ? "Available" : "Out Of Stock",
        }));

        setBooks(normalizedBooks);
      } catch (err) {
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const showMore = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(6, books.length));
      setIsTransitioning(false);
    }, 150);
  };

  const showLess = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setVisibleCount(3);
      setIsTransitioning(false);
    }, 150);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const firstRow = books.slice(0, 3);
  const secondRow = books.slice(3, 6);

  const Card = ({ book }) => (
    <div
      onClick={() =>
        navigate(`/book/${book.id}`, {
          state: {
            fromSlider: {
              ...book,
              name: book.title,
              coverImage: book.coverImage,
            },
          },
        })
      }
      className="cursor-pointer bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden hover:-translate-y-1 duration-200"
    >
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
      />
      <div className="border-t border-gray-200 p-3">
        <h3 className="font-semibold text-sm line-clamp-2 hover:text-sky-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500">{book.author}</p>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 transition-colors ${
                i < Math.round(book.rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p
          className={`text-xs font-semibold mt-1 transition-colors ${
            book.status === "Available" ? "text-green-600" : "text-red-500"
          }`}
        >
          {book.status}
        </p>
      </div>
    </div>
  );

  return (
    <section className="mt-12">
      <div className="rounded-lg border border-gray-300 overflow-hidden bg-white transition-all duration-300">
        <div className="px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">NEW BOOK COLLECTIONS</h2>
          <div className="flex items-center gap-2">
            {visibleCount < Math.min(6, books.length) && (
              <button
                onClick={showMore}
                disabled={isTransitioning}
                className="flex items-center gap-1 text-sky-600 hover:text-sky-800 transition-colors disabled:opacity-50"
              >
                See More <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {visibleCount > 3 && (
              <button
                onClick={showLess}
                disabled={isTransitioning}
                className="flex items-center gap-1 text-sky-600 hover:text-sky-800 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Show Less
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {firstRow.map((book) => (
                <Card key={book.id} book={book} />
              ))}
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              visibleCount > 3 ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-3 sm:p-4 pt-0">
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {secondRow.map((book) => (
                  <Card key={book.id} book={book} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}