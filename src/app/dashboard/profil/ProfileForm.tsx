"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { TURKISH_CITIES } from "@/lib/utils";

interface Props {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    roles: string[];
    city: string | null;
    avatar: string | null;
  };
}

export default function ProfileForm({ user }: Props) {
  const router = useRouter();
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });
  const [avatar, setAvatar] = useState<string | null>(user.avatar);
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    city: user.city || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Güncelleme başarısız.");
      }

      setMessage({ type: "success", text: "Profil bilgileriniz güncellendi." });
      await update();
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Yükleme başarısız.");
      }

      const data = await res.json();
      setAvatar(data.avatar);
      setMessage({ type: "success", text: "Profil fotoğrafı güncellendi." });
      await update();
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUploading(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleRemoveAvatar() {
    if (!confirm("Profil fotoğrafını kaldırmak istediğinize emin misiniz?")) return;

    setUploading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, avatar: null }),
      });

      if (res.ok) {
        setAvatar(null);
        setMessage({ type: "success", text: "Profil fotoğrafı kaldırıldı." });
        await update();
        router.refresh();
      }
    } catch {
      setMessage({ type: "error", text: "Bir hata oluştu." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      {/* Avatar Section */}
      <div className="flex items-center gap-5 mb-6 pb-6 border-b border-dark-border">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-montaj/20 flex items-center justify-center text-3xl font-bold text-montaj">
            {avatar ? (
              <img src={avatar} alt="Profil fotoğrafı" className="w-full h-full object-cover" />
            ) : (
              user.name[0]?.toUpperCase() || "?"
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium"
          >
            {uploading ? "Yükleniyor..." : "Değiştir"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        <div>
          <p className="text-white font-medium">{user.name}</p>
          <p className="text-sm text-sub-text">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs text-montaj hover:underline"
            >
              Fotoğraf Yükle
            </button>
            {avatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-xs text-red-400 hover:underline"
              >
                Kaldır
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="E-posta" value={user.email} disabled className="bg-dark-section text-sub-text" />

        <Input
          label="Ad Soyad"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Input
          label="Telefon"
          type="tel"
          placeholder="05XX XXX XX XX"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Şehir
          </label>
          <select
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-card text-white"
          >
            <option value="">Şehir seçin</option>
            {TURKISH_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-900/30 text-green-400"
                : "bg-red-900/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <Button type="submit" loading={loading}>
          Kaydet
        </Button>
      </form>
    </Card>
  );
}
