"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!token) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-red-400 mb-4">
          Geçersiz şifre sıfırlama bağlantısı.
        </p>
        <Link href="/auth/sifre-unuttum" className="text-montaj hover:underline text-sm">
          Yeni bağlantı iste
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/auth/sifre-sifirla/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setSuccess("Şifreniz başarıyla güncellendi!");
      setTimeout(() => router.push("/auth/giris"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {success ? (
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-green-400 mb-4">{success}</p>
          <p className="text-sm text-sub-text">Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Yeni Şifre"
            type="password"
            placeholder="En az 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Şifre Tekrar"
            type="password"
            placeholder="Aynı şifreyi girin"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Şifreyi Güncelle
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-text mt-6">
        <Link href="/auth/giris" className="text-montaj hover:underline">
          Giriş Sayfasına Dön
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Yeni Şifre Belirle</h1>
          <p className="text-muted-text mt-1">
            Yeni şifrenizi girin.
          </p>
        </div>

        <Suspense fallback={<p className="text-center text-sub-text">Yükleniyor...</p>}>
          <ResetForm />
        </Suspense>
      </Card>
    </div>
  );
}
