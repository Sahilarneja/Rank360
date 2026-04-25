export default function TrustPanel({ article }) {
  if (!article) return null;

  return (
    <section className="rounded-news-lg border border-brand-border bg-white p-5">
      <p className="text-2xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-3">
        Trust Signals
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#111111] mb-1">Editorial Review</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            Reviewed by the Rank360 editorial desk for clarity, visible facts, and student relevance before publishing.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#111111] mb-1">Primary Source</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            {article.source_name
              ? `This page cites ${article.source_name} and links students back to the source notice when available.`
              : "This page is designed to connect students back to the original official or publisher source."}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#111111] mb-1">Update Cadence</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            Pages are refreshed as new admission, result, or counselling details arrive so search users see current context instead of stale snippets.
          </p>
        </div>
      </div>
    </section>
  );
}
