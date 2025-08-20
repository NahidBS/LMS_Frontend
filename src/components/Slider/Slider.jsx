import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "../BookCard/BookCard";
import { useRef } from "react";

export default function Slider({ title, items }) {
  const rowRef = useRef();

  const scrollByAmount = (dir) => {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.9; // scroll ~90% width
    rowRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="mb-8 rounded-lg border border-gray-300 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-white flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {title}
        </h2>

        {/* Arrows (desktop) */}
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scrollByAmount(-1)}
            className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollByAmount(1)}
            className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Divider & Scroller */}
      <div className="border-t border-gray-200 relative bg-white">
        {/* Edge fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent" />

        {/* Horizontal scroller */}
        <div
          ref={rowRef}
          className="overflow-x-auto no-scrollbar"
        >
          <div className="flex gap-5 p-3 sm:p-4 snap-x snap-mandatory">
            {items.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>

        {/* Mobile arrows */}
        <div className="sm:hidden absolute inset-y-0 left-1 flex items-center">
          <button
            onClick={() => scrollByAmount(-1)}
            className="p-2 rounded-md border border-gray-300 bg-white/90 hover:bg-white shadow"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="sm:hidden absolute inset-y-0 right-1 flex items-center">
          <button
            onClick={() => scrollByAmount(1)}
            className="p-2 rounded-md border border-gray-300 bg-white/90 hover:bg-white shadow"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}