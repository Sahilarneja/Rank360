/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Whitelisted news image sources (RSS feeds)
      { protocol: "https", hostname: "**.ndtv.com" },
      { protocol: "https", hostname: "**.timesofindia.com" },
      { protocol: "https", hostname: "static.toiimg.com" },
      { protocol: "https", hostname: "**.hindustantimes.com" },
      { protocol: "https", hostname: "**.indiatoday.in" },
      { protocol: "https", hostname: "**.thehindu.com" },
      { protocol: "https", hostname: "**.livemint.com" },
      { protocol: "https", hostname: "**.jagran.com" },
      { protocol: "https", hostname: "**.aajtak.in" },
      { protocol: "https", hostname: "**.amarujala.com" },
      { protocol: "https", hostname: "**.bhaskar.com" },
      { protocol: "https", hostname: "**.news18.com" },
      { protocol: "https", hostname: "**.firstpost.com" },
      { protocol: "https", hostname: "**.scroll.in" },
      { protocol: "https", hostname: "**.thewire.in" },
      { protocol: "https", hostname: "**.edexlive.com" },
      { protocol: "https", hostname: "**.shiksha.com" },
      { protocol: "https", hostname: "**.careers360.com" },
      { protocol: "https", hostname: "**.collegedunia.com" },
      // Generic fallback for other CDNs
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.wp.com" },
      { protocol: "https", hostname: "**.wordpress.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400, // 24 hours — news images don't change
  },

  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Reduce JS bundle size via tree-shaking
  modularizeImports: {
    "date-fns": {
      transform: "date-fns/{{member}}",
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Allow Google AdSense and Analytics
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Aggressive caching for Next.js static chunks (hashed filenames = safe to cache forever)
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache fonts
      {
        source: "/_next/static/media/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache public static files
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache optimized images
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
