"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AdUnit – safe AdSense wrapper.
 * - Only pushes when container has real width
 * - Catches and silently swallows AdSense errors (no slot size, etc.)
 * - Falls back to a placeholder when ADSENSE_ID is not configured
 */
export default function AdUnit({ slot, format = "auto", className = "" }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const containerRef = useRef(null);
  const pushed = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait until the container is painted and has real width
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0 && !pushed.current) {
          setReady(true);
          observer.disconnect();
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ready || !adsenseId || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Silently ignore — common in dev / no real publisher ID
    }
  }, [ready, adsenseId]);

  // No publisher ID configured → show placeholder
  if (!adsenseId) {
    return (
      <div
        className={`ad-slot ${className}`}
        aria-label="Advertisement"
        role="complementary"
      >
        <span className="text-xs text-brand-muted">Advertisement</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} aria-label="Advertisement" role="complementary">
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
