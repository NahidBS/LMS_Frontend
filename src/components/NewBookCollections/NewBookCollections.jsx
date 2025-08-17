


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import api from "../../api";
const books = [
  {
    id: 1,
    title: "Fundamentals of Software Testing, 2nd Edition",
    author: " by Bernard Homès",
    image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643480/d9_wxocuv.jpg",
    rating: 4,
    status: "Available",
    category: "Development"
  },
  {
    id: 2,
    title: "The Coming Wave: AI, Power, and Our Future",
    author: " Mustafa Suleyman",
    image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643606/ai5_ua61lt.jpg",
    rating: 4.8,
    status: "Available",
  },
];

export default function NewBookCollections() {
  // Start with first row (3 cards). "See More" reveals the second row (next 3).
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/book/new-collection");
        const rawBooks = response.data || response.data.data || [];

        // Normalize data
        const normalizedBooks = rawBooks.map(book => ({
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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  
  const showMore = () => setVisibleCount((prev) => Math.min(6, books.length));
  const showLess = () => setVisibleCount(3);

  // First 3 cards
  const firstRow = books.slice(0, 3);
  // Next 3 cards (revealed on See More)
  const secondRow = books.slice(3, 6);

  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">NEW BOOK COLLECTIONS</h2>
        <div className="flex items-center gap-2">
          {visibleCount < Math.min(6, books.length) && (
            <button
              onClick={showMore}
              className="flex items-center gap-1 text-sky-600 hover:text-sky-800"
            >
              See More <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {visibleCount > 3 && (
            <button
              onClick={showLess}
              className="flex items-center gap-1 text-sky-600 hover:text-sky-800"
            >
              <ChevronLeft className="w-4 h-4" /> Show Less
            </button>
          )}
        </div>
      </div>

      {/* Row 1: 1 card (mobile), 2 cards (tablet), 3 cards (desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-6">
        {firstRow.map((book) => (
          <div
            key={book.id}
            onClick={() =>
              navigate(`/book/${book.id}`, {
                // state: { fromSlider: book }, // ✅ pass the actual card data
                state: { 
                  fromSlider: { 
                    ...book, 
                     name: book.title,        // BookDetails expects `name`
                     coverImage: book.image   // BookDetails expects `coverImage`
                  }
                },
              })
            }
            className="cursor-pointer bg-white p-3 rounded shadow hover:shadow-md transition-all"
          >
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="font-semibold text-sm mt-2 line-clamp-2 hover:text-sky-600">
              {book.title}
            </h3>
            <p className="text-xs text-gray-500">{book.author}</p>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < book.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <p
              className={`text-xs font-semibold mt-1 ${book.status === "Available" ? "text-green-500" : "text-red-500"
                }`}
            >
              {book.status}
            </p>
          </div>
        ))}
      </div>

      {/* Row 2: only appears after "See More" (same layout & gaps) */}
      {visibleCount > 3 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-6">
          {secondRow.map((book) => (
            <div
              key={book.id}
              onClick={() =>
                navigate(`/book/${book.id}`, {
                  // state: { fromSlider: book },
                  state: { 
                    fromSlider: { 
                      ...book, 
                      name: book.title,
                      coverImage: book.image 
                    } 
                  },
                })
              }
              className="cursor-pointer bg-white p-3 rounded shadow hover:shadow-md transition-all"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="font-semibold text-sm mt-2 line-clamp-2 hover:text-sky-600">
                {book.title}
              </h3>
              <p className="text-xs text-gray-500">{book.author}</p>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < book.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs font-semibold mt-1 ${
                  book.status === "Available" ? "text-green-500" : "text-red-500"
                }`}
              >
                {book.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
