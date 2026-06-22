"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Props {
  profileId: number;
  companyName: string;
  isOwner: boolean;
}

export default function MessageButton({ profileId, companyName, isOwner }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (isOwner) {
    return (
      <p className="text-sm text-gray-500 italic">
        Bu sizin firma profiliniz.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      router.push("/auth/giris");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          subject: form.subject,
          content: form.content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Mesaj gönderilemedi");
      }

      setSuccess(true);
      setForm({ subject: "", content: "" });
    } catch (err: any) {
      setError(err.message || "Mesaj gönderilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  if (!showForm && !success) {
    return (
      <Button onClick={() => setShowForm(true)} className="w-full">
        Mesaj Gönder
      </Button>
    );
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-green-600 font-medium">Mesajınız gönderildi!</p>
        <p className="text-sm text-gray-500 mt-1">
          {companyName} en kısa sürede size dönüş yapacaktır.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setSuccess(false); setShowForm(false); }}
          className="mt-3"
        >
          Yeni Mesaj
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Konu (isteğe bağlı)"
        placeholder="Örn: Montaj teklifi almak istiyorum"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Mesajınız
        </label>
        <textarea
          required
          rows={4}
          placeholder="Firmaya iletmek istediğiniz mesaj..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj focus:border-transparent bg-dark-card text-white placeholder-gray-500"
        />
      </div>

      {error && (
        <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>
      )}

      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          Gönder
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowForm(false)}
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
