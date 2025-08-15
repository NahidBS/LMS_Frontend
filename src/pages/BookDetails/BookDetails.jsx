// BookDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  Star,
  ChevronDown,
  Users,
  PlayCircle,
  Download,
  BookOpen
} from "lucide-react";
import api from "../../api";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookData, setBookData] = useState(null);
  const [ratingsData, setRatingsData] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availabilityStats, setAvailabilityStats] = useState({
    available: 0,
    upcoming: 0,
    unavailable: 0
  });
  const [isAvailable, setIsAvailable] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const normalize = (b) => {
    if (!b) return null;
    return {
      id: b.id,
      title: b.name || "Untitled",
      authors: b.author || b.authors || "Unknown",
      coverImage: b.book_cover_url || b.coverImage || "",
      rating: b.average_rating || b.rating || 0,
      ratingCount: b.review_count || b.totalRatings || 0,
      reviews: b.reviews || null,
      publisher: b.publisher || "Nahid" || "—",
      publishDate: b.publication_year || b.created_at || "",
      category: b.category?.name || b.categoryName || "General",
      summary: b.about || b.short_details || "",
      wants: 0,
      image: b.book_cover_url || b.coverImage || "",
      pdfLink: b.pdf_file_url || b.pdfLink || "#",
      audioLink: b.audio_file_url || "",
      status: b.is_available ? "Available" : "Out Of Stock",
      availableCopies: b.available_copies || 0,
      totalCopies: b.total_copies || 0
    };
  };

  const checkAvailability = async () => {
    try {
      const response = await api.get(`/book/${id}/is_available`);
      setIsAvailable(response.data);
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  const updateAvailability = async (newAvailableCopies) => {
    setUpdatingAvailability(true);
    try {
      await api.patch(`/book/${id}/availability`, null, {
        params: { availableCopies: newAvailableCopies }
      });
      await fetchBookData(); // Refresh book data
      await checkAvailability(); // Refresh availability status
    } catch (error) {
      console.error("Error updating availability:", error);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const calculateAvailabilityStats = (books) => {
    return books.reduce((stats, book) => {
      const normalizedBook = normalize(book);
      if (normalizedBook.is_available) {
        stats.available++;
      } else if (normalizedBook.status.toLowerCase().includes('upcoming')) {
        stats.upcoming++;
      } else {
        stats.unavailable++;
      }
      return stats;
    }, { available: 0, upcoming: 0, unavailable: 0 });
  };

  const fetchBookData = async () => {
    setLoading(true);
    try {
      // Try to get book data from location state first
      const sliderBook = location.state?.fromSlider;
      if (sliderBook && String(sliderBook.id) === String(id)) {
        setBookData(normalize(sliderBook));
      } else {
        // Fetch main book detail by id
        const res = await api.get(`/book/retrieve/${id}`);
        setBookData(normalize(res.data));
      }

      // Check availability
      await checkAvailability();

      // Fetch reviews
      try {
        const reviewsRes = await api.get(`/review/list/book/${id}`);
        setRatingsData(reviewsRes.data);
      } catch (error) {
        console.log("Reviews not available:", error);
      }

      // Fetch recommended books
      try {
        const relatedRes = await api.get(`/book/recommended-books`);
        const related = relatedRes.data
          .filter((b) => String(b.id) !== String(id))
          .slice(0, 4)
          .map(normalize);
        setRelatedBooks(related);
      } catch (error) {
        console.log("Recommended books not available:", error);
      }

      // Fetch availability stats
      try {
        const statsRes = await api.get('/book/list');
        const stats = calculateAvailabilityStats(statsRes.data);
        setAvailabilityStats(stats);
      } catch (error) {
        console.log("Availability stats not available:", error);
      }

    } catch (error) {
      console.error("Failed to fetch book data:", error);
      setBookData(null);
      setRelatedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // const handleBorrow = async () => {
  //   if (!isAvailable) {
  //     alert("This book is currently not available for borrowing");
  //     return;
  //   }

  //   if (bookData.availableCopies <= 0) {
  //     alert("No available copies left");
  //     return;
  //   }

  //   try {
  //     // Update availability (reduce by 1)
  //     await updateAvailability(bookData.availableCopies - 1);

  //     // Add to local storage
  //     const stored = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
  //     const alreadyExists = stored.find((b) => b.id === bookData.id);

  //     if (!alreadyExists) {
  //       stored.push({ ...bookData, quantity: 1 });
  //       localStorage.setItem("borrowedBooks", JSON.stringify(stored));
  //     }

  //     // navigate(`/fill-up-form/${bookData.id}`);
  //     navigate(`/fill-up-form/${bookData.id}`, {
  //     state: {
  //       bookingData: bookingResponse.data,
  //       borrowData: borrowResponse.data
  //     }
  //   });
  //   } catch (error) {
  //     console.error("Error processing borrow:", error);
  //     alert("Failed to process borrow request");
  //   }
  // };

  const handleBorrow = async () => {
  if (!isAvailable) {
    alert("This book is currently not available for borrowing");
    return;
  }

  if (bookData.availableCopies <= 0) {
    alert("No available copies left");
    return;
  }

  try {
    // Update availability (reduce by 1)
    await updateAvailability(bookData.availableCopies - 1);

    // Add to local storage
    const stored = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    const alreadyExists = stored.find((b) => b.id === bookData.id);

    if (!alreadyExists) {
      stored.push({ ...bookData, quantity: 1 });
      localStorage.setItem("borrowedBooks", JSON.stringify(stored));
    }

    // Navigate to fill-up form with book data
    navigate('/fill-up-form', { 
      state: { 
        book: bookData,
        // You can add any other data you want to pass
        returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // Default 14 days from now
      }
    });
  } catch (error) {
    console.error("Error processing borrow:", error);
    alert("Failed to process borrow request");
  }
};

  useEffect(() => {
    console.log("Fetching book data for id:", id);
    fetchBookData();
  }, [id, location.state]);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < (rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
      />
    ));

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto"></div>
        <p className="mt-4">Loading book details...</p>
      </div>
    );
  }

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
        {/* Left Column */}
        <div className="col-span-1 flex flex-col items-center">
          <img
            src={bookData.coverImage}
            alt={bookData.title}
            className="w-[250px] sm:w-[280px] h-auto object-cover rounded shadow-md"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
        </div>

        {/* RIGHT COLUMN - Book Details */}
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
              {bookData.ratingCount} Ratings
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">
              {ratingsData?.recentReviews?.length > 0 
                ? `${ratingsData.recentReviews.length} Reviews` 
                : "No Reviews"}
            </span>
          </div>

          {/* Availability counts */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700">
            <span className="inline-flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="font-semibold">{bookData.availableCopies}</span>&nbsp;Available
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="inline-flex items-center">
              <span className="font-semibold">{availabilityStats.upcoming}</span>&nbsp;Upcoming
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="inline-flex items-center">
              <span className="font-semibold">{availabilityStats.unavailable}</span>&nbsp;Not available
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
                  className={`ml-2 font-semibold hover:underline transition ${
                    showFullSummary ? "text-gray-400" : "text-sky-600"
                  }`}
                >
                  {showFullSummary ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
          </div>

          {/* Availability + Audio + PDF */}
          <div className="mt-6">
            <span className={`text-sm inline-flex items-center ${
              isAvailable 
                ? "text-green-600 font-medium" 
                : "text-red-500 font-medium"
            }`}>
              <span className={`h-3 w-3 rounded-full mr-2 ${
                isAvailable 
                  ? "bg-green-500 animate-ping" 
                  : "bg-red-500"
              }`}></span>
              {isAvailable ? "Available" : "Not Available"}
            </span>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <PlayCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Audio Clip</span>
                <div className="w-32 h-1 bg-gray-200 rounded-full mx-2 sm:mx-3">
                  <div className="w-1/3 h-full bg-sky-500 rounded-full"></div>
                </div>
              </div>

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
              onClick={handleBorrow}
              disabled={!isAvailable || updatingAvailability}
              className={`bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-md w-full sm:w-auto block text-center ${
                (!isAvailable || updatingAvailability) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updatingAvailability ? "Processing..." : "Borrow"}
            </button>
          </div>
        </div>

        {/* Ratings and Reviews Section */}
        {ratingsData && (
          <div className="col-span-3 mt-10 grid lg:grid-cols-3 gap-8">
            {/* Ratings Summary */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold">{ratingsData.averageRating?.toFixed(1) || "0.0"}</div>
                <div>
                  <div className="flex">
                    {renderStars(ratingsData.averageRating)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {ratingsData.totalRatings || 0} global ratings
                  </div>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2 mt-6">
                {[5, 4, 3, 2, 1].map((star) => {
                  const starCount = ratingsData.recentReviews?.filter(r => r.rating === star).length || 0;
                  const percentage = ratingsData.recentReviews?.length 
                    ? (starCount / ratingsData.recentReviews.length) * 100 
                    : 0;
                  
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-10 text-sm">{star} star</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-orange-500 rounded"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm text-gray-600">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6">
                <button className="w-full rounded-full border px-4 py-2 text-sm hover:bg-gray-50">
                  Write a review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
              
              {ratingsData.recentReviews?.length > 0 ? (
                <div className="space-y-6">
                  {ratingsData.recentReviews.map((review) => (
                    <article key={review.ratingId} className="border-b pb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <h5 className="font-semibold text-gray-900">{review.review || "No title"}</h5>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {review.username} — Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                      </div>

                      <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                        {review.review}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
                        <button className="rounded-full border px-3 py-1 hover:bg-gray-50">
                          Helpful
                        </button>
                        <button className="rounded-full border px-3 py-1 hover:bg-gray-50">
                          Report
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No reviews yet for this book.</div>
              )}
            </div>
          </div>
        )}

        {/* Related Books */}
        <div className="col-span-3 mt-10">
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Related Books</h3>
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {relatedBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out p-3 flex flex-col justify-between w-full"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <div className="mt-3">
                  <h4 className="font-semibold text-sm text-gray-800">{book.title}</h4>
                  <p className="text-xs text-gray-600">{book.authors}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(book.rating)}
                  </div>
                  <p
                    className={`text-xs font-medium mt-1 ${
                      book.status === "Out Of Stock" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {book.status}
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
    </div>
  );
}