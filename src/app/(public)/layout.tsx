import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIAssistant from "@/components/AIAssistant";
import CookieBanner from "@/components/CookieBanner";
import PushNotificationSetup from "@/components/PushNotificationSetup";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
      <AIAssistant />
      <CookieBanner />
      <PushNotificationSetup />
      <PwaInstallPrompt />
    </>
  );
}
