import { SITE_NAME, SITE_URL } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: `About Us | ${SITE_NAME}`,
  description: `Rank360 is India's fastest education news platform — built for students who refuse to miss a beat on JEE, NEET, CUET, admissions, and results.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-[30px] font-black text-[#0A0A0A] mb-2 tracking-tight">About Rank360</h1>
      <p className="text-sm text-brand-muted mb-10">India&apos;s Fastest Education News</p>

      <div className="space-y-8 text-[16px] leading-relaxed text-[#1a1a1a]">

        <section>
          <h2 className="text-[20px] font-bold mb-3">Who We Are</h2>
          <p>
            Rank360 is India&apos;s fastest education news platform, built for students who are
            serious about their future. We cover everything that matters — JEE, NEET, CUET,
            admissions, results, counselling, cutoffs, and every development in between. We
            don&apos;t slow down, we don&apos;t water things down, and we don&apos;t limit what
            we cover. If it affects a student&apos;s journey, it&apos;s on Rank360.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">Our Mission</h2>
          <p>
            India&apos;s exam calendar is relentless — results drop without warning, counselling
            windows open and close in days, and a single missed update can cost a student their
            seat. Rank360 exists to make sure that never happens. Our mission is to be the
            fastest, most reliable source of education news in the country — breaking updates
            the moment they happen, structured so students can act on them immediately. We are
            not a content farm. We are not a portal. We are a platform built to give every
            student in India an unfair advantage.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">Editorial Standards</h2>
          <p>
            Every update on Rank360 is sourced from official portals, established publishers,
            and verified news agencies. We do not publish rumours, speculative cutoffs, or
            unverified claims. When we report on an exam, a result, or a counselling round, we
            link back to the primary source so students can verify for themselves. Accuracy is
            non-negotiable — if we get something wrong, we correct it immediately and
            transparently. Got a tip or spotted an error? Reach us at{" "}
            <a href="mailto:tips@rank360.in" className="text-brand-blue underline">
              tips@rank360.in
            </a>
            .
          </p>
        </section>

        <section className="bg-brand-blue-light border border-blue-200 rounded-news-lg p-5">
          <h2 className="font-bold text-[#1e3a5f] mb-3">Get in Touch</h2>
          <p className="text-sm text-[#1e3a5f] leading-relaxed mb-4">
            News tip, correction, partnership, or just want to say something? We&apos;re
            listening.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white
                         bg-brand-blue px-4 py-2 rounded-news hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue
                         bg-white border border-brand-blue px-4 py-2 rounded-news
                         hover:bg-brand-blue-light transition-colors"
            >
              Browse Latest News
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
