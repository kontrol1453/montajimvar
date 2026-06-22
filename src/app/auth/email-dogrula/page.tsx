import { Metadata } from "next";
import EmailDogrulaClient from "./EmailDogrulaClient";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return {
    title: "E-posta Doğrulama | Montajım Var",
  };
}

export default async function EmailDogrulaPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg py-12">
        <div className="bg-dark-card rounded-xl border border-dark-border p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✕
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Geçersiz Bağlantı</h1>
          <p className="text-muted-text mb-6">Doğrulama tokenı bulunamadı.</p>
        </div>
      </div>
    );
  }

  return <EmailDogrulaClient token={token} />;
}