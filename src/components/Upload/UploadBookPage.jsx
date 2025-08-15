// UploadBookPage.jsx
import { useState } from "react";
import {
  CalendarDays,
  Upload,
  Users,
  BookOpen,
  HelpCircle,
  LogOut,
  Image as ImageIcon,
  FileText,
  FileAudio,
  Loader2,
  CheckCircle2,
  PartyPopper,
  X,
} from "lucide-react";

export default function UploadBookPage() {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    mainCategory: "",
    quantity: "",
    description: "",
  });

  // Upload states
  const [coverPreview, setCoverPreview] = useState(null);
  const [pdfSelected, setPdfSelected] = useState(false);
  const [audioSelected, setAudioSelected] = useState(false);

  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const [files, setFiles] = useState({
    cover: null,
    pdf: null,
    audio: null,
  });

  // Success Popup
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const simulateDelay = (ms = 3000) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingCover(true);
    setFiles((prev) => ({ ...prev, cover: file }));
    await simulateDelay(3000);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setLoadingCover(false);
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingPDF(true);
    setFiles((prev) => ({ ...prev, pdf: file }));
    await simulateDelay(3000);
    setPdfSelected(true);
    setLoadingPDF(false);
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingAudio(true);
    setFiles((prev) => ({ ...prev, audio: file }));
    await simulateDelay(3000);
    setAudioSelected(true);
    setLoadingAudio(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...bookData,
      hasCoverImage: !!files.cover,
      hasPDF: !!files.pdf,
      hasAudio: !!files.audio,
    };
    console.log("Book submitted:", payload, files);

    // Show animated success popup
    setShowSuccess(true);

    // Auto-close after 2.5s
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Library</h2>
          <ul className="space-y-3">
            <li>
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500"
              >
                <CalendarDays size={18} /> Dashboard
              </a>
            </li>
            <li>
              <a
                href="/upload"
                className="flex items-center gap-2 text-sky-600 font-medium"
              >
                <Upload size={18} /> Upload Books
              </a>
            </li>
            <li>
              <a
                href="/fillup-form"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500"
              >
                <BookOpen size={18} /> Fill Up Form
              </a>
            </li>
            <li>
              <a
                href="/members"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500"
              >
                <Users size={18} /> Member
              </a>
            </li>
            <li>
              <a
                href="/checkout"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500"
              >
                <BookOpen size={18} /> Check-out Books
              </a>
            </li>
            <li>
              <a
                href="/help"
                className="flex items-center gap-2 text-gray-700 hover:text-sky-500"
              >
                <HelpCircle size={18} /> Help
              </a>
            </li>
          </ul>
        </div>
        <div>
          <a
            href="/logout"
            className="flex items-center gap-2 text-red-600 font-medium"
          >
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h1>
        <p className="text-sm text-gray-500 mb-8">
          Fill in the details below to add a new book to the library database.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT SECTION */}
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Book Title"
                value={bookData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />

              {/* Changed to input field */}
              <input
                type="text"
                name="mainCategory"
                placeholder="Category / Genre"
                value={bookData.mainCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />

              <input
                type="number"
                name="quantity"
                placeholder="Quantity Available"
                value={bookData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />

              <textarea
                name="description"
                rows="4"
                placeholder="Description (Optional)"
                value={bookData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />
            </div>

            {/* RIGHT SECTION */}
            <div className="space-y-4">
              <input
                type="text"
                name="author"
                placeholder="Author Name"
                value={bookData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />

              {/* Cover Image Upload */}
              <div className="bg-gray-100 border rounded px-4 py-6 text-center space-y-3">
                <p className="text-sm text-gray-700 font-medium">
                  Cover image upload
                </p>

                {!coverPreview && !loadingCover && (
                  <p className="text-sm text-gray-600">
                    Drag & Drop or{" "}
                    <label className="text-sky-600 underline cursor-pointer">
                      Choose image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                  </p>
                )}

                {loadingCover && (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-sm">Uploading cover…</span>
                  </div>
                )}

                {coverPreview && !loadingCover && (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-28 h-36 object-cover rounded shadow"
                    />
                    <div className="flex items-center gap-2 text-gray-700">
                      <ImageIcon size={18} />
                      <span className="text-sm">Image uploaded</span>
                    </div>
                  </div>
                )}
              </div>

              {/* PDF File Upload */}
              <div className="bg-gray-100 border rounded px-4 py-6 text-center space-y-3">
                <p className="text-sm text-gray-700 font-medium">PDF file upload</p>

                {!pdfSelected && !loadingPDF && (
                  <p className="text-sm text-gray-600">
                    Drag & Drop or{" "}
                    <label className="text-sky-600 underline cursor-pointer">
                      Choose PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePDFUpload}
                        className="hidden"
                      />
                    </label>
                  </p>
                )}

                {loadingPDF && (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-sm">Uploading PDF…</span>
                  </div>
                )}

                {pdfSelected && !loadingPDF && (
                  <div className="flex flex-col items-center gap-2 text-gray-700">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                      <FileText className="text-red-500" size={28} />
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      PDF uploaded
                    </span>
                  </div>
                )}
              </div>

              {/* Audio Clip Upload */}
              <div className="bg-gray-100 border rounded px-4 py-6 text-center space-y-3">
                <p className="text-sm text-gray-700 font-medium">
                  Audio clip upload
                </p>

                {!audioSelected && !loadingAudio && (
                  <p className="text-sm text-gray-600">
                    Drag & Drop or{" "}
                    <label className="text-sky-600 underline cursor-pointer">
                      Choose audio
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="hidden"
                      />
                    </label>
                  </p>
                )}

                {loadingAudio && (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-sm">Uploading audio…</span>
                  </div>
                )}

                {audioSelected && !loadingAudio && (
                  <div className="flex flex-col items-center gap-2 text-gray-700">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
                      <FileAudio className="text-indigo-600" size={28} />
                    </span>
                    <span className="text-sm font-medium text-indigo-700">
                      Audio uploaded
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-4 mt-4">
                <button
                  type="button"
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                  onClick={() => {
                    // Reset form and uploads
                    setBookData({
                      title: "",
                      author: "",
                      mainCategory: "",
                      quantity: "",
                      description: "",
                    });
                    setFiles({ cover: null, pdf: null, audio: null });
                    setCoverPreview(null);
                    setPdfSelected(false);
                    setAudioSelected(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
                >
                  Confirm Book
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Animated Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 animate-fade-in" />

          {/* Card */}
          <div
            className="
              relative z-10 w-[90%] max-w-md rounded-2xl bg-white shadow-xl
              px-6 py-8 text-center
              transition-all duration-300 ease-out
              opacity-100 scale-100
              animate-[pop_0.28s_ease-out]
            "
          >
            <button
              className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowSuccess(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mx-auto mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
              <CheckCircle2 className="text-emerald-600" size={36} />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
              Book Uploaded Successfully
              <PartyPopper className="text-amber-500 animate-bounce" size={20} />
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Your book information and files have been recorded.
            </p>
          </div>

          {/* Tiny CSS keyframes via style tag for pop + backdrop fade */}
          <style>{`
            @keyframes pop {
              0% { transform: scale(0.9); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-fade-in {
              animation: fade-in 0.25s ease-out forwards;
            }
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}