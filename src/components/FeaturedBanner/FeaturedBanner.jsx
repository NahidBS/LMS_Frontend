// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { useEffect, useState } from "react";
// import books from "../../data/sampleBooks";
// import { Link } from "react-router-dom";

// const FeaturedBanner = () => {
//   const featured = books.featuredBooks;
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     if (featured.length === 0) return;
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % featured.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [featured.length]);

//   if (featured.length === 0) {
//     return null; // Don't render anything if there are no featured books
//   }

//   const prevSlide = () => {
//     setCurrent((prev) => (prev - 1 + featured.length) % featured.length);
//   };

//   const nextSlide = () => {
//     setCurrent((prev) => (prev + 1) % featured.length);
//   };

//   const currentBook = featured[current];
//   const isOutOfStock = currentBook.availability.toLowerCase().includes("out of stock");

//   return (
//     <div className="bg-white py-20 px-4 sm:px-6 lg:px-8 relative flex justify-center items-center">
//       <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-center gap-12">
//         <div className="shadow-lg rounded-md overflow-hidden w-64 flex-shrink-0">
//           <img
//             src={currentBook.image}
//             alt={currentBook.title}
//             className="w-full h-[350px] object-cover"
//           />
//         </div>

//         <div className="text-center lg:text-left">
//           <h2 className="text-3xl font-bold text-blue-900 mb-2">Featured Book</h2>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">{currentBook.title}</h3>
//           <p className="text-sky-600 uppercase tracking-widest text-xs mb-2">
//             by {currentBook.author}
//           </p>
//           <p className="text-sm text-gray-500 max-w-md mb-4">{currentBook.description}</p>

//           <div className="flex items-center justify-center lg:justify-start mb-4">
//             <span className="relative flex h-3 w-3 mr-2">
//               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOutOfStock ? "bg-red-400" : "bg-green-400"} opacity-75`}></span>
//               <span className={`relative inline-flex rounded-full h-3 w-3 ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}></span>
//             </span>
//             <span className={`font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
//               {currentBook.availability}
//             </span>
//           </div>

//           {/* THIS IS THE FIX: Link now uses the correct book ID */}
//           <Link
//             to={`/book/${currentBook.id}`} 
//             className="inline-block px-5 py-2 border border-sky-600 text-sky-600 rounded hover:bg-sky-600 hover:text-white transition-all text-sm"
//           >
//             VIEW DETAILS →
//           </Link>
//         </div>
//       </div>

//       <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-sky-50">
//         <FaChevronLeft className="text-blue-600" />
//       </button>
//       <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-sky-50">
//         <FaChevronRight className="text-blue-600" />
//       </button>

//       <div className="flex justify-center mt-10 gap-2 absolute bottom-4 left-1/2 transform -translate-x-1/2">
//         {featured.map((_, idx) => (
//           <button
//             key={idx}
//             className={`w-3 h-3 rounded-full ${idx === current ? "bg-blue-600" : "bg-gray-300"}`}
//             onClick={() => setCurrent(idx)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FeaturedBanner;



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
        const res = await api.get("/book/list");
        const rawBooks = res.data.content; // array of {id, book: {...}}
        const normalizedBooks = rawBooks.map((item) => ({
          id: item.id,
          title: item.name || "Untitled",
          author: item.author || "Unknown",
          image: item.book_cover_url || "",
          rating: item.average_rating || 0,
          availability: item.available_copies > 0 ? "Available" : "Out Of Stock",
          description: item.short_details || "",
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
    <div className="bg-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative flex justify-center items-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-12">
        <div className="shadow-lg rounded-md overflow-hidden w-full sm:w-64 flex-shrink-0 max-w-xs sm:max-w-none">
          <img
            src={currentBook.image}
            alt={currentBook.title}
            className="w-full h-64 sm:h-[350px] object-cover"
          />
        </div>

        <div className="text-center lg:text-left px-1 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Featured Book</h2>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{currentBook.title}</h3>
          <p className="text-sky-600 uppercase tracking-widest text-xs mb-2">
            by {currentBook.author}
          </p>
          <p className="text-sm text-gray-500 max-w-md mx-auto lg:mx-0 mb-4">{currentBook.description}</p>

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

      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-auto sm:top-1/2 bottom-16 sm:bottom-auto -translate-y-0 sm:-translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-sky-50"
      >
        <FaChevronLeft className="text-blue-600" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-auto sm:top-1/2 bottom-16 sm:bottom-auto -translate-y-0 sm:-translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-sky-50"
      >
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