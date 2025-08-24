// BookDetails.jsx - Part 1: Imports, State, and Core Logic
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  Star,
  PlayCircle,
  PauseCircle,
  Download,
  X,
  CheckCircle2,
  ChevronDown,
  Check,
  ThumbsUp,
  ThumbsDown,
  BookOpen
} from "lucide-react";
import Slider from "../../components/Slider/Slider";
import api from "../../api";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
    userId: null // You'll need to get this from user context/auth
  });
  const [submittingReview, setSubmittingReview] = useState(false);


  // Your original state variables (keeping your logic)
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

  // Friend's enhanced UI state variables
  const [pdTab, setPdTab] = useState("summary");
  const [pdExpanded, setPdExpanded] = useState(false);
  const specRef = useRef(null);

  // Author follow modal/state
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authorFollowers, setAuthorFollowers] = useState(0);
  const [rolePicked, setRolePicked] = useState("");

  // "Want to read" dropdown + toast
  const [showReadBox, setShowReadBox] = useState(false);
  const [readStatus, setReadStatus] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "" });
  const readBoxRef = useRef(null);

  // EXPANDED review items
  const [expanded, setExpanded] = useState({}); // {id: boolean}

  // Helpful/Not Helpful votes
  const [votes, setVotes] = useState({}); // {id: {up, down, my}}
  const [bump, setBump] = useState({}); // {id: {up:boolean, down:boolean}}

  // Professional popup for helpful/unhelpful
  const [feedbackToast, setFeedbackToast] = useState({
    open: false,
    type: "", // 'up' | 'down' | 'clear'
    msg: "",
  });

  // Audio player state & refs (enhanced UI feature)
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [curTime, setCurTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [editingReview, setEditingReview] = useState(null); // {id, rating, comment}
const [updatingReview, setUpdatingReview] = useState(false);
const [deletingReview, setDeletingReview] = useState(null); // review id being deleted

  // Your original normalize function (keeping your data structure)
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
      pdfLink: b.pdf_file_url || b.pdfLink || "#",
      audioLink: b.audio_file_url || "",
      status: b.is_available ? "Available" : "Out Of Stock",
      availableCopies: b.available_copies || 0,
      totalCopies: b.total_copies || 0,
      // Enhanced fields for friend's UI
      authorPhoto: b.author_image || b.authorPhoto || "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=240&h=240&fit=crop",
      authorBio: b.author_bio || b.authorBio || "No additional author story provided.",
      audioSrc: b.audio_file_url || b.audioSrc || null
    };
  };

  const normalizeReviews = (reviewsArray) => {
    if (!Array.isArray(reviewsArray)) return [];

     const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const currentUserId = storedUser.userId;
    
    return reviewsArray.map(review => ({
      ratingId: review.id,
      username: review.user?.username || review.user?.name || "Anonymous",
      rating: review.rating,
      review: review.comment, // Map "comment" to "review"
      createdAt: review.created_at,
      canBeEdited: review.can_be_edited && review.user?.id === currentUserId,
      canBeDeleted: review.can_be_deleted && review.user?.id === currentUserId,
      userId: review.user?.id
    }));
  };

  // Your original API functions (keeping your logic)
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
  // Add safety check
    if (!Array.isArray(books)) {
      console.warn("Books data is not an array:", books);
      return { available: 0, upcoming: 0, unavailable: 0 };
    }
    
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

  const submitReview = async (reviewData) => {
    setSubmittingReview(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      
      const response = await api.post(`/review/book/${id}/create`, {
        rating: reviewData.rating,
        comment: reviewData.comment,
        userId: storedUser.userId || reviewData.userId
      });
      
      // Refresh reviews after successful submission
      await fetchBookData();
      setShowReviewForm(false);
      setReviewForm({ rating: 0, comment: '', userId: storedUser.userId });
      setToast({ open: true, msg: "Review submitted successfully!" });
      
      return response.data;
    } catch (error) {
      console.error("Error submitting review:", error);
      console.error("Error details:", error.response?.data); // Add this for debugging
      alert("Failed to submit review: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingReview(false);
    }
  };

  const updateReview = async (reviewId, reviewData) => {
  setUpdatingReview(true);
  try {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    await api.put(`/review/edit/${reviewId}`, {
      userId: storedUser.userId,
      rating: reviewData.rating,
      comment: reviewData.comment
    });
    
    // Refresh reviews after successful update
    await fetchBookData();
    setEditingReview(null);
    setToast({ open: true, msg: "Review updated successfully!" });
  } catch (error) {
    console.error("Error updating review:", error);
    alert("Failed to update review: " + (error.response?.data?.message || error.message));
  } finally {
    setUpdatingReview(false);
  }
};

const deleteReview = async (reviewId) => {
  setDeletingReview(reviewId);
  try {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    await api.delete(`/review/delete/${reviewId}?userId=${storedUser.userId}`);
    
    // Refresh reviews after successful deletion
    await fetchBookData();
    setToast({ open: true, msg: "Review deleted successfully!" });
  } catch (error) {
    console.error("Error deleting review:", error);
    alert("Failed to delete review: " + (error.response?.data?.message || error.message));
  } finally {
    setDeletingReview(null);
  }
};


  // Your original fetchBookData function (keeping your API calls)
  const fetchBookData = async () => {
    setLoading(true);
    try {
      // Try to get book data from location state first
      const sliderBook = location.state?.fromSlider;
      if (sliderBook && String(sliderBook.id) === String(id)) {
        const normalizedData = normalize(sliderBook);
        setBookData(normalizedData);
        setAuthorFollowers(16); // Default value
      } else {
        // Fetch main book detail by id
        const res = await api.get(`/book/retrieve/${id}`);
        const normalizedData = normalize(res.data);
        setBookData(normalizedData);
        setAuthorFollowers(16); // Default value
      }

      // Check availability
      await checkAvailability();

      // Fetch reviews
      try {
        const reviewsRes = await api.get(`/review/list/book/${id}`);
        const normalizedReviews = normalizeReviews(reviewsRes.data);
        
        // Calculate average rating from reviews
        const avgRating = normalizedReviews.length > 0 
          ? normalizedReviews.reduce((sum, review) => sum + review.rating, 0) / normalizedReviews.length 
          : 0;

        setRatingsData({
          recentReviews: normalizedReviews,
          averageRating: avgRating,
          totalRatings: normalizedReviews.length
        });
        console.log("Fetched reviews:", normalizedReviews);
      } catch (error) {
        console.log("Reviews not available:", error);
        setRatingsData({
          recentReviews: [],
          averageRating: 0,
          totalRatings: 0
        });
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

  // Your original handleBorrow function (keeping your logic)
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
          returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // Default 14 days from now
        }
      });
    } catch (error) {
      console.error("Error processing borrow:", error);
      alert("Failed to process borrow request");
    }
  };

  // BookDetails.jsx - Part 2: Helper Functions and Effects

  // Friend's enhanced utility functions for UI
  const splitSentences = (txt = "") =>
    (txt || "")
      .replace(/\n+/g, " ")
      .trim()
      .split(/(?<=[.!?\u0964\u0965])\s+/)
      .filter(Boolean);

  const makeIntroTail = (txt = "", introCount = 6, tailCount = 4) => {
    const parts = splitSentences(txt);
    if (!parts.length) return { intro: "", tail: "" };
    const intro = parts.slice(0, introCount).join(" ");
    const tail = parts.slice(Math.max(parts.length - tailCount, 0)).join(" ");
    return { intro, tail };
  };

  // Audio helper functions (friend's enhanced UI)
  const format = (sec = 0) => {
    if (!isFinite(sec)) return "0:00";
    const s = Math.floor(sec % 60);
    const m = Math.floor(sec / 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const progress = duration ? Math.min(1, Math.max(0, curTime / duration)) : 0;

  const toggleAudio = () => {
    const el = audioRef.current;
    if (!el || !bookData?.audioSrc) return;

    // ensure current src is correct absolute URL
    const want = new URL(bookData.audioSrc, window.location.href).href;
    if (el.src !== want) {
      el.src = bookData.audioSrc;
    }

    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      if (Number.isNaN(el.duration) || !el.duration) {
        el.load();
      }
      el.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio play() failed:", err?.message || err);
          setIsPlaying(false);
        });
    }
  };

  const onSeekClick = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
    setCurTime(pct * duration);
  };

  const onSeekKeyDown = (e) => {
    if (!audioRef.current) return;
    if (e.key === "ArrowRight") {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
    } else if (e.key === "ArrowLeft") {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  // Review interaction functions (friend's enhanced UI)
  const vote = (id, dir) => {
    const cur = votes[id] || { up: 0, down: 0, my: null };
    let { up, down, my } = cur;

    if (dir === "up") {
      if (my === "up") {
        up -= 1;
        my = null;
      } else {
        if (my === "down") down -= 1;
        up += 1;
        my = "up";
      }
    } else {
      if (my === "down") {
        down -= 1;
        my = null;
      } else {
        if (my === "up") up -= 1;
        down += 1;
        my = "down";
      }
    }

    const next = { up: Math.max(0, up), down: Math.max(0, down), my };
    setVotes((prev) => ({ ...prev, [id]: next }));

    setBump((p) => ({ ...p, [id]: { ...(p[id] || {}), [dir]: true } }));
    setTimeout(() => {
      setBump((p) => ({ ...p, [id]: { ...(p[id] || {}), [dir]: false } }));
    }, 220);

    const type = my === "up" ? "up" : my === "down" ? "down" : "clear";
    const msg =
      type === "up"
        ? "Marked as Helpful"
        : type === "down"
        ? "Marked as Not Helpful"
        : "Feedback removed";

    setFeedbackToast({ open: true, type, msg });
    clearTimeout(vote._t);
    vote._t = setTimeout(() => setFeedbackToast({ open: false, type: "", msg: "" }), 1700);
  };

  // Shelf options for "Want to read" functionality
  const shelfOptions = [
    { key: "want", label: "Want to read" },
    { key: "current", label: "Currently reading" },
    { key: "read", label: "Read" },
  ];

  const onPickShelf = (opt) => {
    setReadStatus(opt.key);
    setShowReadBox(false);
    setToast({ open: true, msg: `Successfully added: ${opt.label}` });
    setTimeout(() => setToast({ open: false, msg: "" }), 1400);
  };

  // Star rendering functions
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < (rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
      />
    ));

  const renderStarsLarge = (val) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.round(val || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
      />
    ));

  // UseEffect hooks combining your logic with friend's UI enhancements
  useEffect(() => {
    console.log("Fetching book data for id:", id);
    fetchBookData();
  }, [id, location.state]);


  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  if (storedUser.userId) {
    setReviewForm(prev => ({ ...prev, userId: storedUser.userId }));
  }
}, []);

  // Initialize votes when book changes (for review functionality)
  useEffect(() => {
    if (!bookData?.id || !ratingsData) return;
    const reviews = ratingsData?.recentReviews || [];
    if (reviews.length > 0) {
      const next = {};
      reviews.forEach((r) => {
        next[r.ratingId] = { up: 0, down: 0, my: null };
      });
      setVotes(next);
      setExpanded({});
    } else {
      setVotes({});
      setExpanded({});
    }
  }, [bookData?.id, ratingsData]);

  // Close the read box when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showReadBox && readBoxRef.current && !readBoxRef.current.contains(e.target)) {
        setShowReadBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReadBox]);

  // Audio DOM event listeners
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onLoaded = () => {
      setDuration(el.duration || 0);
    };
    const onTime = () => {
      setCurTime(el.currentTime || 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurTime(0);
    };

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [bookData?.audioSrc]);

  // Reset when audio src changes
  useEffect(() => {
    setIsPlaying(false);
    setCurTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = bookData?.audioSrc || "";
      if (bookData?.audioSrc) audioRef.current.load(); // eager metadata
    }
  }, [bookData?.audioSrc]);

  // Loading and error states (your original logic)
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

  // Prepare data for enhanced UI display
  const localReviewCount = ratingsData?.recentReviews?.length ?? 0;
  const ratingCountDisplay = bookData.ratingCount || 0;
  const reviewsTextDisplay = localReviewCount > 0 
    ? `${localReviewCount} Reviews` 
    : "No Reviews";

  // Compute per-book preview blocks for enhanced summary display
  const baseSummary = bookData.summary || "No summary available.";
  const introTail = makeIntroTail(baseSummary);
  const summaryIntro = introTail.intro;
  const summaryTail = introTail.tail;
  


// BookDetails.jsx - Part 3: JSX Render and Component End

  return (
    <div className="bg-white py-10 px-4 sm:px-6 lg:px-8">
      {/* Page grid with friend's enhanced layout */}
      <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
        
        {/* LEFT COLUMN (cover) - Enhanced design */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="w-[340px] max-w-full border border-gray-300 rounded-md p-4 bg-white">
            <img
              src={bookData.coverImage}
              alt={bookData.title}
              className="w-full h-[460px] object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN (book info) - Enhanced design with your data */}
        <div className="lg:col-span-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{bookData.title}</h1>
          <p className="text-gray-600 mt-1 text-base">
            by <span className="text-sky-600 font-medium">{bookData.authors}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {bookData.publisher}, {bookData.publishDate} —{" "}
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
            <span className="text-sm text-gray-600 font-semibold">{ratingCountDisplay} Ratings</span>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">{reviewsTextDisplay}</span>
          </div>

          {/* Availability counts - Enhanced with your data */}
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

          {/* Short summary teaser - Enhanced design */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-800">Summary of the Book</h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
              {baseSummary.split(".")[0] + (baseSummary ? "..." : "")}
              {baseSummary.split(".").length > 1 && (
                <button
                  onClick={() => {
                    setPdTab("summary");
                    setPdExpanded(false);
                    specRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="ml-2 font-semibold hover:underline text-sky-600"
                >
                  Read More
                </button>
              )}
            </p>
          </div>

          {/* Availability + Enhanced Audio + PDF */}
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

            {/* Enhanced Audio Row with your data */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleAudio}
                disabled={!bookData.audioSrc}
                className={`flex items-center gap-2 text-sm ${
                  bookData.audioSrc
                    ? "text-gray-700 hover:text-sky-600"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <PauseCircle className="w-5 h-5" />
                ) : (
                  <PlayCircle className="w-5 h-5" />
                )}
                <span>Audio Clip</span>
              </button>

              {/* Progress bar (click/seek) */}
              <div
                className="w-40 sm:w-56 h-1 bg-gray-200 rounded-full mx-2 sm:mx-3 relative cursor-pointer select-none"
                onClick={onSeekClick}
                onKeyDown={onSeekKeyDown}
                role="slider"
                tabIndex={0}
                aria-valuemin={0}
                aria-valuemax={Math.max(1, Math.floor(duration))}
                aria-valuenow={Math.floor(curTime)}
                aria-label="Seek audio"
              >
                <div
                  className="absolute left-0 top-0 h-full bg-sky-500 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              {/* Timing */}
              <div className="text-xs text-gray-600 min-w-[84px]">
                {format(curTime)} / {format(duration)}
              </div>

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                src={bookData.audioSrc || undefined}
                preload="auto"
                crossOrigin="anonymous"
              />

              <a
                href={bookData.pdfLink}
                download
                className="ml-auto inline-flex items-center gap-1 text-sm text-gray-700 font-semibold border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
                PDF
              </a>
            </div>

            {!bookData.audioSrc && (
              <div className="mt-2 text-xs text-gray-500">
                No audio clip provided for this book.
              </div>
            )}
          </div>

          {/* Your original borrow button with enhanced styling */}
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

        {/* Enhanced SPECIFICATION & SUMMARY Section */}
        <div ref={specRef} className="lg:col-span-2">
          <div className="mt-10 rounded-lg border border-gray-300 overflow-hidden bg-white">
            <div className="px-4 py-3">
              <h3 className="text-lg font-bold text-gray-800">Specification &amp; Summary</h3>
            </div>

            <div className="border-t border-gray-300">
              <div className="px-4 pt-3">
                <div className="flex items-center gap-2">
                  {["summary", "spec", "author"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setPdTab(t)}
                      className={`px-3 py-1.5 text-sm rounded-md border ${
                        pdTab === t
                          ? "bg-green-100 border-green-300 text-green-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t === "summary" ? "Summary" : t === "spec" ? "Specification" : "Author"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4">
                {pdTab === "summary" && (
                  <>
                    {!pdExpanded ? (
                      <>
                        <div className="text-gray-800 text-[15px] leading-7 space-y-4">
                          <div className="relative">
                            <p className="line-clamp-3">{summaryIntro}</p>
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent"></div>
                          </div>

                          <div className="border-t border-gray-300" />

                          <p className="italic text-gray-700">{summaryTail}</p>
                        </div>

                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => setPdExpanded(true)}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50"
                          >
                            Show More
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-800 text-[15px] leading-7 whitespace-pre-line">
                          {baseSummary}
                        </div>
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => setPdExpanded(false)}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50"
                          >
                            Show Less
                          </button>
                        </div>
                      </>
                    )}

                    <div className="mt-4 border-t border-b border-gray-300 py-3">
                      <div className="text-center">
                        <button className="inline-flex items-center gap-2 text-red-500 hover:text-sky-600 text-sm">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-current">
                            <span className="text-[10px] font-bold">i</span>
                          </span>
                          Report incorrect information
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {pdTab === "spec" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Title</span>
                      <div className="font-medium text-gray-800">{bookData.title}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Author</span>
                      <div className="font-medium text-gray-800">{bookData.authors}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Category</span>
                      <div className="font-medium text-gray-800">{bookData.category}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Publisher</span>
                      <div className="font-medium text-gray-800">{bookData.publisher}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Publish Date</span>
                      <div className="font-medium text-gray-800">{bookData.publishDate || "—"}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Rating</span>
                      <div className="font-medium text-gray-800">
                        {(bookData.rating || 0).toFixed ? bookData.rating.toFixed(1) : bookData.rating}
                      </div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Available Copies</span>
                      <div className="font-medium text-gray-800">{bookData.availableCopies}</div>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="text-gray-500">Status</span>
                      <div className="font-medium text-gray-800">{bookData.status || "Available"}</div>
                    </div>
                  </div>
                )}

                {pdTab === "author" && (
                  <div className="flex items-start gap-5">
                    <div className="w-36 shrink-0 text-center">
                      <img
                        src={bookData.authorPhoto}
                        alt={bookData.authors}
                        className="w-24 h-24 rounded-full object-cover border mx-auto"
                      />
                      <div className="mt-2 text-xs text-gray-600">{authorFollowers} followers</div>
                      <button
                        onClick={() => setShowFollowModal(true)}
                        className={`mt-2 w-24 text-sm font-semibold rounded-full px-3 py-1.5 transition ${
                          isFollowing ? "bg-gray-200 text-gray-700 cursor-default" : "bg-sky-500 text-white hover:bg-sky-600"
                        }`}
                        disabled={isFollowing}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{bookData.authors}</h4>
                      <p className="mt-2 text-[15px] leading-7 text-gray-800 whitespace-pre-line">
                        {bookData.authorBio || "No additional author story provided."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced REVIEWS & RATINGS with your data */}
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
                <button 
                  onClick={() => setShowReviewForm(true)}
                  className="w-full rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Write a review
                </button>
              </div>
            </div>

            {/* Reviews List with enhanced interactions */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
              
              {ratingsData.recentReviews?.length > 0 ? (
                <div className="space-y-6">
                  {ratingsData.recentReviews.map((review) => {
                    const isLong = (review.review || "").length > 220;
                    const open = !!expanded[review.ratingId];
                    const body = !isLong || open ? review.review : review.review?.slice(0, 220) + "…";
                    const firstLetter = review.username?.trim()?.[0]?.toUpperCase() || "?";
                    const v = votes[review.ratingId] || { up: 0, down: 0, my: null };
                    
                    return (
                      <article key={review.ratingId} className="border-b pb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                            {firstLetter}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-semibold text-gray-900">{review.username}</span>
                              <span className="text-gray-500">, {new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <h5 className="mt-3 font-semibold text-gray-900">{review.review || "No title"}</h5>

                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                          {body}{" "}
                          {isLong && (
                            <button
                              onClick={() => setExpanded((s) => ({ ...s, [review.ratingId]: !open }))}
                              className="text-sky-600 font-medium hover:underline"
                            >
                              {open ? "Read less" : "Read More"}
                            </button>
                          )}
                        </p>



                        {/* Edit/Delete buttons for own reviews */}
                        {(review.canBeEdited || review.canBeDeleted) && (
                          <div className="mt-3 flex items-center gap-2">
                            {review.canBeEdited && (
                              <button
                                onClick={() => setEditingReview({
                                  id: review.ratingId,
                                  rating: review.rating,
                                  comment: review.review
                                })}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Edit
                              </button>
                            )}
                            {review.canBeDeleted && (
                              <>
                                {review.canBeEdited && <span className="text-xs text-gray-300">|</span>}
                                <button
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this review?')) {
                                      deleteReview(review.ratingId);
                                    }
                                  }}
                                  disabled={deletingReview === review.ratingId}
                                  className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                                >
                                  {deletingReview === review.ratingId ? 'Deleting...' : 'Delete'}
                                </button>
                              </>
                            )}
                          </div>
                        )}
                        <div className="mt-3 text-xs text-gray-500">Was this review helpful to you?</div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                          <button
                            onClick={() => vote(review.ratingId, "up")}
                            className={`inline-flex items-center gap-1 rounded border px-3 py-1 transition
                              ${v.my === "up" ? "border-green-500 text-green-700 bg-green-50" : "border-gray-300"}
                              ${bump[review.ratingId]?.up ? "animate-[popVote_.2s_ease-out]" : ""}`}
                          >
                            <ThumbsUp className="w-4 h-4" /> Helpful ({v.up})
                          </button>
                          <button
                            onClick={() => vote(review.ratingId, "down")}
                            className={`inline-flex items-center gap-1 rounded border px-3 py-1 transition
                              ${v.my === "down" ? "border-rose-500 text-rose-700 bg-rose-50" : "border-gray-300"}
                              ${bump[review.ratingId]?.down ? "animate-[popVote_.2s_ease-out]" : ""}`}
                          >
                            <ThumbsDown className="w-4 h-4" /> Not Helpful ({v.down})
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No reviews yet for this book.</div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced RELATED BOOKS using Slider component */}
        <div className="lg:col-span-2">
          <Slider title={"Related Books"} items={relatedBooks} className="p-3 sm:p-4" />
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-100"
            onClick={() => setShowReviewForm(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-300 p-5 animate-[pop_220ms_ease-out]">
              <div className="flex items-start justify-between">
                <h4 className="text-lg font-semibold">Write a Review</h4>
                <button
                  className="p-2 hover:bg-gray-100 rounded"
                  onClick={() => setShowReviewForm(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mt-4">
                {/* Star Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your thoughts about this book..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
                      submitReview({ ...reviewForm, userId: storedUser.userId });
                    }}
                    disabled={!reviewForm.rating || !reviewForm.comment.trim() || submittingReview}
                    className="px-4 py-2 rounded-md bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-100"
            onClick={() => setEditingReview(null)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-300 p-5 animate-[pop_220ms_ease-out]">
              <div className="flex items-start justify-between">
                <h4 className="text-lg font-semibold">Edit Review</h4>
                <button
                  className="p-2 hover:bg-gray-100 rounded"
                  onClick={() => setEditingReview(null)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mt-4">
                {/* Star Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditingReview(prev => ({ ...prev, rating: star }))}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= editingReview.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                  <textarea
                    value={editingReview.comment}
                    onChange={(e) => setEditingReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your thoughts about this book..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingReview(null)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateReview(editingReview.id, {
                      rating: editingReview.rating,
                      comment: editingReview.comment
                    })}
                    disabled={!editingReview.rating || !editingReview.comment.trim() || updatingReview}
                    className="px-4 py-2 rounded-md bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingReview ? "Updating..." : "Update Review"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Follow modal (animated) */}
      {showFollowModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-100"
            onClick={() => setShowFollowModal(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-300 p-5 animate-[pop_220ms_ease-out]">
              <div className="flex items-start justify-between">
                <h4 className="text-lg font-semibold">Follow Author</h4>
                <button
                  className="p-2 hover:bg-gray-100 rounded"
                  onClick={() => setShowFollowModal(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <img
                  src={bookData.authorPhoto}
                  alt={bookData.authors}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <div className="font-medium text-gray-900">{bookData.authors}</div>
                  <div className="text-xs text-gray-500">{authorFollowers} followers</div>
                </div>
              </div>

              {!rolePicked ? (
                <>
                  <p className="mt-4 text-sm text-gray-700">
                    Choose how you want to follow this author.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRolePicked("Client")}
                      className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold hover:border-sky-400 hover:bg-sky-50 transition"
                    >
                      Follow as Client
                    </button>
                    <button
                      onClick={() => setRolePicked("Employee")}
                      className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold hover:border-sky-400 hover:bg-sky-50 transition"
                    >
                      Follow as Employee
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-6 flex flex-col items-center text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                  <div className="mt-2 font-semibold">Following as {rolePicked}</div>
                  <div className="text-sm text-gray-600">
                    You'll see updates from this author.
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2">
                {!rolePicked ? (
                  <button
                    onClick={() => setShowFollowModal(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!isFollowing) {
                        setIsFollowing(true);
                        setAuthorFollowers((c) => c + 1);
                      }
                      setTimeout(() => {
                        setShowFollowModal(false);
                        setRolePicked("");
                      }, 1100);
                    }}
                    className="px-4 py-2 rounded-md bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast for shelf add */}
      {toast.open && (
        <div className="fixed left-1/2 bottom-8 -translate-x-1/2 z-[60] bg-green-600 text-white px-4 py-2 rounded-md shadow-lg animate-[toastPop_.22s_ease-out]">
          {toast.msg}
        </div>
      )}

      {/* Helpful / Unhelpful popup */}
      {feedbackToast.open && (
        <div className="fixed bottom-8 right-6 z-[70] animate-[slideIn_.22s_ease-out]">
          <div className="bg-white border border-gray-300 shadow-xl rounded-lg p-3 w-[290px]">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full
                ${feedbackToast.type === "up" ? "bg-green-50 text-green-600" : feedbackToast.type === "down" ? "bg-rose-50 text-rose-600" : "bg-gray-50 text-gray-500"}`}
              >
                {feedbackToast.type === "up" ? (
                  <ThumbsUp className="w-4 h-4" />
                ) : feedbackToast.type === "down" ? (
                  <ThumbsDown className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">{feedbackToast.msg}</div>
                <div className="text-xs text-gray-600">Thanks for your feedback.</div>
              </div>
              <button
                onClick={() => setFeedbackToast({ open: false, type: "", msg: "" })}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="mt-3 h-0.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-sky-500 origin-left animate-[bar_1.6s_linear]"></div>
            </div>
          </div>
        </div>
      )}

      {/* CSS keyframes */}
      <style>{`
        @keyframes pop { 0% { transform: scale(.95); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
        @keyframes toastPop { 0% { transform: translate(-50%, 8px); opacity: 0 } 100% { transform: translate(-50%, 0); opacity: 1 } }
        @keyframes popVote { 0% { transform: scale(.96) } 60% { transform: scale(1.06) } 100% { transform: scale(1) } }
        @keyframes slideIn { 0% { transform: translateY(10px); opacity: 0 } 100% { transform: translateY(0); opacity: 1 } }
        @keyframes bar { 0% { transform: scaleX(1) } 100% { transform: scaleX(0) } }
      `}</style>
    </div>
  );
}