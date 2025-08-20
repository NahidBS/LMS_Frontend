import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  const getStatus = (b) => b.status || "Available";
  // console.log("BookCard rendered for:", book);
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden min-w-[240px] sm:min-w-[280px] snap-start flex flex-col">
      {/* Cover */}
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full h-40 object-cover"
      />

      {/* Card body */}
      <div className="border-t border-gray-200 p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
            {book.title}
          </h3>
          <p className="mt-1 text-xs text-gray-500">{book.category || "Category"}</p>
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
          <span className="mt-2 text-xs font-medium text-green-600">
            {getStatus(book)}
          </span>
        </div>

        {/* View Details button at the bottom */}
        <div className="mt-3">
          <Link
            to={`/book/${book.id}`}
            className="inline-block w-full text-center bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}