"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            send_page_view: true
          });

          // Track scroll depth
          let maxScroll = 0;
          window.addEventListener('scroll', function() {
            const scrollPct = Math.round(
              (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollPct > maxScroll && scrollPct % 25 === 0) {
              maxScroll = scrollPct;
              gtag('event', 'scroll_depth', {
                event_category: 'engagement',
                event_label: scrollPct + '%',
                value: scrollPct
              });
            }
          }, { passive: true });
        `}
      </Script>
    </>
  );
}
