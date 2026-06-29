"use client";

import { useState, useEffect, useCallback } from "react";

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64: string) {
  const padded = base64.replace(/=+$/, "");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone() {
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isSupported(): boolean {
  if (!("Notification" in window)) return false;
  if (!("serviceWorker" in navigator)) return false;
  if (!VAPID_KEY) return false;
  if (isIOS() && !isStandalone()) return false;
  return true;
}

export default function PushNotificationSetup() {
  const [status, setStatus] = useState<string>("loading");
  const [dismissed, setDismissed] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isPWAMode, setIsPWAMode] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const ios = isIOS();
    const pwa = isStandalone();
    setIsIOSDevice(ios);
    setIsPWAMode(pwa);

    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((session) => {
        setUserId(session?.user?.id || null);
      })
      .catch(() => setUserId(null));
  }, []);

  useEffect(() => {
    if (userId === null) {
      setStatus("no-session");
      return;
    }

    if (!isSupported()) {
      setStatus("unsupported");
      return;
    }

    if (!userId) {
      setStatus("no-session");
      return;
    }

    if (Notification.permission === "granted") {
      setStatus("granted");
      registerSubscription();
    } else if (Notification.permission === "denied") {
      setStatus("denied");
    } else {
      setStatus("prompt");
    }
  }, [userId]);

  const registerSubscription = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY!),
      });

      const pushUrl = process.env.NEXT_PUBLIC_PUSH_SERVICE_URL || "http://localhost:3001";
      const res = await fetch(`${pushUrl}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          endpoint: sub.endpoint,
          keys: { p256dh: arrayBufferToBase64(sub.getKey("p256dh")!), auth: arrayBufferToBase64(sub.getKey("auth")!) },
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) {
        console.error("Push subscription failed:", await res.text());
        return false;
      }
      return true;
    } catch (err) {
      console.error("Push subscription error:", err);
      return false;
    }
  }, [userId]);

  const handleEnable = useCallback(async () => {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      const subscribed = await registerSubscription();
      if (subscribed) {
        setStatus("granted");
      } else {
        setStatus("prompt");
      }
    } else {
      setStatus("denied");
    }
  }, [registerSubscription]);

  if (dismissed || status === "loading" || status === "granted") return null;

  if (status === "unsupported" && isIOSDevice && !isPWAMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-dark-card border border-dark-border rounded-xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">&#x1F4F1;</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium">Bildirimleri Ac</p>
            <p className="text-xs text-sub-text mt-1">
              Bildirimleri almak icin Safari paylas menusunden{" "}
              <strong>Ana Ekrana Ekle</strong> yapin, ardindan uygulamadan
              bildirimlere izin verin.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setDismissed(true)}
                className="px-3 py-1.5 text-xs font-medium bg-montaj text-black rounded-lg hover:opacity-90 transition"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unsupported") return null;

  if (status === "no-session") {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-dark-card border border-dark-border rounded-xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">&#x1F514;</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium">Bildirimler</p>
            <p className="text-xs text-sub-text mt-1">
              Bildirimleri almak icin giris yapmaniz gerekiyor.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setDismissed(true)}
                className="px-3 py-1.5 text-xs font-medium bg-montaj text-black rounded-lg hover:opacity-90 transition"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-dark-card border border-dark-border rounded-xl p-4 shadow-2xl">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">&#x1F514;</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">Bildirimleri Ac</p>
          <p className="text-xs text-sub-text mt-1">
            Yeni mesaj ve firma bildirimlerini aninda alin.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              className="px-3 py-1.5 text-xs font-medium bg-montaj text-black rounded-lg hover:opacity-90 transition"
            >
              Izin Ver
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 text-xs text-sub-text hover:text-white transition"
            >
              Simdi Degil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
