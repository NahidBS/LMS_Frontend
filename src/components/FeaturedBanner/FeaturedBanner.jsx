import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import books from "../../data/sampleBooks";
import { Link } from "react-router-dom";
import api from "../../api";

const FeaturedBanner = () => {
  const [featured, setFeatured] = useState([]);
  const [current, setCurrent] = useState(0);

  // Fetch featured books from API
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const res = await api.get("/featured-books/list");
        const rawBooks = res.data; // array of {id, book: {...}}
        const normalizedBooks = rawBooks.map((item) => ({
          id: item.book.id,
          title: item.book.name || "Untitled",
          author: item.book.author || "Unknown",
          image: item.book.book_cover_url || "",
          rating: item.book.average_rating || 0,
          availability: item.book.available_copies > 0 ? "Available" : "Out Of Stock",
          description: item.book.short_description || "",
        }));
        setFeatured(normalizedBooks);
      } catch (err) {
        console.error("Error fetching featured books:", err);
      }
    };

    fetchFeaturedBooks();
  }, []);

  // Auto-slide every 5s
  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) {
    return null; // Don't render if no books
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % featured.length);
  };

  const currentBook = featured[current];
  const isOutOfStock = currentBook.availability
    .toLowerCase()
    .includes("out of stock");

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-8 relative flex justify-center items-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-center gap-12">
        <div className="shadow-lg rounded-md overflow-hidden w-64 flex-shrink-0">
          <img
            src={currentBook.image}
            alt={currentBook.title}
            className="w-full h-[350px] object-cover"
          />
        </div>

        <div className="text-center lg:text-left">
          <p className="text-sky-600 uppercase tracking-widest text-xs mb-2">
            by {currentBook.author}
          </p>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Featured Book</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{currentBook.title}</h3>
          <p className="text-sm text-gray-500 max-w-md mb-4">{currentBook.description}</p>

          <div className="flex items-center justify-center lg:justify-start mb-4">
            <span className="relative flex h-3 w-3 mr-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOutOfStock ? "bg-red-400" : "bg-green-400"} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}></span>
            </span>
            <span className={`font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
              {currentBook.availability}
            </span>
          </div>

          {/* THIS IS THE FIX: Link now uses the correct book ID */}
          <Link
            to={`/book/${currentBook.id}`}
            className="inline-block px-5 py-2 border border-sky-600 text-sky-600 rounded hover:bg-sky-600 hover:text-white transition-all text-sm"
          >
            VIEW DETAILS →
          </Link>
        </div>
      </div>

      <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-sky-50">
        <FaChevronLeft className="text-blue-600" />
      </button>
      <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-sky-50">
        <FaChevronRight className="text-blue-600" />
      </button>

      <div className="flex justify-center mt-10 gap-2 absolute bottom-4 left-1/2 transform -translate-x-1/2">
        {featured.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-blue-600" : "bg-gray-300"}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedBanner;