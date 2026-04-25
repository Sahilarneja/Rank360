"use client";

import Link from "next/link";

const TYPE_COLORS = {
  result: "bg-red-600",
  cutoff: "bg-orange-500",
  news: "bg-brand-blue",
};

export default function LiveTicker({ updates = [] }) {
  if (!updates.length) return null;

  // Duplicate items for seamless CSS loop — kept minimal (2x is the minimum needed)
  const items = [...updates, ...updates];

  return (
    <div className="bg-[#0A0A0A] text-white overflow-hidden" role="marquee" aria-label="Live updates">
      <div className="max-w-7xl mx-auto flex items-stretch">
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-red flex-shrink-0 z-10">
          <span className="live-dot" />
          <span className="text-2xs font-black uppercase tracking-widest whitespace-nowrap">
            Live
          </span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fade edges — use pointer-events-none so they don't block clicks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

          {/* will-change: transform promotes to GPU layer for smooth animation */}
          <div className="ticker-track py-2.5" style={{ willChange: "transform" }}>
            {items.map((update, i) => {
              const link = update.data?.link;
              const typeColor = TYPE_COLORS[update.type] || TYPE_COLORS.news;

              const inner = (
                <span className="inline-flex items-center gap-2 mx-6">
                  <span className={`${typeColor} text-white text-2xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
                    {update.type}
                  </span>
                  <span className="text-[13px] font-medium text-gray-200 whitespace-nowrap">
                    {update.title}
                  </span>
                </span>
              );

              return link ? (
                <Link key={i} href={link} className="hover:text-white">
                  {inner}
                </Link>
              ) : (
                <span key={i}>{inner}</span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
