"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
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

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Hesabınız Oluşturuldu!</h1>
          <p className="text-muted-text mb-6">
            E-posta adresinize doğrulama linki gönderildi. Lütfen e-postanızı kontrol edin ve hesabınızı aktifleştirin.
          </p>
          <Link
            href="/auth/giris"
            className="inline-flex items-center gap-2 px-6 py-3 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition font-medium"
          >
            Giriş Yap
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Kaydol</h1>
          <p className="text-muted-text mt-1">Hesap oluşturun</p>
        </div>

        {/* Google Sign In */}
        <Button
          variant="secondary"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.92 14.97 1 12 1 7.7 1 3.99 3.45 2.18 7.07l2.85-2.22.81-.62z"
            />
          </svg>
          Google ile Devam Et
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-card text-sub-text">veya</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rol Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hesap Türü
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PUBLIC_ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: role.value })}
                   className={`p-3 border rounded-lg text-left text-sm transition ${
                    form.role === role.value
                      ? "border-montaj bg-montaj/10 ring-2 ring-montaj/30"
                      : "border-dark-border hover:border-montaj"
                  }`}
                >
                  <div className="font-medium text-white">{role.label}</div>
                  <div className="text-sub-text text-xs mt-1">
                    {role.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Ad Soyad"
            placeholder="Adınız ve soyadınız"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            label="E-posta"
            type="email"
            placeholder="ornek@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <Input
            label="Şifre"
            type="password"
            placeholder="En az 6 karakter"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={6}
            required
          />

          <Input
            label="Telefon (isteğe bağlı)"
            type="tel"
            placeholder="05XX XXX XX XX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şehir (isteğe bağlı)
            </label>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj focus:border-transparent bg-dark-card text-white"
            >
              <option value="">Şehir seçin</option>
              {TURKISH_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Kaydol
          </Button>
        </form>

        <p className="text-center text-sm text-muted-text mt-6">
          Zaten hesabınız var mı?{" "}
          <Link href="/auth/giris" className="text-montaj hover:underline">
            Giriş Yap
          </Link>
        </p>
      </Card>
    </div>
  );
}
