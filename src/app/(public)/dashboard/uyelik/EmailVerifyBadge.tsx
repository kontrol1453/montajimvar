"use client";

import { useState } from "react";

interface EmailVerifyBadgeProps {
  emailVerified: boolean;
  email: string;
}

export default function EmailVerifyBadge({ emailVerified, email }: EmailVerifyBadgeProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleResend() {
    setSending(true);
    setError("");
    setSent(false);
    try {
      const res = await fetch("/api/auth/email-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu");
        return;
      }
      setSent(true);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-6">
      <h2 className="text-lg font-semibold text-white mb-3">E-posta Doğrulama</h2>
      <div className="flex items-center gap-3 mb-3">
        {emailVerified ? (
          <>
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-green-400 font-medium">E-posta Doğrulanmış</span>
          </>
        ) : (
          <>
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-red-400 font-medium">E-posta Doğrulanmamış</span>
          </>
        )}
      </div>
      <p className="text-sm text-muted-text">{email}</p>
      {!emailVerified && (
        <div className="mt-4">
          {sent ? (
            <p className="text-sm text-green-400">
              Doğrulama e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin.
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={sending}
              className="px-4 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium disabled:opacity-50"
            >
              {sending ? "Gönderiliyor..." : "Doğrulama E-postası Gönder"}
            </button>
          )}
          {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
