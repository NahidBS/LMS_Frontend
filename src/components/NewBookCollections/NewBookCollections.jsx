// // NewBookCollections.jsx

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Star, ChevronRight, ChevronLeft } from "lucide-react";

// const books = [
//   {
//     id: 1,
//     title: "Fundamentals of Software Testing, 2nd Edition",
//     author: " by Bernard Homès",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643480/d9_wxocuv.jpg",
//     rating: 4,
//     status: "Available",
//     category: "Development"
//   },
//   {
//     id: 2,
//     title: "The Coming Wave: AI, Power, and Our Future",
//     author: " Mustafa Suleyman",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643606/ai5_ua61lt.jpg",
//     rating: 4.8,
//     status: "Available",
//   },
//   {
//     id: 3,
//     title: "Co-Intelligence: Living and Working with AI",
//     author: "Ethan Mollick",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643734/ai6_mh7ans.jpg",
//     rating: 5,
//     status: "Out Of Stock",
//   },
//   {
//     id: 4,
//     title: "Ace the Data Science Interview: 201 Real Interview Questions Asked By FAANG, Tech Startups, & Wall Street",
//     author: " Nick Singh &  Kevin Huo",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643910/DS4_ifbyg1.jpg",
//     rating: 4.8,
//     status: "Out Of Stock",
//   },
//   {
//     id: 5,
//     title: "Python for Data Analysis",
//     author: "by Wes McKinney",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754644368/ds1_qqs3rd.jpg",
//     rating: 4,
//     status: "Available",
//   },
//   {
//     id: 6,
//     title: "Data Mining: Concepts and Techniques (The Morgan Kaufmann Series in Data Management Systems)",
//     author: "Jiawei Han, Jian Pei &  Hanghang Tong ",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754644513/datamining_oy6mhy.jpg",
//     rating: 5,
//     status: "Available",
//   },
//   {
//     id: 7,
//     title: "Python Crash Course",
//     author: "Eric Matthes",
//     image: "https://covers.openlibrary.org/b/id/8671733-L.jpg",
//     rating: 5,
//     status: "Available",
//   },
//   {
//     id: 8,
//     title: "Eloquent JavaScript",
//     author: "Marijn Haverbeke",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754645070/el_ruimml.jpg",
//     rating: 4,
//     status: "Available",
//   },
//   {
//     id: 9,
//     title: "Practice of System and Network Administration",
//     author: "Thomas Limoncelli, Christina Hogan & Strata Chalup ",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754644753/network_mezj51.jpg",
//     rating: 5,
//     status: "Available",
//   },
//   // {
//   //   id: 10,
//   //   title: "A Heart So Fierce And Broken",
//   //   author: "Brigid Kemmerer",
//   //   image: "https://covers.openlibrary.org/b/id/9871196-L.jpg",
//   //   rating: 4,
//   //   status: "Out Of Stock",
//   // },
// ];

// export default function NewBookCollections() {
//   const [visibleCount, setVisibleCount] = useState(6);
//   const navigate = useNavigate();

//   const showMore = () => {
//     setVisibleCount((prev) => Math.min(prev + 4, books.length));
//   };

//   const showLess = () => {
//     setVisibleCount(6);
//   };

//   return (
//     <section className="mt-12">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-gray-800">NEW BOOK COLLECTIONS</h2>
//         <div className="flex items-center gap-2">
//           {visibleCount < books.length && (
//             <button
//               onClick={showMore}
//               className="flex items-center gap-1 text-sky-600 hover:text-sky-800"
//             >
//               Show More <ChevronRight className="w-4 h-4" />
//             </button>
//           )}
//           {visibleCount > 6 && (
//             <button
//               onClick={showLess}
//               className="flex items-center gap-1 text-sky-600 hover:text-sky-800"
//             >
//               <ChevronLeft className="w-4 h-4" /> Show Less
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//         {books.slice(0, visibleCount).map((book) => (
//           <div
//             key={book.id}
//             onClick={() =>
//               navigate(`/book/${book.id}`, {
//                 state: { fromSlider: book }, // ✅ pass the actual card data
//               })
//             }
//             className="cursor-pointer bg-white p-3 rounded shadow hover:shadow-md transition-all"
//           >
//             <img
//               src={book.image}
//               alt={book.title}
//               className="w-full h-40 object-cover rounded"
//             />
//             <h3 className="font-semibold text-sm mt-2 line-clamp-2 hover:text-sky-600">
//               {book.title}
//             </h3>
//             <p className="text-xs text-gray-500">{book.author}</p>
//             <div className="flex items-center mt-1">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`w-4 h-4 ${
//                     i < book.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//             <p
//               className={`text-xs font-semibold mt-1 ${
//                 book.status === "Available" ? "text-green-500" : "text-red-500"
//               }`}
//             >
//               {book.status}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }



// NewBookCollections.jsx



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Star, ChevronRight, ChevronLeft } from "lucide-react";

// const books = [
//   {
//     id: 1,
//     title: "Fundamentals of Software Testing, 2nd Edition",
//     author: " by Bernard Homès",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643480/d9_wxocuv.jpg",
//     rating: 4,
//     status: "Available",
//     category: "Development"
//   },
//   {
//     id: 2,
//     title: "The Coming Wave: AI, Power, and Our Future",
//     author: " Mustafa Suleyman",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643606/ai5_ua61lt.jpg",
//     rating: 4.8,
//     status: "Available",
//   },
//   {
//     id: 3,
//     title: "Co-Intelligence: Living and Working with AI",
//     author: "Ethan Mollick",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643734/ai6_mh7ans.jpg",
//     rating: 5,
//     status: "Out Of Stock",
//   },
//   {
//     id: 4,
//     title: "Ace the Data Science Interview: 201 Real Interview Questions Asked By FAANG, Tech Startups, & Wall Street",
//     author: " Nick Singh &  Kevin Huo",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643910/DS4_ifbyg1.jpg",
//     rating: 4.8,
//     status: "Out Of Stock",
//   },
//   {
//     id: 5,
//     title: "Python for Data Analysis",
//     author: "by Wes McKinney",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754644368/ds1_qqs3rd.jpg",
//     rating: 4,
//     status: "Available",
//   },
//   {
//     id: 6,
//     title: "Data Mining: Concepts and Techniques (The Morgan Kaufmann Series in Data Management Systems)",
//     author: "Jiawei Han, Jian Pei &  Hanghang Tong ",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754644513/datamining_oy6mhy.jpg",
//     rating: 5,
//     status: "Available",
//   },
//   {
//     id: 7,
//     title: "Python Crash Course",
//     author: "Eric Matthes",
//     image: "https://covers.openlibrary.org/b/id/8671733-L.jpg",
//     rating: 5,
//     status: "Available",
//   },
//   {
//     id: 8,
//     title: "Eloquent JavaScript",
//     author: "Marijn Haverbeke",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754645070/el_ruimml.jpg",
//     rating: 4,
//     status: "Available",
//   },
//   {
//     id: 9,
//     title: "Practice of System and Network Administration",
//     author: "Thomas Limoncelli, Christina Hogan & Strata Chalup ",
//     image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754644753/network_mezj51.jpg",
//     rating: 5,
//     status: "Available",
//   },
//   // {
//   //   id: 10,
//   //   title: "A Heart So Fierce And Broken",
//   //   author: "Brigid Kemmerer",
//   //   image: "https://covers.openlibrary.org/b/id/9871196-L.jpg",
//   //   rating: 4,
//   //   status: "Out Of Stock",
//   // },
// ];

// export default function NewBookCollections() {
//   // Start with first row (3 cards). "See More" reveals the second row (next 3).
//   const [visibleCount, setVisibleCount] = useState(3);
//   const navigate = useNavigate();

//   const showMore = () => setVisibleCount((prev) => Math.min(6, books.length));
//   const showLess = () => setVisibleCount(3);

//   // First 3 cards
//   const firstRow = books.slice(0, 3);
//   // Next 3 cards (revealed on See More)
//   const secondRow = books.slice(3, 6);

//   return (
//     <section className="mt-12">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-gray-800">NEW BOOK COLLECTIONS</h2>
//         <div className="flex items-center gap-2">
//           {visibleCount < Math.min(6, books.length) && (
//             <button
//               onClick={showMore}
//               className="flex items-center gap-1 text-sky-600 hover:text-sky-800"
//             >
//               See More <ChevronRight className="w-4 h-4" />
//             </button>
//           )}
//           {visibleCount > 3 && (
//             <button
//               onClick={showLess}
//               className="flex items-center gap-1 text-sky-600 hover:text-sky-800"
//             >
//               <ChevronLeft className="w-4 h-4" /> Show Less
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Row 1: always visible (3 cards on sm+, 2 on xs) */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-6 lg:gap-6">
//         {firstRow.map((book) => (
//           <div
//             key={book.id}
//             onClick={() =>
//               navigate(`/book/${book.id}`, {
//                 state: { fromSlider: book }, // ✅ pass the actual card data
//               })
//             }
//             className="cursor-pointer bg-white p-3 rounded shadow hover:shadow-md transition-all"
//           >
//             <img
//               src={book.image}
//               alt={book.title}
//               className="w-full h-40 object-cover rounded"
//             />
//             <h3 className="font-semibold text-sm mt-2 line-clamp-2 hover:text-sky-600">
//               {book.title}
//             </h3>
//             <p className="text-xs text-gray-500">{book.author}</p>
//             <div className="flex items-center mt-1">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`w-4 h-4 ${
//                     i < book.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//             <p
//               className={`text-xs font-semibold mt-1 ${
//                 book.status === "Available" ? "text-green-500" : "text-red-500"
//               }`}
//             >
//               {book.status}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Row 2: only appears after "See More" (same layout & gaps) */}
//       {visibleCount > 3 && (
//         <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-6 lg:gap-6">
//           {secondRow.map((book) => (
//             <div
//               key={book.id}
//               onClick={() =>
//                 navigate(`/book/${book.id}`, {
//                   state: { fromSlider: book },
//                 })
//               }
//               className="cursor-pointer bg-white p-3 rounded shadow hover:shadow-md transition-all"
//             >
//               <img
//                 src={book.image}
//                 alt={book.title}
//                 className="w-full h-40 object-cover rounded"
//               />
//               <h3 className="font-semibold text-sm mt-2 line-clamp-2 hover:text-sky-600">
//                 {book.title}
//               </h3>
//               <p className="text-xs text-gray-500">{book.author}</p>
//               <div className="flex items-center mt-1">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`w-4 h-4 ${
//                       i < book.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <p
//                 className={`text-xs font-semibold mt-1 ${
//                   book.status === "Available" ? "text-green-500" : "text-red-500"
//                 }`}
//               >
//                 {book.status}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }


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
  {
    id: 3,
    title: "Co-Intelligence: Living and Working with AI",
    author: "Ethan Mollick",
    image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643734/ai6_mh7ans.jpg",
    rating: 5,
    status: "Out Of Stock",
  },
  {
    id: 4,
    title: "Ace the Data Science Interview: 201 Real Interview Questions Asked By FAANG, Tech Startups, & Wall Street",
    author: " Nick Singh &  Kevin Huo",
    image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754643910/DS4_ifbyg1.jpg",
    rating: 4.8,
    status: "Out Of Stock",
  },
  {
    id: 5,
    title: "Python for Data Analysis",
    author: "by Wes McKinney",
    image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754644368/ds1_qqs3rd.jpg",
    rating: 4,
    status: "Available",
  },
  {
    id: 6,
    title: "Data Mining: Concepts and Techniques (The Morgan Kaufmann Series in Data Management Systems)",
    author: "Jiawei Han, Jian Pei &  Hanghang Tong ",
    image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754644513/datamining_oy6mhy.jpg",
    rating: 5,
    status: "Available",
  },
  {
    id: 7,
    title: "Python Crash Course",
    author: "Eric Matthes",
    image: "https://covers.openlibrary.org/b/id/8671733-L.jpg",
    rating: 5,
    status: "Available",
  },
  {
    id: 8,
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754645070/el_ruimml.jpg",
    rating: 4,
    status: "Available",
  },
  {
    id: 9,
    title: "Practice of System and Network Administration",
    author: "Thomas Limoncelli, Christina Hogan & Strata Chalup ",
    image: "https://res.cloudinary.com/dbm4aqhwi/image/upload/v1754644753/network_mezj51.jpg",
    rating: 5,
    status: "Available",
  },
  // {
  //   id: 10,
  //   title: "A Heart So Fierce And Broken",
  //   author: "Brigid Kemmerer",
  //   image: "https://covers.openlibrary.org/b/id/9871196-L.jpg",
  //   rating: 4,
  //   status: "Out Of Stock",
  // },
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
          image: book.book_cover_url || book.image || "",
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
                state: { fromSlider: book }, // ✅ pass the actual card data
              })
            }
            className="cursor-pointer bg-white p-3 rounded shadow hover:shadow-md transition-all"
          >
            <img
              src={book.image}
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
                  state: { fromSlider: book },
                })
              }
              className="cursor-pointer bg-white p-3 rounded shadow hover:shadow-md transition-all"
            >
              <img
                src={book.image}
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
