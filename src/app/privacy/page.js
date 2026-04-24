import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Privacy Policy for ${SITE_NAME} – how we collect, use, and protect your data.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-[30px] font-black text-[#0A0A0A] mb-2 tracking-tight">Privacy Policy</h1>
      <p className="text-sm text-brand-muted mb-10">Last updated: April 2024</p>

      <div className="prose-content space-y-8 text-[16px] leading-relaxed text-[#1a1a1a]">

        <section>
          <h2 className="text-[20px] font-bold mb-3">1. Information We Collect</h2>
          <p>Rank360 collects minimal data to provide our news service. We may collect:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Usage data via Google Analytics (page views, scroll depth, time on page)</li>
            <li>Device and browser information for performance optimization</li>
            <li>IP addresses for security and fraud prevention (not stored long-term)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">2. How We Use Your Information</h2>
          <p>We use collected data solely to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Improve site performance and user experience</li>
            <li>Understand which content is most useful to students</li>
            <li>Serve relevant advertisements via Google AdSense</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">3. Google AdSense & Cookies</h2>
          <p>
            We use Google AdSense to display advertisements. Google may use cookies to serve ads
            based on your prior visits to our site or other sites. You can opt out of personalized
            advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" className="text-brand-blue underline" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">4. Third-Party Links</h2>
          <p>
            Our articles may contain links to external websites. We are not responsible for the
            privacy practices of those sites. We encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">5. Data Retention</h2>
          <p>
            We do not store personal user data on our servers. Analytics data is retained by
            Google Analytics per their data retention settings (default: 14 months).
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">6. Children&apos;s Privacy</h2>
          <p>
            Rank360 is an educational news platform intended for students aged 16 and above.
            We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">7. Contact Us</h2>
          <p>
            For any privacy-related questions, contact us at:{" "}
            <a href="mailto:privacy@rank360.in" className="text-brand-blue underline">
              privacy@rank360.in
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
