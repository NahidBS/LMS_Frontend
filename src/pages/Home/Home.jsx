
import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import FeaturedBanner from "../../components/FeaturedBanner/FeaturedBanner";
import { useNavigate } from "react-router-dom";
import {
  Filter,
} from "lucide-react";
import Slider from "../../components/Slider/Slider";
import api from "../../api";
import normalizeBookData from "../../components/NormalizeBookData/NormalizeBookData";

export default function Home() {
  const [filter, setFilter] = useState(null);
  const [openFilters, setOpenFilters] = useState(false); // mobile sidebar
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState();
  const [popular, setPopular] = useState();
  const [newBookCollections, setNewBookCollections] = useState();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // const normalizeBookData = (book) => ({
  //   id: book.id,
  //   title: book.title,
  //   author: book.author,
  //   coverUrl: book.book_cover_url,
  // });

  const fetchBookData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const [recommendedResponse, popularResponse, newBookCollectionsResponse] =
        await Promise.all([
          api.get("/book/recommended-books"),
          api.get("/book/popular-books"),
          api.get("/book/new-collection"),
        ]);

  //     setRecommended(recommendedResponse.data.map(normalizeBookData));
  //     setPopular(popularResponse.data.map(normalizeBookData));
  //     setNewBookCollections(newBookCollectionsResponse.data.map(normalizeBookData));
  //   } catch (error) {
  //     console.error("Error fetching book data:", error);
  //     setErrorMsg("Failed to load book data. Please try again later.\n".error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Adjust depending on API shape
      const recData = recommendedResponse.data || [];
      const popData =  popularResponse.data || [];
      const newData = newBookCollectionsResponse.data || [];

      setRecommended(recData.map(normalizeBookData));
      // console.log("Recommended Books:", recData);
      setPopular(popData.map(normalizeBookData));
      setNewBookCollections(newData.map(normalizeBookData));
    } catch (error) {
      console.error("Error fetching book data:", error);
      setErrorMsg("Failed to load book data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookData();
  }, []);

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (errorMsg) {
    return <p className="text-red-500">{errorMsg}</p>;
  }

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content (centered container) */}
      <div className="mx-auto max-w-7xl w-full flex flex-col md:flex-row px-4 sm:px-6 lg:px-8 py-4 gap-4">
        {/* Desktop/Tablet Sidebar */}
        {/* <aside className="hidden md:block w-full md:w-64 lg:w-72 flex-none md:sticky md:top-20"> */}
          <Sidebar />
        {/* </aside> */}

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Filters Button */}
          <div className="md:hidden mb-3">
            <button
              type="button"
              onClick={() => setOpenFilters(true)}
              className="inline-flex items-center gap-2 border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 rounded-md"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm"> */}
            <>
              <Slider
                title="Recommended"
                items={recommended}

              />
          
              <Slider
                title="Popular"
                items={popular}

              />
          
              <Slider
                title="New Book Collections"
                items={newBookCollections}

              />
            </>
          {/* </div> */}
        </main>
      </div>

      {/* Center the banner to match the content width */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FeaturedBanner />
      </div>
    </div>
  );
}