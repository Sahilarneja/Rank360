import {
  getHeroArticles,
  getLatestArticles,
  getLiveUpdates,
  getArticlesByCategory,
  getHomepageInsights,
} from "@/lib/articles";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/utils";
import { EXAM_HUBS, EVERGREEN_GUIDES } from "@/lib/growth";
import LiveTicker from "@/components/ui/LiveTicker";
import HeroSection from "@/components/home/HeroSection";
import CategoryStrip from "@/components/home/CategoryStrip";
import LatestGrid from "@/components/home/LatestGrid";
import InsightSection from "@/components/home/InsightSection";
import TopicHubGrid from "@/components/home/TopicHubGrid";
import EvergreenGuideGrid from "@/components/home/EvergreenGuideGrid";
import AudienceSignup from "@/components/ui/AudienceSignup";
import AdUnit from "@/components/ads/AdUnit";

export const revalidate = 300; // ISR: revalidate every 5 min

export const metadata = {
  title: `${SITE_NAME} – India's Fastest Education News`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} – India's Fastest Education News`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
  },
};

export default async function HomePage() {
  let heroArticles = [], latestArticles = [], liveUpdates = [], insightArticles = [], insights = [];

  try {
    [heroArticles, latestArticles, liveUpdates, insightArticles, insights] = await Promise.all([
      getHeroArticles(),
      getLatestArticles({ skip: 5, limit: 9 }),
      getLiveUpdates(12),
      getArticlesByCategory("jee", 5),
      getHomepageInsights(3),
    ]);
  } catch (err) {
    console.error("HomePage data fetch error:", err.message);
  }

  const [featured, ...secondary] = heroArticles;

  return (
    <>
      {/* Live ticker */}
      <LiveTicker updates={liveUpdates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">

        {/* Hero */}
        <HeroSection featured={featured} secondary={secondary} />

        {/* Ad – below hero */}
        <div className="my-6">
          <AdUnit slot="1234567890" className="ad-slot w-full" />
        </div>

        {/* Category quick-links */}
        <CategoryStrip />

        {/* Latest news grid */}
        <LatestGrid articles={latestArticles} />

        <div className="content-auto">
          <TopicHubGrid hubs={EXAM_HUBS} />
        </div>

        {/* Ad – mid page */}
        <div className="my-6 content-auto">
          <AdUnit slot="0987654321" format="rectangle" className="ad-slot w-full max-w-xl mx-auto" />
        </div>

        <div className="content-auto">
          <EvergreenGuideGrid guides={EVERGREEN_GUIDES.slice(0, 4)} />
        </div>

        {/* Student insights */}
        <div className="content-auto">
          <InsightSection articles={insightArticles} insights={insights} />
        </div>

        <div className="content-auto">
          <AudienceSignup />
        </div>
      </div>
    </>
  );
}
