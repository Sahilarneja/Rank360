"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS, cn } from "@/lib/utils";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/news?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <>
      {/* ── Breaking bar ──────────────────────────────────────── */}
      <div className="bg-brand-blue text-white text-2xs font-semibold tracking-wide py-1.5 px-4 text-center hidden sm:block">
        🎓 India&apos;s #1 Education News Platform — JEE · NEET · CUET · Admissions · Results
      </div>

      {/* ── Main header ───────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-white transition-shadow duration-200",
          scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.10)]" : "shadow-nav"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5 flex-shrink-0 group">
              <span className="text-[26px] font-black text-brand-blue tracking-tight leading-none group-hover:opacity-90 transition-opacity">
                Rank
              </span>
              <span className="text-[26px] font-black text-brand-dark tracking-tight leading-none group-hover:opacity-90 transition-opacity">
                360
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/news" && pathname + "" === link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3.5 py-2 text-[13.5px] font-semibold rounded-md transition-colors duration-150",
                      active
                        ? "text-brand-blue bg-brand-blue-light"
                        : "text-[#374151] hover:text-brand-blue hover:bg-brand-blue-light"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-md text-[#6B7280] hover:text-brand-blue hover:bg-brand-blue-light transition-colors"
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>

              {/* Mobile menu */}
              <button
                className="md:hidden p-2 rounded-md text-[#6B7280] hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3 animate-fade-in">
              <form onSubmit={handleSearch} className="relative">
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search JEE, NEET, CUET, admissions…"
                  className="w-full h-10 pl-4 pr-10 rounded-news border border-brand-border
                             text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue
                             focus:border-transparent bg-brand-light"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-blue"
                  aria-label="Submit search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <nav
            className="md:hidden border-t border-brand-border bg-white px-4 py-3 animate-fade-in"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 text-sm font-semibold text-[#374151]
                             hover:text-brand-blue hover:bg-brand-blue-light rounded-md transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
