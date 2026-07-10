import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Provider from "@/components/Provider";
import CookieBanner from "@/components/CookieBanner";
import PushNotificationSetup from "@/components/PushNotificationSetup";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIAssistant from "@/components/AIAssistant";

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
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//montajimvar.xyz" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:opsz@14..32&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap"
        />
      </head>
      <body
        className="min-h-screen flex flex-col"
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
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Montajım Var",
                url: "https://montajimvar.xyz",
                logo: "https://montajimvar.xyz/icon-512.png",
                description:
                  "Türkiye'nin profesyonel montaj platformu. Mobilya, klima, tabela, AVM, fuar standı, elektrik ve endüstriyel montaj.",
                sameAs: [
                  "https://www.linkedin.com/company/montajimvar",
                  "https://twitter.com/montajimvar",
                  "https://www.instagram.com/montajimvar",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+90-212-000-00-00",
                  contactType: "customer service",
                  availableLanguage: "Turkish",
                },
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "TR",
                  addressLocality: "İstanbul",
                  addressRegion: "İstanbul",
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
