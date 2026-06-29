import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Provider from "@/components/Provider";
import CookieBanner from "@/components/CookieBanner";
import PushNotificationSetup from "@/components/PushNotificationSetup";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIAssistant from "@/components/AIAssistant";

/* ─── Typography ─────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Montajım Var - Profesyonel Montaj Platformu",
  description:
    "Kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturuyoruz. Mobilya, reklam, AVM, fuar standı ve elektrik montaj hizmetleri.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Montajım Var",
    startupImage: ["/apple-splash-icon.png"],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
    "apple-touch-fullscreen": "yes",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Montajım Var - Profesyonel Montaj Platformu",
    description:
      "Kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturuyoruz.",
    type: "website",
    locale: "tr_TR",
    siteName: "Montajım Var",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B5FFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        {/* Preconnect to Google Fonts (fallback) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//montajimvar.xyz" />
        {/* Font preload hints for swap fallback */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:opsz@14..32&display=swap"
          as="style"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap"
          as="style"
        />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col`}
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >
        <Provider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Montajım Var",
                url: "https://montajimvar.xyz",
                description:
                  "Kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturuyoruz.",
                inLanguage: "tr",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate:
                      "https://montajimvar.xyz/ara?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
              `,
            }}
          />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <PushNotificationSetup />
          <PwaInstallPrompt />
          <MobileBottomNav />
          <AIAssistant />
        </Provider>
      </body>
    </html>
  );
}
