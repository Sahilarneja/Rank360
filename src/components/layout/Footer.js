import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/utils";

const FOOTER_COLS = [
  {
    heading: "Exams",
    links: [
      { label: "JEE Main", href: "/news?category=jee" },
      { label: "JEE Advanced", href: "/news?category=jee" },
      { label: "NEET UG", href: "/news?category=neet" },
      { label: "NEET PG", href: "/news?category=neet" },
      { label: "CUET UG", href: "/news?category=cuet" },
      { label: "CUET PG", href: "/news?category=cuet" },
    ],
  },
  {
    heading: "Admissions",
    links: [
      { label: "JoSAA Counselling", href: "/news?category=admissions" },
      { label: "MCC Counselling", href: "/news?category=admissions" },
      { label: "DU Admissions", href: "/news?category=admissions" },
      { label: "Cutoffs 2024", href: "/news?category=results" },
      { label: "Seat Allotment", href: "/news?category=admissions" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "All News", href: "/news" },
      { label: "Sitemap", href: "/sitemap.xml" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-white mt-20">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-brand-blue via-violet-500 to-brand-blue" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-0.5 mb-4">
              <span className="text-[22px] font-black text-brand-blue">Rank</span>
              <span className="text-[22px] font-black text-white">360</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex gap-3">
              {/* Twitter/X */}
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-blue flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Telegram */}
              <a href="#" aria-label="Telegram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0088cc] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {year} {SITE_NAME}. All rights reserved. For students, by students.
          </p>
          <p className="text-xs text-gray-600">
            Built with ❤️ in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
