

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function Sidebar({ onSelect }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/category/list")
      .then((res) => {
        // Backend sends an array directly, so no .categories
        if (isMounted && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch(() => {
        if (isMounted) setCategories([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategory = (category) => {
    if (onSelect) {
      onSelect({ type: "category", value: category.name });
    } else {
      navigate("/all-genres", { state: { category: category.id } });
    }
  };

  const handleAllCategoriesClick = () => {
    if (onSelect) {
      onSelect({ type: "all" });
    } else {
      navigate("/all-genres", { state: { category: null } });
    }
  };

  return (
    <aside className="hidden md:block w-64 bg-white p-4 border-r border-gray-200 sticky top-28 overflow-y-auto space-y-6">
      <div>
        <h3 className="text-sm font-bold mb-2">CATEGORY</h3>
        <ul className="space-y-1 mb-2">
          <li>
            <button
              onClick={handleAllCategoriesClick}
              className="w-full text-left text-sm px-2 py-2 rounded block transition-all duration-200 text-gray-700 hover:bg-sky-100"
            >
              All Genres
            </button>
          </li>
        </ul>

        <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => handleCategory(cat)}
                className="w-full text-left text-sm px-2 py-2 rounded block transition-all duration-200 text-gray-700 hover:bg-sky-100"
              >
                {cat.name} <span className="text-gray-500 text-xs">({cat.book_count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

