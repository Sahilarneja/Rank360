import Link from "next/link";
import { AUDIENCE_CHANNELS } from "@/lib/growth";

export default function AudienceSignup({
  compact = false,
  title = "Get exam updates before the rush",
  body = "Join Rank360 on Telegram, WhatsApp, or email so result notices, counselling rounds, and admission alerts reach students faster than search alone.",
}) {
  return (
    <section className={`rounded-news-lg border border-brand-border bg-brand-light ${compact ? "p-5" : "p-6 md:p-7"}`}>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-2">
            Build Repeat Users
          </p>
          <h2 className={`${compact ? "text-[20px]" : "text-[26px]"} font-black text-[#0A0A0A] leading-tight`}>
            {title}
          </h2>
          <p className="text-sm text-brand-muted mt-2 leading-relaxed">
            {body}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={AUDIENCE_CHANNELS.telegram}
            className="inline-flex items-center gap-2 rounded-full bg-[#0088cc] px-4 py-2 text-xs font-bold text-white hover:bg-[#0077b8] transition-colors"
          >
            Telegram
          </Link>
          <Link
            href={AUDIENCE_CHANNELS.whatsapp}
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white hover:bg-[#1fb65a] transition-colors"
          >
            WhatsApp
          </Link>
          <Link
            href={AUDIENCE_CHANNELS.newsletter}
            className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-xs font-bold text-white hover:bg-brand-blue-dark transition-colors"
          >
            Email Alerts
          </Link>
        </div>
      </div>
    </section>
  );
}
