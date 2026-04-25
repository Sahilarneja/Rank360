import EvergreenGuideGrid from "@/components/home/EvergreenGuideGrid";
import AudienceSignup from "@/components/ui/AudienceSignup";
import { EVERGREEN_GUIDES } from "@/lib/growth";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const metadata = {
  title: `Guides | ${SITE_NAME}`,
  description: "Browse Rank360 evergreen guides for JEE, NEET, CUET, counselling, cutoffs, and admissions intent.",
  alternates: { canonical: `${SITE_URL}/guides` },
};

export default function GuidesIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      <div className="mb-8">
        <p className="text-2xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-3">
          Evergreen Pages
        </p>
        <h1 className="text-[30px] md:text-[40px] font-black text-[#111111] mb-3">
          Guides Built for Search Intent
        </h1>
        <p className="text-[15px] text-brand-muted leading-relaxed max-w-3xl">
          These pages target recurring demand like exam dates, counselling, cutoffs, and syllabus queries while supporting the fresh news cycle through internal links.
        </p>
      </div>

      <EvergreenGuideGrid guides={EVERGREEN_GUIDES} />
      <AudienceSignup />
    </div>
  );
}
