import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api";
import { Star, Clock } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";

const getStockStatus = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("out")) return "Stock Out";
  if (t.includes("upcoming")) return "Upcoming";
  return "Available";
};

const formatCountdown = (targetMs, nowMs) => {
  const diff = Math.max(0, new Date(targetMs).getTime() - nowMs);
  const mins = Math.floor(diff / 60000);
  const days = Math.floor(mins / (60 * 24));
  const hours = Math.floor((mins % (60 * 24)) / 60);
  const minutes = mins % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const isToday = (dt) => {
  const d = new Date(dt);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
};

const normalizeBook = (apiBook) => ({
  id: apiBook.id,
  category: apiBook.category?.name || "Unknown",
  title: apiBook.name || "Unknown",
  author: apiBook.author || "Unknown",
  shortDescription: apiBook.short_description || "Unknown",
  totalCopies: apiBook.total_copies || "",
  availableCopies: apiBook.available_copies || "",
  rating: apiBook.average_rating || "",
  ratingCount: apiBook.rating_count || apiBook.total_ratings,
  image: apiBook.book_cover_url,
  pdfUrl: apiBook.pdf_file_url,
  audioUrl: apiBook.audio_file_url,
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
        // const params = { page, per_page: perPage };
        const params = { page: page - 1, size: perPage }; // Backend pages are usually 0-based
        let endpoint = "/book/list";
        if (categoryFilter) {
          // params.category = categoryFilter; // Pass to backend
          // If filtering by category, call the category endpoint
          endpoint = `/book/category/${categoryFilter}`;
        }

        // const response = await api.get("/book/list", { params });
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
                books.map((book) => {
                  const computedStatus = getStockStatus(book.title);
                  const raw = `${(book.status || "").toLowerCase()} ${(book.title || "").toLowerCase()}`;
                  const isStocking =
                    raw.includes("stocking") ||
                    raw.includes("restock") ||
                    raw.includes("coming soon");

                  let pillText = "Best Seller";
                  let pillClass = "bg-orange-500 text-white";

                  if (computedStatus === "Upcoming") {
                    pillText = "Upcoming";
                    pillClass = "bg-yellow-500 text-white";
                  } else if (isStocking) {
                    pillText = "Stocking";
                    pillClass = "bg-blue-600 text-white";
                  } else if (computedStatus === "Stock Out") {
                    pillText = "Not Available";
                    pillClass = "bg-red-500 text-white";
                  } else if (computedStatus === "Available") {
                    pillText = "Available";
                    pillClass = "bg-green-600 text-white";
                  }

                  const showOutIn = pillText === "Available" && book.stockOutAt;
                  const showArrivesIn =
                    (pillText === "Not Available" ||
                      pillText === "Upcoming" ||
                      pillText === "Stocking") &&
                    book.restockAt;

                  return (
                    <div
                      key={book.id}
                      onClick={() => navigate(`/book/${book.id}`)}
                      className="group cursor-pointer rounded-xl overflow-hidden bg-white ring-1 ring-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:ring-gray-200 transition-all duration-300 h-full flex flex-col"
                    >
                      <div className="relative">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-48 sm:h-56 md:h-60 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span
                          className={`absolute top-2 left-2 px-2.5 py-1 rounded-md text-[11px] font-semibold shadow ${pillClass}`}
                        >
                          {pillText}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-base font-semibold leading-snug line-clamp-2 mb-1 group-hover:text-sky-600 transition-colors">
                          {book.title}
                        </h3>

                        <div className="text-sm text-gray-700 mb-2">
                          by{" "}
                          <span className="text-sky-600 hover:underline">
                            {book.author || "Unknown"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (book.rating || 0)
                                    ? "text-orange-500 fill-orange-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">
                            {(book.rating || 4.0).toFixed
                              ? (book.rating || 4.0).toFixed(1)
                              : book.rating || 4.0}
                          </span>
                          <span className="text-gray-500">
                            ({book.ratingCount || 0})
                          </span>
                        </div>

                        {showOutIn && (
                          <div className="mt-3 text-xs sm:text-sm text-amber-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Out in {formatCountdown(book.stockOutAt, Date.now())}
                          </div>
                        )}
                        {showArrivesIn && (
                          <div className="mt-3 text-xs sm:text-sm text-blue-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {isToday(book.restockAt)
                              ? "Arrives today"
                              : `Arrives in ${formatCountdown(
                                  book.restockAt,
                                  Date.now()
                                )}`}
                          </div>
                        )}

                        <div className="mt-3 text-sm text-sky-600 font-semibold hover:underline">
                          {book.category || "Paperback"}
                        </div>
                      </div>
                    </div>
                  );
                })
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



// import { useNavigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import api from "../../api";
// import { Star, Clock } from "lucide-react";
// import Sidebar from "../../components/Sidebar/Sidebar";

// const getStockStatus = (title = "") => {
//   const t = title.toLowerCase();
//   if (t.includes("out")) return "Stock Out";
//   if (t.includes("upcoming")) return "Upcoming";
//   return "Available";
// };

// const formatCountdown = (targetMs, nowMs) => {
//   const diff = Math.max(0, new Date(targetMs).getTime() - nowMs);
//   const mins = Math.floor(diff / 60000);
//   const days = Math.floor(mins / (60 * 24));
//   const hours = Math.floor((mins % (60 * 24)) / 60);
//   const minutes = mins % 60;

//   if (days > 0) return `${days}d ${hours}h`;
//   if (hours > 0) return `${hours}h ${minutes}m`;
//   return `${minutes}m`;
// };

// const isToday = (dt) => {
//   const d = new Date(dt);
//   const n = new Date();
//   return (
//     d.getFullYear() === n.getFullYear() &&
//     d.getMonth() === n.getMonth() &&
//     d.getDate() === n.getDate()
//   );
// };

// const normalizeBook = (apiBook) => ({
//   id: apiBook.id,
//   category: apiBook.category?.category_name || "Unknown",
//   title: apiBook.name,
//   author: apiBook.author,
//   shortDescription: apiBook.short_description,
//   totalCopies: apiBook.total_copies,
//   availableCopies: apiBook.available_copies,
//   rating: apiBook.average_rating,
//   ratingCount: apiBook.rating_count || apiBook.total_ratings,
//   image: apiBook.book_cover_url,
//   pdfUrl: apiBook.pdf_file_url,
//   audioUrl: apiBook.audio_file_url,
// });

// export default function AllGenres() {
//   const navigate = useNavigate();
//   const location = useLocation();

//    const allBooks = [
//     ...(books?.recommended || []),
//     ...(books?.popular || []),
//     ...(books?.featuredBooks || []), // safe if missing
//   ];
//   // "tick" every minute so countdowns update automatically
//   const [now, setNow] = useState(Date.now());
//   useEffect(() => {
//     const id = setInterval(() => setNow(Date.now()), 60000);
//     return () => clearInterval(id);
//   }, []);

//   const categoryFilter = location.state?.category || null;

//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const perPage = 10;

//   useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const params = { page, per_page: perPage };
//         if (categoryFilter) {
//           params.category = categoryFilter; // Pass to backend
//         }

//         const response = await api.get("/book/list", { params });

//         if (
//           response.data?.status === "success" &&
//           Array.isArray(response.data.data)
//         ) {
//           const normalizedBooks = response.data.data.map(normalizeBook);
//           setBooks(normalizedBooks);
//           setLastPage(response.data.meta?.last_page || 1);
//         } else {
//           setError("Invalid response from server");
//           setBooks([]);
//         }
//       } catch (e) {
//         setError("Failed to load books");
//         setBooks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, [page, categoryFilter]);

//   const paginationButtons = [];
//   for (let i = 1; i <= lastPage; i++) {
//     paginationButtons.push(
//       <button
//         key={i}
//         onClick={() => setPage(i)}
//         className={`px-3 py-1 rounded-md border ${
//           i === page
//             ? "bg-sky-600 text-white border-sky-600"
//             : "bg-white text-sky-600 border-sky-600 hover:bg-sky-600 hover:text-white"
//         }`}
//       >
//         {i}
//       </button>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-white">
//       <Sidebar />

//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-6">
//           {categoryFilter ? `Category: ${categoryFilter}` : "All Genres"}
//         </h1>

//         {loading && <div className="text-gray-500">Loading books...</div>}
//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         {!loading && !error && (
//           <>
//             <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//               {books.length > 0 ? (
//                 books.map((book) => {
//                   const computedStatus = getStockStatus(book.title);
//                   const raw = `${(book.status || "").toLowerCase()} ${(book.title || "").toLowerCase()}`;
//                   const isStocking =
//                     raw.includes("stocking") ||
//                     raw.includes("restock") ||
//                     raw.includes("coming soon");

//                   let pillText = "Best Seller";
//                   let pillClass = "bg-orange-500 text-white";

//                   if (computedStatus === "Upcoming") {
//                     pillText = "Upcoming";
//                     pillClass = "bg-yellow-500 text-white";
//                   } else if (isStocking) {
//                     pillText = "Stocking";
//                     pillClass = "bg-blue-600 text-white";
//                   } else if (computedStatus === "Stock Out") {
//                     pillText = "Not Available";
//                     pillClass = "bg-red-500 text-white";
//                   } else if (computedStatus === "Available") {
//                     pillText = "Available";
//                     pillClass = "bg-green-600 text-white";
//                   }

//                   const showOutIn = pillText === "Available" && book.stockOutAt;
//                   const showArrivesIn =
//                     (pillText === "Not Available" ||
//                       pillText === "Upcoming" ||
//                       pillText === "Stocking") &&
//                     book.restockAt;

//                   return (
//                     <div
//                       key={book.id}
//                       onClick={() => navigate(`/book/${book.id}`)}
//                       className="group cursor-pointer rounded-xl overflow-hidden bg-white ring-1 ring-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:ring-gray-200 transition-all duration-300 h-full flex flex-col"
//                     >
//                       <div className="relative">
//                         <img
//                           src={book.image}
//                           alt={book.title}
//                           className="w-full h-48 sm:h-56 md:h-60 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
//                         />
//                         <span
//                           className={`absolute top-2 left-2 px-2.5 py-1 rounded-md text-[11px] font-semibold shadow ${pillClass}`}
//                         >
//                           {pillText}
//                         </span>
//                       </div>

//                       <div className="p-4 flex-1 flex flex-col">
//                         <h3 className="text-base font-semibold leading-snug line-clamp-2 mb-1 group-hover:text-sky-600 transition-colors">
//                           {book.title}
//                         </h3>

//                         <div className="text-sm text-gray-700 mb-2">
//                           by{" "}
//                           <span className="text-sky-600 hover:underline">
//                             {book.author || "Unknown"}
//                           </span>
//                         </div>

//                         <div className="flex items-center gap-2 text-sm text-gray-700">
//                           <div className="flex">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className={`w-4 h-4 ${
//                                   i < (book.rating || 0)
//                                     ? "text-orange-500 fill-orange-500"
//                                     : "text-gray-300"
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                           <span className="font-medium">
//                             {(book.rating || 4.0).toFixed
//                               ? (book.rating || 4.0).toFixed(1)
//                               : book.rating || 4.0}
//                           </span>
//                           <span className="text-gray-500">
//                             ({book.ratingCount || 0})
//                           </span>
//                         </div>

//                         {showOutIn && (
//                           <div className="mt-3 text-xs sm:text-sm text-amber-600 flex items-center gap-2">
//                             <Clock className="w-4 h-4" />
//                             Out in {formatCountdown(book.stockOutAt, Date.now())}
//                           </div>
//                         )}
//                         {showArrivesIn && (
//                           <div className="mt-3 text-xs sm:text-sm text-blue-600 flex items-center gap-2">
//                             <Clock className="w-4 h-4" />
//                             {isToday(book.restockAt)
//                               ? "Arrives today"
//                               : `Arrives in ${formatCountdown(
//                                   book.restockAt,
//                                   Date.now()
//                                 )}`}
//                           </div>
//                         )}

//                         <div className="mt-3 text-sm text-sky-600 font-semibold hover:underline">
//                           {book.category || "Paperback"}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="text-sm text-gray-500">No books found.</div>
//               )}
//             </div>

//             <div className="mt-8 flex justify-center items-center gap-3">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 className="px-3 py-1 rounded-md border bg-white text-sky-600 border-sky-600 hover:bg-sky-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>

//               {paginationButtons}

//               <button
//                 disabled={page === lastPage}
//                 onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
//                 className="px-3 py-1 rounded-md border bg-white text-sky-600 border-sky-600 hover:bg-sky-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
