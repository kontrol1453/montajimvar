"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { TURKISH_CITIES } from "@/lib/utils";

const PUBLIC_ROLES = [
  { value: "CUSTOMER", label: "Müşteri", description: "Montaj hizmeti almak istiyorum" },
  { value: "ASSEMBLER", label: "Montajcı", description: "Montaj hizmeti veriyorum" },
  { value: "MANUFACTURER", label: "Üretici", description: "Ürünlerimi montajcılarla buluşturmak istiyorum" },
] as const;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showGoogleRolePicker, setShowGoogleRolePicker] = useState(false);
  const [googleRole, setGoogleRole] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER" as string,
    city: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/kayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kayıt sırasında bir hata oluştu.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn(role: string) {
    await fetch("/api/auth/google-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    signIn("google", { callbackUrl: "/dashboard" });
  }

  function handleGoogleClick() {
    setGoogleRole(null);
    setShowGoogleRolePicker(true);
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-[var(--color-success-soft)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="h3 mb-2">Hesabınız Oluşturuldu!</h1>
            <p className="body-small mb-6">
              E-posta adresinize doğrulama linki gönderildi. Lütfen e-postanızı kontrol edin ve hesabınızı aktifleştirin.
            </p>
            <Link
              href="/auth/giris"
              className="btn btn-primary btn-lg"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="h3 mb-1">Kaydol</h1>
            <p className="body-small">Hesap oluşturun</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleClick}
            className="btn btn-secondary btn-lg w-full gap-2"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.92 14.97 1 12 1 7.7 1 3.99 3.45 2.18 7.07l2.85-2.22.81-.62z"/>
            </svg>
            Google ile Devam Et
          </button>

          {showGoogleRolePicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              <div className="card-elevated p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Hesap Türünü Seçin</h2>
                <p className="body-small mb-4">
                  Google ile kaydolurken hangi hesap türünü kullanmak istersiniz?
                </p>
                <div className="space-y-2">
                  {PUBLIC_ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleGoogleSignIn(role.value)}
                      className={`w-full p-3 border rounded-lg text-left text-sm transition ${
                        googleRole === role.value
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] ring-2 ring-[var(--color-primary)]/30"
                          : "border-[var(--color-border-light)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      <div className="font-medium text-[var(--color-text-primary)]">{role.label}</div>
                      <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{role.description}</div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleRolePicker(false)}
                  className="w-full mt-4 py-2 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition"
                >
                  İptal
                </button>
              </div>
            </div>
          )}

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
              <label className="form-label">Hesap Türü</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PUBLIC_ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`p-3 border rounded-lg text-left text-sm transition ${
                      form.role === role.value
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] ring-2 ring-[var(--color-primary)]/30"
                        : "border-[var(--color-border-light)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <div className="font-medium text-[var(--color-text-primary)]">{role.label}</div>
                    <div className="text-xs text-[var(--color-text-tertiary)] mt-1">{role.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="reg-name">Ad Soyad</label>
              <input
                id="reg-name"
                placeholder="Adınız ve soyadınız"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="reg-email">E-posta</label>
              <input
                id="reg-email"
                type="email"
                placeholder="ornek@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="reg-password">Şifre</label>
              <input
                id="reg-password"
                type="password"
                placeholder="En az 6 karakter"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="reg-phone">Telefon (isteğe bağlı)</label>
              <input
                id="reg-phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="reg-city">Şehir (isteğe bağlı)</label>
              <select
                id="reg-city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="form-select"
              >
                <option value="">Şehir seçin</option>
                {TURKISH_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                  <path d="M8 1C4.136 1 1 4.136 1 8s3.136 7 7 7 7-3.136 7-7-3.136-7-7-7zM7 4.5h2v4.5H7V4.5zm0 6h2v2H7v-2z" fill="currentColor"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75"/>
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                "Kaydol"
              )}
            </button>
          </form>

          <p className="text-center body-small mt-6">
            Zaten hesabınız var mı?{" "}
            <Link href="/auth/giris" className="text-[var(--color-primary)] hover:underline font-medium">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
