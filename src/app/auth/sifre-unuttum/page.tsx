"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/sifre-sifirla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Şifremi Unuttum</h1>
          <p className="text-muted-text mt-1">
            E-posta adresinizi girin, size sıfırlama linki gönderelim.
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-4xl mb-4">📧</div>
            <p className="text-green-400 mb-4">
              E-posta adresiniz varsa şifre sıfırlama linki gönderilecektir.
            </p>
            <p className="text-sm text-sub-text mb-6">
              Link gelmediyse, konsola bakın (dev modunda) veya tekrar deneyin.
            </p>
            <Link
              href="/auth/giris"
              className="text-montaj hover:underline text-sm"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-posta"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && (
              <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Sıfırlama Linki Gönder
            </Button>
          </form>
        )}

      </Card>
    </div>
  );
}
