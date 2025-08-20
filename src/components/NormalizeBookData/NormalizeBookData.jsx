export default function normalizeBookData(b) {
  if (!b) return null;

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
    title: b.name,
    authors: b.author || "Unknown",
    coverImage: b.book_cover_url,
    rating: b.average_rating ?? 0,
    ratingCount: b.rating_count ?? 0,
    category: b.category?.category_name ?? "General",
    pdfLink: b.pdf_file_url ?? "#",
    status: b.available_copies > 0 ? "Available" : "Out of Stock",
    summary: b.short_description || "",
    summaryTail: b.full_summary || null,
    availableCopies: b.available_copies ?? 0,
    totalCopies: b.total_copies ?? 0,
    audioSrc: pickAudio(b),
  };
}