export default function normalizeBookData(b) {
  if (!b) return null;
  console.log("Normalizing book data:", b);
  const pickAudio = (book) =>
    book?.audio ||
    book?.audioSrc ||
    book?.audioLink ||
    book?.audio_clip ||
    book?.audioURL ||
    book?.audio_file_url ||
    null;

  return {
    id: b.id,
    title:  b.name || "Untitled",
    authors: b.author || "Unknown",
    coverImage: b.book_cover_url ||
    "https://upload.wikimedia.org/wikipedia/en/7/78/Patterns_cover.jpg",
    rating: b.average_rating || b.rating || 0,
    ratingCount: b.review_count ||  0,
    category: b.category?.name  || "Uncategorized", // ✅ updated
    status: b.available_copies > 0 ? "Available" : "Out of Stock",
    summary: b.short_details || b.shortDetails || "",
    summaryTail: b.short_details || null,
    publisher: b.publisher || "",
     publishDate: b.publication_year || "",
    availableCopies: b.available_copies ?? 0,
    totalCopies: b.total_copies ?? 0,
    pdfLink: b.pdf_file_url || b.pdfLink || "",
    audioLink: b.audio_file_url || "",
    audioSrc: pickAudio(b),
  };
}