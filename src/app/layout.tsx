import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Provider from "@/components/Provider";

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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
