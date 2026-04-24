"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Pagination({ currentPage, totalPages, basePath = "/news" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`${basePath}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Build page range with ellipsis
  function getPages() {
    const pages = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      } else if (i === left - 1 || i === right + 1) {
        pages.push("...");
      }
    }
    return pages;
  }

  const pages = getPages();

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      {/* Prev */}
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-btn"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-brand-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={cn("page-btn", p === currentPage && "page-btn-active")}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-btn"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
