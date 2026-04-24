import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const metadata = {
  title: `Terms of Use | ${SITE_NAME}`,
  description: `Terms of Use for ${SITE_NAME}. Read our terms before using the platform.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-[30px] font-black text-[#0A0A0A] mb-2 tracking-tight">Terms of Use</h1>
      <p className="text-sm text-brand-muted mb-10">Last updated: April 2024</p>

      <div className="space-y-8 text-[16px] leading-relaxed text-[#1a1a1a]">

        <section>
          <h2 className="text-[20px] font-bold mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing Rank360 (<strong>rank360.in</strong>), you agree to these Terms of Use.
            If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">2. Content & Accuracy</h2>
          <p>
            Rank360 aggregates and publishes education news for informational purposes only.
            While we strive for accuracy, we do not guarantee the completeness or timeliness
            of any information. Always verify critical information (exam dates, results, cutoffs)
            from official sources such as NTA, MCC, and respective university websites.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">3. Intellectual Property</h2>
          <p>
            All original content on Rank360 is owned by Rank360. Aggregated news content
            is attributed to its original sources. Reproduction of our original content
            without permission is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">4. Advertisements</h2>
          <p>
            Rank360 displays advertisements via Google AdSense. We are not responsible for
            the content of third-party advertisements. Ad content does not constitute
            endorsement by Rank360.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">5. Limitation of Liability</h2>
          <p>
            Rank360 shall not be liable for any decisions made based on information published
            on this platform. Use of this site is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">6. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Continued use of the
            site after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold mb-3">7. Contact</h2>
          <p>
            Questions about these terms?{" "}
            <a href="mailto:legal@rank360.in" className="text-brand-blue underline">
              legal@rank360.in
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
