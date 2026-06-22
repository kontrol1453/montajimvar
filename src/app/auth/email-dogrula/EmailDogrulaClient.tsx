"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface EmailDogrulaClientProps {
  token: string;
}

export default function EmailDogrulaClient({ token }: EmailDogrulaClientProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`/api/auth/email-verify/${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Doğrulama başarısız oldu.");
        }
      } catch {
        setStatus("error");
        setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }

    verify();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="bg-dark-card rounded-xl border border-dark-border p-8 text-center max-w-md mx-4">
          <div className="animate-spin w-12 h-12 border-4 border-montaj border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white text-lg">E-posta doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg py-12">
      <div className="bg-dark-card rounded-xl border border-dark-border p-8 text-center max-w-md mx-4">
        {status === "success" ? (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">E-posta Doğrulandı!</h1>
            <p className="text-muted-text mb-6">{message}</p>
            <Link
              href="/auth/giris"
              className="inline-flex items-center gap-2 px-6 py-3 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition font-medium"
            >
              Giriş Yap
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✕
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Doğrulama Başarısız</h1>
            <p className="text-muted-text mb-6">{message}</p>
            <Link
              href="/auth/kayit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition font-medium"
            >
              Tekrar Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </div>
  );
}