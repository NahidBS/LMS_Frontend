// Home.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Section from "../../components/Section/Section";
import books from "../../data/sampleBooks";
import Navbar from "../../components/Navbar/Navbar";
import BookSlider from "../../components/BookSlider/BookSlider";
import FeaturedBanner from "../../components/FeaturedBanner/FeaturedBanner";
import NewBookCollections from "../../components/NewBookCollections/NewBookCollections";
import { Link } from "react-router-dom";
import { Star, Filter, X } from "lucide-react";
import api from "../../api"; 

const transformBook = (book, index) => ({
  id: book.id || index,
  title: book.title || book.name ||  "Untitled",
  author: book.author || book.authors || "Unknown Author",
  image: book.book_cover_url || book.coverImage ||
    "https://upload.wikimedia.org/wikipedia/en/7/78/Patterns_cover.jpg",
  rating: book.average_rating || book.rating || 0,
  ratingCount: book.ratingCount || book.reviewCount || 0,
  summary: book.summary || book.shortDetails ||"",
  publisher: book.publisher || "",
  publishDate: book.publishDate || "",
  // category: book.category || "",
  category: book.category?.category_name || book.category || "Uncategorized", // ✅ updated
  pdfLink: book.pdf_file_url || book.pdfLink || "",
  audioLink: book.audio_file_url || "",
});

export default function Home() {

  const navigate = useNavigate();
  const location = useLocation();
  const categoryFilter = location.state?.category || null;


  const [filter, setFilter] = useState(null);
  const [openFilters, setOpenFilters] = useState(false); // mobile sidebar
  const [books, setBooks] = useState({ recommended: [], popular: [] });
  const [loading, setLoading] = useState(true);

  // const filtered = useMemo(() => {
  //   if (!filter) return [];

  //   if (filter.type === "all") return allBooks;

  //   if (filter.type === "category") {
  //     return allBooks.filter(
  //       (b) =>
  //         (b.category || "").toLowerCase() ===
  //         (filter.value || "").toLowerCase()
  //     );
  //   }

  //   if (filter.type === "subcategory") {
  //     return allBooks.filter(
  //       (b) =>
  //         (b.category || "").toLowerCase() ===
  //         (filter.parent || "").toLowerCase()
  //     );
  //   }

  //   return allBooks;
  // }, [filter, allBooks]);
  const allBooks = useMemo(
    () => [...(books?.recommended || []), ...(books?.popular || [])],
    [books]
  );
  const fetchBooks = async () => {
    setLoading(true);
      try {
        const [popularRes , recommendedRes] = await Promise.all([
          api.get("/book/popular-books"),
          api.get("/book/recommended-books"),
        ]);

        // const recommendedBooks = (recommendedRes.data.data || []).map(transformBook);
        // const popularBooks = (popularRes.data.data || []).map(transformBook);
        const recommendedBooks = (recommendedRes.data|| []).map(transformBook);
        const popularBooks = (popularRes.data || []).map(transformBook);

        setBooks({
          recommended: recommendedBooks,
          popular: popularBooks,
        });
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };

  
    // Fetch all books initially
  useEffect(() => {
    console.log("Fetching book data for id:");
    fetchBooks();
  }, []);

  // Fetch books by category when a filter is selected
  useEffect(() => {
    if (!filter || filter.type === "all") return;

    const fetchFilteredBooks = async () => {
      setLoading(true);
      try {
        const endpoint =
          filter.type === "category"
            ? `/book/category/${filter.value}`
            : "/book/list";

        const res = await api.get(endpoint);
        const fetchedBooks = (res.data?.content || []).map(transformBook);

        setBooks({ recommended: [], popular: fetchedBooks });
      } catch (err) {
        console.error("Failed to fetch filtered books:", err);
        setBooks({ recommended: [], popular: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredBooks();
  }, [filter]);


 

  const renderStars = (rating = 0) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < (rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
      />
    ));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading books...</p>
      </div>
    );
  }

   const filtered = allBooks; // After fetching by category, `popular` holds the filtered books


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content (centered container) */}
      <div className="mx-auto max-w-7xl w-full flex flex-col md:flex-row px-4 sm:px-6 lg:px-8 py-4 gap-4">
        {/* Desktop/Tablet Sidebar */}
        <aside className="hidden md:block w-full md:w-64 lg:w-72 flex-none md:sticky md:top-20">
          <Sidebar onSelect={setFilter} />
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Filters Button */}
          <div className="md:hidden mb-3">
            <button
              type="button"
              onClick={() => setOpenFilters(true)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            {!filter ? (
              <>
                <Section title="Recommended" books={books.recommended} />
                <Section title="Popular" books={books.popular} />
                <NewBookCollections />
                {/* <BookSlider /> */}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Showing results for:{" "}
                    <span className="text-sky-600">
                      {filter.type === "subcategory"
                        ? `${filter.parent} → ${filter.value}`
                        : filter.value || "All"}
                    </span>
                  </h2>
                  <button
                    onClick={() => setFilter(null)}
                    className="text-sm text-gray-600 hover:text-sky-600"
                  >
                    Clear
                  </button>
                </div>

                {/* Filtered grid */}
                {filtered.length === 0 ? (
                  <div className="text-gray-500 text-sm">No books found.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out p-3 flex flex-col"
                      >
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <div className="mt-3 flex-1">
                          <h4 className="font-semibold text-sm text-gray-800">
                            {b.title}
                          </h4>
                          <p className="text-xs text-gray-600">{b.author}</p>
                          <div className="flex items-center mt-1">
                            {renderStars(b.rating)}
                            <span className="ml-2 text-xs text-gray-500">
                              {b.ratingCount?.toLocaleString?.() || 0}
                            </span>
                          </div>
                          <p
                            className={`text-xs font-medium mt-2 ${(b.title || "")
                                .toLowerCase()
                                .includes("empire")
                                ? "text-red-500"
                                : "text-green-600"
                              }`}
                          >
                            {(b.title || "").toLowerCase().includes("empire")
                              ? "Out Of Stock"
                              : "Available"}
                          </p>
                        </div>
                        <div className="mt-3">
                          <Link
                            to={`/book/${b.id}`}
                            className="inline-block w-full text-center bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Center the banner to match the content width */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FeaturedBanner />
      </div>

      {/* Mobile Sidebar Drawer */}
      {openFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setOpenFilters(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-800">Filters</h3>
              <button
                aria-label="Close filters"
                onClick={() => setOpenFilters(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <Sidebar
              onSelect={(v) => {
                setFilter(v);
                setOpenFilters(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

