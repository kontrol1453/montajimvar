"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Giriş Yap</h1>
          <p className="text-muted-text mt-1">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <div className="text-right">
            <Link href="/auth/sifre-unuttum" className="text-sm text-montaj hover:underline">
              Şifremi Unuttum
            </Link>
          </div>

          {error && (
            <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Giriş Yap
          </Button>
        </form>

        <p className="text-center text-sm text-muted-text mt-6">
          Hesabınız yok mu?{" "}
          <Link href="/auth/kayit" className="text-montaj hover:underline">
            Kaydol
          </Link>
        </p>
      </Card>
    </div>
  );
}
