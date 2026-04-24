import Link from "next/link";
import { SITE_NAME } from "@/lib/utils";

export const metadata = {
  title: `Page Not Found | ${SITE_NAME}`,
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-7xl mb-6">📰</p>
      <h1 className="text-[32px] font-black text-[#0A0A0A] mb-3 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-brand-muted text-base mb-8 leading-relaxed">
        The article or page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Check the URL or browse our latest news.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white
                     font-semibold text-sm px-6 py-3 rounded-full hover:bg-brand-blue-dark transition-colors"
        >
          ← Back to Home
        </Link>
        <Link
          href="/news"
          className="inline-flex items-center justify-center gap-2 bg-white text-[#374151]
                     font-semibold text-sm px-6 py-3 rounded-full border border-brand-border
                     hover:bg-brand-light transition-colors"
        >
          Browse All News
        </Link>
      </div>
    </div>
  );
}
