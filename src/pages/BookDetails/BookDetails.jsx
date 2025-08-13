

/**
 * Per‑book reviews (examples).
 * Add or edit by ID (string or number). If an ID is missing, the page will show “No reviews yet”.
 * Vary counts (8–9, 3–4, 1, or none) per your instruction.
 */
const REVIEWS_DB = {
  "5": {
    heading: "Employee Review",
    overall: 4.7,
    total: 2713,
    breakdown: { 5: 82, 4: 12, 3: 4, 2: 1, 1: 1 },
    images: [
      "https://images.unsplash.com/photo-1544937950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Humayun Kabir", title: "An absolute masterpiece even in 2025", stars: 5, country: "Bangladesh", date: "July 2, 2025", verified: true, body: "Moves you from low-level to high-level architectural thinking. Evergreen patterns and trade-offs. Senior engineers loved it.", helpful: 56 },
      { id: "r2", name: "Lubaba Jahan", title: "Must Read", stars: 5, country: "Bangladesh", date: "May 26, 2025", verified: false, body: "Seminal work. Not a quick read, but worth the effort. Clear patterns and timeless insights.", helpful: 14 },
      { id: "r3", name: "Rashedul Zaman", title: "Great print, good quality cover", stars: 4, country: "Bangladesh", date: "April 22, 2025", verified: true, body: "Well packaged, arrived flat. Solid examples and commentary.", helpful: 9 },
      { id: "r4", name: "Tasmania Rosa .", title: "Practical patterns", stars: 5, country: "Bangladesh", date: "March 02, 2025", verified: true, body: "Explains trade-offs clearly. Helped our team refactor services.", helpful: 11 },
      { id: "r5", name: "Shuvo Rahman", title: "Dense but rewarding", stars: 4, country: "Bangladesh", date: "Feb 18, 2025", verified: false, body: "Take it slow. Examples are timeless.", helpful: 7 },
      { id: "r6", name: "Maruf Islam", title: "Go-to reference", stars: 5, country: "Bangladesh", date: "January 11, 2025", verified: true, body: "Keep it on my desk. Patterns map to modern stacks easily.", helpful: 18 },
      { id: "r7", name: "Sazal Uddin.", title: "Bridges theory and practice", stars: 5, country: "Bangladesh", date: "Nov 3, 2024", verified: true, body: "Rare book that improves code quality quickly.", helpful: 6 },
      { id: "r8", name: "Naimur Hasan", title: "A classic", stars: 5, country: "Bangladesh", date: "Sep 1, 2024", verified: false, body: "Still relevant, even with new frameworks.", helpful: 4 },
    ],
  },
  "2": {
    heading: "Employee Review",
    overall: 4.9,
    total: 1045,
    breakdown: { 5: 88, 4: 9, 3: 2, 2: 1, 1: 0 },
    images: [],
    reviews: [
      { id: "r9", name: "Nadia Zahan.", title: "Clear cloud strategy playbook", stars: 5, country: "Bangladesh", date: "May 10, 2024", verified: true, body: "Vendor-neutral frameworks. Helped us choose a service model and avoid re-architecture.", helpful: 22 },
      { id: "r10", name: "Vitul Shohan", title: "Strong patterns", stars: 4, country: "Bangladesh", date: "Aug 8, 2024", verified: false, body: "Good balance of business & tech requirements.", helpful: 5 },
      { id: "r11", name: "Purification Meril", title: "Great case studies", stars: 5, country: "Bangladesh", date: "Jan 20, 2025", verified: true, body: "Real migrations and pitfalls. Very useful.", helpful: 9 },
    ],
  },
  "1": {
    heading: "Employee Review",
    overall: 4.0,
    total: 1,
    breakdown: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
    images: [],
    reviews: [
      { id: "r12", name: "Alisha Rahman", title: "Inspiring for founders", stars: 5, country: "Bangladesh", date: "March 5, 2023", verified: true, body: "Concise, motivating, and practical.", helpful: 3 },
    ],
  },
  // No reviews entries for other ids on purpose (e.g., "8", "11")
};
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  ChevronDown,
  Users,
  PlayCircle,
  Download,
  BookOpen, // ⬅ added
} from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../../api";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [catalog, setCatalog] = useState([]);            // ← keep catalog to derive stats
  const [stats, setStats] = useState({ available: 0, upcoming: 0, unavailable: 0 });
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [loading, setLoading] = useState(true);

  // New states for reviews and rating counts
  const [reviews, setReviews] = useState([]);
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  // Normalize function (unchanged)
  const normalize = (b) => {
    if (!b) return null;
    return {
      id: b.id,
      title: b.name || "Untitled",
      authors: b.author || "Unknown",
      coverImage: b.book_cover_url || "",
      rating: b.average_rating || 0,
      ratingCount: b.rating_count || 0,
      reviews: null,
      available: b.available_copies, // we'll override later with real review count
      publisher: b.publisher || "—",
      publishDate: b.publish_date || "",
      category: b.category?.category_name || "General",
      summary: b.short_description || "",
      pdfLink: b.pdf_file_url || "#",
      wants: 0,
      status: b.status || "Available",
      image: b.book_cover_url || "",
    };
  };



  // Fetch book details and related books as before
  const fetchBookData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/book/retrieve/${id}`);
      const book = normalize(res.data.data || res.data);
      setBookData(book);

      const relatedRes = await api.get(`/book/related-books/${id}`);
      const related = (relatedRes.data.data || relatedRes.data)
        .filter((b) => String(b.id) !== String(id))
        .slice(0, 4)
        .map(normalize)
        .filter(Boolean);
      setRelatedBooks(related);

      // Fetch reviews for this book
      const reviewsRes = await api.get(`/review/${id}/list`);
      setReviews(reviewsRes.data.data || []);

      // Fetch rating star counts
      const ratingCountRes = await api.get(`/review/rating-star-count/${id}`);
      setRatingCounts(ratingCountRes.data || {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      });

    } catch (error) {
      console.error("Failed to fetch data:", error);
      setBookData(null);
      setRelatedBooks([]);
      setReviews([]);
      setRatingCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookData();
  }, [id]);

  // Helper to render stars based on average rating
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < (rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
      />
    ));

  // Helper to render rating count bars (example)
  const renderRatingBars = () => {
    const maxCount = Math.max(...Object.values(ratingCounts), 1); // avoid div by zero
    return (
      <div className="mt-4 space-y-1">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-2">
            <span className="w-8 text-sm font-semibold">{star} star</span>
            <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-4 bg-yellow-400"
                style={{ width: `${(ratingCounts[star] / maxCount) * 100}%` }}
              ></div>
            </div>
            <span className="w-6 text-right text-sm">{ratingCounts[star]}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-20">
        Loading book details...
      </div>
    );
  }

  const pack = REVIEWS_DB[String(bookData.id)] || null;
  const localReviewCount = pack?.reviews?.length ?? 0;
  const ratingCountDisplay = pack ? localReviewCount : 0;
  const reviewsTextDisplay = pack
    ? localReviewCount > 0
      ? `${localReviewCount} Reviews`
      : "No Reviews"
    : "No Reviews";
  // === END

  if (!bookData) {
    return (
      <div className="text-center text-red-600 py-20">
        Failed to load book details.
      </div>
    );
  }

  return (
    <div className="bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <div className="col-span-1 flex flex-col items-center">
          <img
            src={bookData.coverImage}
            alt={bookData.title}
            className="w-[250px] sm:w-[280px] h-auto object-cover rounded shadow-md"
          />
          {/* <button className="mt-4 w-full bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-200 flex justify-between items-center">
            WANT TO READ
            <ChevronDown className="w-4 h-4" />
          </button> */}

          {/* Employee Review summary panel (LEFT SIDE) [kept disabled to avoid duplication above] */}
          {false && (
            <div className="w-full mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {pack?.heading || "Employee Review"}
              </h3>

              {!pack || pack.total === 0 ? (
                <div className="text-sm text-gray-500">
                  No reviews yet for this book.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-semibold">
                      {pack.overall.toFixed(1)}{" "}
                      <span className="text-gray-500 text-base">out of 5</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {pack.total.toLocaleString()} global ratings
                    </div>

                    {/* Bars sections */}
                    <div className="mt-4 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="w-10 text-sm">{star} star</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded">
                            <div
                              className="h-2 bg-orange-500 rounded"
                              style={{ width: `${pack.breakdown[star] || 0}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-sm text-gray-600">
                            {(pack.breakdown[star] || 0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-700 mb-2">
                      Share your thoughts with other customers
                    </div>
                    <button className="w-full rounded-full border px-4 py-2 text-sm hover:bg-gray-50">
                      Write an employee review
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rating Bars */}
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {bookData.title}
          </h1>
          <p className="text-gray-600 mt-1 text-base">
            by <span className="text-sky-600 font-medium">{bookData.authors}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {bookData.publisher}, {bookData.publishDate} -{" "}
            <Link
              to="/all-genres"
              state={{ filter: { type: "category", value: bookData.category } }}
              className="text-sky-600 hover:underline"
            >
              {bookData.category}
            </Link>
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {renderStars(bookData.rating)}
            <span className="text-sm text-gray-600 font-semibold">
              {ratingCountDisplay} Ratings
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">
              {reviewsTextDisplay}
              {reviews.length} Reviews
            </span>
          </div>

          {/* Counts line (books icon) */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700">
            <span className="inline-flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="font-semibold">{bookData.available}</span>&nbsp;Available Copies
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="inline-flex items-center">
              <span className="font-semibold">{stats.upcoming}</span>&nbsp;Upcoming
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="inline-flex items-center">
              <span className="font-semibold">{stats.unavailable}</span>&nbsp;Not available
            </span>
          </div>

          {/* Summary */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-800">Summary of the Book</h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
              {showFullSummary
                ? bookData.summary
                : (bookData.summary || "").split(".")[0] +
                (bookData.summary ? "..." : "")}
              {(bookData.summary || "").split(".").length > 1 && (
                <button
                  onClick={() => setShowFullSummary(!showFullSummary)}
                  className={`ml-2 font-semibold hover:underline transition ${showFullSummary ? "text-gray-400" : "text-sky-600"
                    }`}
                >
                  {showFullSummary ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
          </div>

          {/* Availability + Audio + PDF */}
          {/* <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-green-600 font-medium text-sm inline-flex items-center">
                <span className="h-3 w-3 bg-green-500 rounded-full animate-ping mr-2"></span>
                Available
              </span>
              <div className="flex items-center mt-3 gap-2 text-sm">
                <PlayCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Audio Clip</span>
                <div className="w-32 h-1 bg-gray-200 rounded-full mx-2">
                  <div className="w-1/3 h-full bg-sky-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <a
              href={bookData.pdfLink}
              download
              className="flex items-center gap-1 text-sm text-gray-700 font-semibold border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
            >
              <Download className="w-4 h-4" />
              PDF
            </a>
          </div> */}

          {/* Availability + Audio + PDF (PDF right, aligned with Audio) */}
          <div className="mt-6">
            {/* Availability badge stays above */}
            <span className="text-green-600 font-medium text-sm inline-flex items-center">
              <span className="h-3 w-3 bg-green-500 rounded-full animate-ping mr-2"></span>
              Available
            </span>

            {/* Row: Audio (left) + PDF (right) */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {/* Audio section */}
              <div className="flex items-center gap-2 text-sm">
                <PlayCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Audio Clip</span>
                <div className="w-32 h-1 bg-gray-200 rounded-full mx-2 sm:mx-3">
                  <div className="w-1/3 h-full bg-sky-500 rounded-full"></div>
                </div>
              </div>

              {/* PDF button stays on the right side */}
              <a
                href={bookData.pdfLink}
                download
                className="ml-auto inline-flex items-center gap-1 text-sm text-gray-700 font-semibold border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
                PDF
              </a>
            </div>
          </div>


          <div className="mt-6">
            <button
              onClick={() => {
                navigate(`/fill-up-form/${bookData.id}`);
              }}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-md w-full sm:w-auto block text-center"
            >
              Borrowed
            </button>
          </div>
        </div>

        {/* === CENTERED Related Books (exactly 3) BEFORE reviews === */}
        <div className="col-span-3">
          <div className="mt-10">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Related Books</h3>
            <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
              {relatedBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out p-3 flex flex-col justify-between w-full"
                >
                  <img
                    src={book.coverImage || book.image}
                    alt={book.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <div className="mt-3">
                    <h4 className="font-semibold text-sm text-gray-800">{book.title}</h4>
                    <p className="text-xs text-gray-600">{book.authors || book.author}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < (book.rating ?? 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs font-medium mt-1 ${book.status === "Out Of Stock" ? "text-red-500" : "text-green-600"
                        }`}
                    >
                      {book.status || "Available"}
                    </p>
                  </div>
                  <div className="mt-3">
                    <Link
                      to={`/book/${book.id}`}
                      className="inline-block w-full text-center bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LEFT summary (bars panel) */}
        <div className="col-span-1">
          <div className="w-full mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{pack?.heading || "Employee Review"}</h3>

            {!pack || pack.total === 0 ? (
              <div className="text-sm text-gray-500">No reviews yet for this book.</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-lg font-semibold">
                    {pack.overall.toFixed(1)}{" "}
                    <span className="text-gray-500 text-base">out of 5</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {pack.total.toLocaleString()} global ratings
                  </div>

                  <div className="mt-4 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="w-10 text-sm">{star} star</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded">
                          <div
                            className="h-2 bg-orange-500 rounded"
                            style={{ width: `${pack.breakdown[star] || 0}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-sm text-gray-600">
                          {(pack.breakdown[star] || 0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="text-sm text-gray-700 mb-2">
                    Share your thoughts with other customers
                  </div>
                  <button className="w-full rounded-full border px-4 py-2 text-sm hover:bg-gray-50">
                    Write an employee review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT reviews (images + list) — YOUR DESIGN, with JSX fixes */}
        <div className="col-span-2">
          <div className="mt-10">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {pack?.heading || "Employee Review"}
            </h3>

            {!pack || pack.total === 0 ? (
              <div className="text-sm text-gray-500">No reviews yet for this book.</div>
            ) : (
              <>
                {pack.images?.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-semibold">Reviews with images</h4>
                      <button className="text-sm text-sky-600 hover:underline">See all photos</button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 pr-1">
                      {pack.images.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`review-${idx}`}
                          className="h-24 w-24 object-cover rounded-md flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {pack.reviews.map((r) => (
                    <article key={r.id} className="border-b pb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < r.stars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <h5 className="font-semibold text-gray-900">{r.title}</h5>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {r.name} — Reviewed in the {r.country} on {r.date}
                        {r.verified && <span className="ml-1 text-green-600">• Verified Purchase</span>}
                      </div>

                      <p className="text-sm text-gray-700 mt-3 leading-relaxed">{r.body}</p>

                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
                        <button className="rounded-full border px-3 py-1 hover:bg-gray-50">Helpful</button>
                        <button className="rounded-full border px-3 py-1 hover:bg-gray-50">Report</button>
                        <span className="text-gray-500">{r.helpful} people found this helpful</span>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



