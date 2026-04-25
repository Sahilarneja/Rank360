import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/utils";
import { AUDIENCE_CHANNELS } from "@/lib/growth";

const FOOTER_COLS = [
  {
    heading: "Exams",
    links: [
      { label: "JEE Hub", href: "/exams/jee" },
      { label: "NEET Hub", href: "/exams/neet" },
      { label: "CUET Hub", href: "/exams/cuet" },
      { label: "Admissions Hub", href: "/exams/admissions" },
      { label: "All Exam Hubs", href: "/exams" },
    ],
  },
  {
    heading: "Guides",
    links: [
      { label: "JEE Exam Date Guide", href: "/guides/jee-main-2026-exam-date-guide" },
      { label: "NEET Counselling Guide", href: "/guides/neet-2026-counselling-guide" },
      { label: "CUET Guide", href: "/guides/cuet-2026-syllabus-and-admission-guide" },
      { label: "JoSAA Cutoff Guide", href: "/guides/josaa-round-wise-cutoff-guide" },
      { label: "All Guides", href: "/guides" },
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
              <a href="https://twitter.com/rank360in" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-blue flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Telegram */}
              <a href={AUDIENCE_CHANNELS.telegram} aria-label="Telegram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0088cc] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href={AUDIENCE_CHANNELS.whatsapp} aria-label="WhatsApp" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
