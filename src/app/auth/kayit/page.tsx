"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

      // Auto login after successful registration
      const loginResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginResult?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/auth/giris");
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Kaydol</h1>
          <p className="text-muted-text mt-1">Hesap oluşturun</p>
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
