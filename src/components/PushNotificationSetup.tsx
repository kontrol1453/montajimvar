"use client";

import { useState, useEffect, useCallback } from "react";

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padded = base64.replace(/=+$/, "");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export default function PushNotificationSetup() {
  const [status, setStatus] = useState<"loading" | "unsupported" | "denied" | "granted" | "prompt">("loading");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !VAPID_KEY) {
      setStatus("unsupported");
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
  }, []);

  const registerSubscription = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY!),
      });

      // Get current user from session
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const userId = session?.user?.id;
      if (!userId) return; // not logged in

      const pushUrl = process.env.NEXT_PUBLIC_PUSH_SERVICE_URL || "http://localhost:3001";
      await fetch(`${pushUrl}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          endpoint: sub.endpoint,
          keys: { p256dh: arrayBufferToBase64(sub.getKey("p256dh")!), auth: arrayBufferToBase64(sub.getKey("auth")!) },
          userAgent: navigator.userAgent,
        }),
      });
    } catch {
      // user cancelled or error
    }
  }, []);

  const handleEnable = useCallback(async () => {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      setStatus("granted");
      await registerSubscription();
    } else {
      setStatus("denied");
    }
  }, [registerSubscription]);

  if (dismissed || status === "loading" || status === "unsupported" || status === "granted") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-dark-card border border-dark-border rounded-xl p-4 shadow-2xl">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">🔔</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">Bildirimleri Aç</p>
          <p className="text-xs text-sub-text mt-1">
            Yeni mesaj ve firma bildirimlerini anında alın.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              className="px-3 py-1.5 text-xs font-medium bg-montaj text-black rounded-lg hover:opacity-90 transition"
            >
              İzin Ver
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 text-xs text-sub-text hover:text-white transition"
            >
              Şimdi Değil
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
