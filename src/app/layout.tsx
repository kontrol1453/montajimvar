import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { sanitizeJSONLD, escapeScriptBody } from "@/lib/sanitize";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://montajimvar.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Montajım Var - Profesyonel Montaj Platformu",
    template: "%s | Montajım Var",
  },
  description:
    "Kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturuyoruz. Mobilya, reklam, AVM, fuar standı ve elektrik montaj hizmetleri.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Montajım Var",
    startupImage: ["/apple-splash-icon.png"],
  },
  other: {},
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
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Montajım Var - Profesyonel Montaj Platformu",
    description:
      "Kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturuyoruz.",
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="dns-prefetch" href="//montajimvar.xyz" />
        <link rel="dns-prefetch" href="//*.supabase.co" />
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || ""} />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}
      >
        <Provider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: sanitizeJSONLD(JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Montajım Var",
                url: baseUrl,
                description:
                  "Kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturuyoruz.",
                inLanguage: "tr",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${baseUrl}/ara?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              })),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
__html: sanitizeJSONLD(JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Montajım Var",
              url: baseUrl,
              logo: `${baseUrl}/icon-512.png`,
              description:
                "Türkiye'nin profesyonel montaj platformu. Mobilya, klima, tabela, AVM, fuar standı, elektrik ve endüstriyel montaj.",
            })),
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: escapeScriptBody(`
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
`),
              }}
          />
          <GoogleAnalytics />
          {children}
        </Provider>
      </body>
    </html>
  );
}
