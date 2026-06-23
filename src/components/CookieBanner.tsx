"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  function acceptAll() {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      preferences: true,
      analytics: true,
      timestamp: Date.now(),
    }));
    setShow(false);
  }

  function acceptNecessary() {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      preferences: false,
      analytics: false,
      timestamp: Date.now(),
    }));
    setShow(false);
  }

  function openSettings() {
    // Could open a modal for granular control
    acceptAll();
  }

  if (!show) return null;

  return (
    <div
      className="fixed bottom-4 right-4 left-4 md:bottom-4 md:right-4 md:left-auto md:w-96 z-50 animate-slide-up"
      role="dialog"
      aria-label="Çerez tercihleri"
    >
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-montaj/20 rounded-lg flex items-center justify-center text-montaj flex-shrink-0">
            <svg className="w-5 h-5 text-montaj" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm0 4a1 1 0 110 2 1 1 0 010-2zm-4 8a1 1 0 110-2 1 1 0 010 2zm1-4a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zm-1 4a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2">Çerez Tercihleri</h3>
            <p className="text-sm text-muted-text mb-4">
              Deneyiminizi iyileştirmek, site trafiğini analiz etmek ve kişiselleştirilmiş içerik sunmak için çerezleri kullanıyoruz.
              <a href="/gizlilik" className="text-montaj hover:underline ml-1">Gizlilik Politikası</a> 
              ve <a href="/kullanim-kosullari" className="text-montaj hover:underline ml-1">Kullanım Koşulları</a> 
              nı inceleyebilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            variant="primary"
            onClick={acceptAll}
            className="flex-1"
          >
            Tümünü Kabul Et
          </Button>
          <Button
            variant="secondary"
            onClick={acceptNecessary}
            className="flex-1"
          >
            Sadece Zorunlular
          </Button>
          <Button
            variant="ghost"
            onClick={openSettings}
            className="flex-1"
          >
            Tercihler
          </Button>
        </div>
      </div>
    </div>
  );
}