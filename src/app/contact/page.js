import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const metadata = {
  title: `Contact Us | ${SITE_NAME}`,
  description: `Get in touch with the ${SITE_NAME} team for news tips, corrections, or partnerships.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-[30px] font-black text-[#0A0A0A] mb-2 tracking-tight">Contact Us</h1>
      <p className="text-brand-muted text-sm mb-10">
        Have a news tip, correction, or partnership inquiry? We&apos;d love to hear from you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          { icon: "📰", label: "News Tips", email: "tips@rank360.in", desc: "Share a story or correction" },
          { icon: "🤝", label: "Partnerships", email: "partner@rank360.in", desc: "Advertising & collaborations" },
          { icon: "⚖️", label: "Legal", email: "legal@rank360.in", desc: "DMCA, takedowns, legal notices" },
          { icon: "💬", label: "General", email: "hello@rank360.in", desc: "Everything else" },
        ].map((item) => (
          <a
            key={item.label}
            href={`mailto:${item.email}`}
            className="flex items-start gap-3 p-4 bg-white rounded-news shadow-card
                       hover:shadow-card-hover transition-all duration-200 group"
          >
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <div>
              <p className="font-bold text-[#111111] text-sm group-hover:text-brand-blue transition-colors">
                {item.label}
              </p>
              <p className="text-xs text-brand-muted mt-0.5">{item.desc}</p>
              <p className="text-xs text-brand-blue mt-1 font-medium">{item.email}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-brand-blue-light border border-blue-200 rounded-news-lg p-5">
        <h2 className="font-bold text-[#1e3a5f] mb-2">About Rank360</h2>
        <p className="text-sm text-[#1e3a5f] leading-relaxed">
          Rank360 is India&apos;s fastest education news platform, covering JEE, NEET, CUET,
          admissions, results, and college news. Our mission is to keep every student
          informed with accurate, timely, and student-first journalism.
        </p>
      </div>
    </div>
  );
}
