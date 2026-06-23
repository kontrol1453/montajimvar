import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Provider from "@/components/Provider";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Montajım Var - Montaj Firmaları, Üreticiler ve Müşteriler Buluşuyor",
  description:
    "Türkiye'nin montaj platformu. Montaj firmaları, üreticiler ve müşterileri bir araya getiriyor. Şehrinizdeki güvenilir montajcıları bulun.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Montajım Var",
  },
  openGraph: {
    title: "Montajım Var - Montaj Firmaları Bulun",
    description:
      "Türkiye'nin montaj platformu. Güvenilir montajcıları bulun, iletişime geçin.",
    type: "website",
    locale: "tr_TR",
    siteName: "Montajım Var",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ff7a00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
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
                  "Türkiye'nin montaj platformu. Montaj firmaları, üreticiler ve müşterileri bir araya getiriyor.",
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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </Provider>
      </body>
    </html>
  );
}
