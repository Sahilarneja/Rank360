"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl mb-6">⚠️</p>
      <h2 className="text-[28px] font-black text-[#0A0A0A] mb-3 tracking-tight">
        Something went wrong
      </h2>
      <p className="text-brand-muted text-sm mb-8">
        We hit an unexpected error. Please try again or go back to the homepage.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center bg-brand-blue text-white
                     font-semibold text-sm px-6 py-3 rounded-full hover:bg-brand-blue-dark transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-white text-[#374151]
                     font-semibold text-sm px-6 py-3 rounded-full border border-brand-border
                     hover:bg-brand-light transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
