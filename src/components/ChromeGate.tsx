"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIAssistant from "@/components/AIAssistant";
import CookieBanner from "@/components/CookieBanner";
import PushNotificationSetup from "@/components/PushNotificationSetup";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

function isAdminPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === "/admin") return true;
  return pathname.startsWith("/admin/");
}

export function TopChrome() {
  const pathname = usePathname();
  if (isAdminPath(pathname)) return null;
  return <Navbar />;
}

export function BottomChrome() {
  const pathname = usePathname();
  const hide = isAdminPath(pathname);
  if (hide) return null;
  return (
    <>
      <Footer />
      <MobileBottomNav />
      <AIAssistant />
      <CookieBanner />
      <PushNotificationSetup />
      <PwaInstallPrompt />
    </>
  );
}
