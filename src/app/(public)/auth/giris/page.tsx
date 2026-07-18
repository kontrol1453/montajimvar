"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifySent, setVerifySent] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const isNotVerified = error.includes("doğrulanmamış");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerifySent(false);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    setVerifyLoading(true);
    setVerifySent(false);
    try {
      const res = await fetch("/api/auth/email-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      if (res.ok) {
        setVerifySent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Doğrulama e-postası gönderilemedi.");
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setVerifyLoading(false);
    }
  }

  function handleGoogleSignIn() {
    signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="h3 mb-1">Giriş Yap</h1>
            <p className="body-small">Hesabınıza giriş yapın</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn btn-secondary btn-lg w-full gap-2"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.92 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Devam Et
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border-light)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--color-surface)] text-[var(--color-text-tertiary)]">veya</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="login-email">E-posta</label>
              <input
                id="login-email"
                type="email"
                placeholder="ornek@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="login-password">Şifre</label>
              <input
                id="login-password"
                type="password"
                placeholder="En az 6 karakter"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="text-right">
              <Link href="/auth/sifre-unuttum" className="text-sm text-[var(--color-primary)] hover:underline">
                Şifremi Unuttum
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                  <path d="M8 1C4.136 1 1 4.136 1 8s3.136 7 7 7 7-3.136 7-7-3.136-7-7-7zM7 4.5h2v4.5H7V4.5zm0 6h2v2H7v-2z" fill="currentColor"/>
                </svg>
                <div className="flex-1">
                  <p>{error}</p>
                  {isNotVerified && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-danger)]/20">
                      {verifySent ? (
                        <p className="text-xs font-medium text-[var(--color-success)]">
                          ✓ Doğrulama e-postası gönderildi. Gelen kutunuzu kontrol edin.
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={resendVerification}
                          disabled={verifyLoading}
                          className="text-xs font-medium text-[var(--color-primary)] hover:underline disabled:opacity-50"
                        >
                          {verifyLoading ? "Gönderiliyor..." : "Doğrulama e-postasını tekrar gönder"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75"/>
                  </svg>
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>

          <p className="text-center body-small mt-6">
            Hesabınız yok mu?{" "}
            <Link href="/auth/kayit" className="text-[var(--color-primary)] hover:underline font-medium">
              Kaydol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
