import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIAssistant from "@/components/AIAssistant";
import CookieBanner from "@/components/CookieBanner";
import PushNotificationSetup from "@/components/PushNotificationSetup";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import { sanitizeJSONLD } from "@/lib/sanitize";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizeJSONLD(JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://montajimvar.xyz" },
            ],
          })),
        }}
      />
      <a href="#main-content" className="skip-link">
        İçeriğe geç
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
      <Footer />
      <MobileBottomNav />
      <AIAssistant />
      <CookieBanner />
      <PushNotificationSetup />
      <PwaInstallPrompt />
    </>
  );
}
