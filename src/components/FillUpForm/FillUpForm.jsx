
// FillUpForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CalendarDays, Upload, Users, BookOpen, HelpCircle, LogOut } from "lucide-react";
import api from "../../api"; // your axios instance from api.js
import Sidebar from "../Sidebar/Sidebar";

export default function FillUpForm() {
  
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const books = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
  //   // Show ONLY the most recently added book in the form
  //   const lastOnly = books.length ? [books[books.length - 1]] : [];
  //   setBorrowedBooks(lastOnly);
  // }, []);
   useEffect(() => {
    // Get book from navigation state first
    const bookFromState = location.state?.book;
    
    // Fallback to localStorage if no state
    const booksFromStorage = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    
    if (bookFromState) {
      setBorrowedBooks([bookFromState]);
    } else if (booksFromStorage.length) {
      setBorrowedBooks([booksFromStorage[booksFromStorage.length - 1]]);
    }
  }, [location.state]);

  // Helper: compute whole-day difference from TODAY (local) to the selected return date.
  const calcBorrowDays = (returnDateStr) => {
    if (!returnDateStr) return "";
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const rtn = new Date(returnDateStr);
    const end = new Date(rtn.getFullYear(), rtn.getMonth(), rtn.getDate());
    const diffMs = end - start;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0; // never negative
  };

  const handleChange = (e, bookId) => {
    const { name, value } = e.target;

    // When Return Date changes, auto-calc Borrowing Days (no input field for days)
    if (name === "returnDate") {
      const autoDays = calcBorrowDays(value);
      setFormData((prev) => ({
        ...prev,
        [bookId]: {
          ...prev[bookId],
          returnDate: value,
          days: autoDays, // store computed value for submit
        },
      }));
      return;
    }

    // Other fields (e.g., Booked Timeline comments)
    setFormData((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        [name]: value,
      },
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    alert("Form submitted successfully!");
    // go directly to the user dashboard after success
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Library</h2>
          <ul className="space-y-3">
            <li>
              <a href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-sky-500 hover:underline underline-offset-4">
                <CalendarDays size={18} /> Dashboard
              </a>
            </li>
            <li>
              <a href="/upload" className="flex items-center gap-2 text-gray-700 hover:text-sky-500 hover:underline underline-offset-4">
                <Upload size={18} /> Upload Books
              </a>
            </li>
            <li>
              <a href="/fillup-form" className="flex items-center gap-2 text-sky-600 font-medium">
                <BookOpen size={18} /> Fill Up Form
              </a>
            </li>
            <li>
              <a href="/members" className="flex items-center gap-2 text-gray-700 hover:text-sky-500 hover:underline underline-offset-4">
                <Users size={18} /> Member
              </a>
            </li>
            <li>
              <a href="/checkout" className="flex items-center gap-2 text-gray-700 hover:text-sky-500 hover:underline underline-offset-4">
                <BookOpen size={18} /> Check-out Books
              </a>
            </li>
            <li>
              <a href="/help" className="flex items-center gap-2 text-gray-700 hover:text-sky-500 hover:underline underline-offset-4">
                <HelpCircle size={18} /> Help
              </a>
            </li>
          </ul>
        </div>
        <div>
          <a href="/logout" className="flex items-center gap-2 text-red-600 font-medium hover:underline underline-offset-4">
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Fill Up Book Borrow Form</h1>

        <div className="space-y-8">
          {borrowedBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-start gap-6">
                <img
                  src={book.coverImage || book.image}
                  alt={book.title}
                  className="w-28 h-36 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{book.authors}</p>

                  {/* Availability timeline (dummy) */}
                  <div className="bg-gray-50 border border-dashed border-gray-300 p-3 rounded mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Available from:</span> 12 Aug 2025<br />
                      <span className="font-medium">Must return by:</span> 19 Aug 2025
                    </p>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Borrowing Days: NO INPUT — auto-counted and displayed read-only */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Borrowing Days
                      </label>
                      <div className="w-full border rounded px-3 py-2 bg-gray-50">
                        {formData[book.id]?.days ?? "—"}
                      </div>
                    </div>

                    {/* Return Date (select this; days auto-calc) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Return Date
                      </label>
                      <input
                        type="date"
                        name="returnDate"
                        className="w-full border rounded px-3 py-2"
                        value={formData[book.id]?.returnDate || ""}
                        onChange={(e) => handleChange(e, book.id)}
                      />
                    </div>

                    {/* Booked Timeline — comments (unchanged design) */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Booked Timeline
                      </label>
                      <input
                        type="text"
                        name="availability"
                        placeholder="comments (optional)"
                        className="w-full border rounded px-3 py-2"
                        value={formData[book.id]?.availability || ""}
                        onChange={(e) => handleChange(e, book.id)}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleSubmit}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-md"
          >
            Booked
          </button>
        </div>
      </main>
    </div>
  );
}