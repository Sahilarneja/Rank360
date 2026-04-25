import TopicHubGrid from "@/components/home/TopicHubGrid";
import AudienceSignup from "@/components/ui/AudienceSignup";
import { EXAM_HUBS } from "@/lib/growth";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const metadata = {
  title: `Exam Hubs | ${SITE_NAME}`,
  description: "Browse Rank360 topic hubs for JEE, NEET, CUET, admissions, and student decision pages.",
  alternates: { canonical: `${SITE_URL}/exams` },
};

export default function ExamsIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      <div className="mb-8">
        <p className="text-2xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-3">
          Growth Layer
        </p>
        <h1 className="text-[30px] md:text-[40px] font-black text-[#111111] mb-3">
          Exam Hubs
        </h1>
        <p className="text-[15px] text-brand-muted leading-relaxed max-w-3xl">
          These topic hubs group fresh updates, evergreen intent pages, and repeat-visit pathways so Rank360 can rank and retain users beyond one-off news clicks.
        </p>
      </div>

      <TopicHubGrid hubs={EXAM_HUBS} />
      <AudienceSignup />
    </div>
  );
}
