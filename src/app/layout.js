import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import AdSenseScript from "@/components/ads/AdSenseScript";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – India's Fastest Education News`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "JEE Main 2024", "NEET 2024", "CUET 2024",
    "college admissions India", "JEE result", "NEET counselling",
    "education news India", "JEE cutoff", "NEET cutoff",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} – India's Fastest Education News`,
    description: SITE_DESCRIPTION,
    images: [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – India's Fastest Education News`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-default.jpg`],
  },
  alternates: { canonical: SITE_URL },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563EB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <AdSenseScript />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
