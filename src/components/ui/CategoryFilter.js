"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getCategoryLabel, getCategoryColor, CATEGORIES, cn } from "@/lib/utils";

export default function CategoryFilter({ active }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(cat) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/news?${params.toString()}`);
  }

  const all = [null, ...CATEGORIES];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" role="tablist" aria-label="Filter by category">
      {all.map((cat) => {
        const isActive = cat === active || (!cat && !active);
        const label = cat ? getCategoryLabel(cat) : "All";
        const colorClass = cat ? getCategoryColor(cat) : "bg-gray-100 text-gray-700";

        return (
          <button
            key={cat ?? "all"}
            role="tab"
            aria-selected={isActive}
            onClick={() => setCategory(cat)}
            className={cn(
              "flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all duration-150",
              isActive
                ? "bg-brand-blue text-white border-brand-blue shadow-sm"
                : "bg-white text-[#374151] border-brand-border hover:border-brand-blue hover:text-brand-blue"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
