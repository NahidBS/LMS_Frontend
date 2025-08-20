// BookCard.jsx
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function BookCard({ 
  id, 
  title, 
  author, 
  image, 
  rating = 0, 
  review_count = 0, 
  status = "Available" 
}) {
  return (
    <div className="cursor-pointer bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden hover:-translate-y-1 duration-200">
      <Link 
        to={`/book/${id}`}
        className="block"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div className="border-t border-gray-200 p-3">
        <Link to={`/book/${id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-sky-600 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500">{author}</p>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 transition-colors ${
                i < Math.round(rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({review_count})
          </span>
        </div>
        <p
          className={`text-xs font-semibold mt-1 transition-colors ${
            status === "Available" ? "text-green-600" : "text-red-500"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}