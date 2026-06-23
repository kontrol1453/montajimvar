"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface FetchedData {
  companyName: string;
  description: string;
  phone: string;
  email: string;
  logo: string;
  address: string;
}

export default function GoogleFirmaEklePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form fields
  const [url, setUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data as Category[]))
      .catch(() => {});
  }, []);

  async function handleFetch() {
    if (!url.trim()) return;

    setFetching(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/firma-bilgi-getir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Bilgiler alınamadı." });
        return;
      }

      const d: FetchedData = data.data;
      setCompanyName(d.companyName || "");
      setDescription(d.description || "");
      setPhone(d.phone || "");
      setEmail(d.email || "");
      setAddress(d.address || "");
      setWebsite(url.trim());

      if (d.companyName) {
        setMessage({ type: "success", text: "Bilgiler başarıyla getirildi." });
      } else {
        setMessage({ type: "success", text: "Sayfa yüklendi, ancak firma adı bulunamadı. Lütfen manuel doldurun." });
      }
    } catch {
      setMessage({ type: "error", text: "Sayfa yüklenirken hata oluştu." });
    } finally {
      setFetching(false);
    }
  }

  async function handleSave() {
    if (!companyName.trim()) {
      setMessage({ type: "error", text: "Firma adı gerekli." });
      return;
    }
    if (!categoryId) {
      setMessage({ type: "error", text: "Kategori seçimi gerekli." });
      return;
    }
    if (!city.trim()) {
      setMessage({ type: "error", text: "Şehir gerekli." });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/google-firma-kaydet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          description: description.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          website: website.trim() || null,
          categoryId: Number(categoryId),
          city: city.trim(),
          address: address.trim() || null,
          whatsapp: whatsapp.trim() || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Kaydedilirken hata oluştu." });
        return;
      }

      setMessage({ type: "success", text: data.message || "Firma başarıyla eklendi!" });

      // Reset form for next entry
      setUrl("");
      setCompanyName("");
      setDescription("");
      setPhone("");
      setEmail("");
      setWebsite("");
      setCategoryId("");
      setCity("");
      setAddress("");
      setWhatsapp("");

      // Refresh the page list after a moment
      setTimeout(() => router.refresh(), 500);
    } catch {
      setMessage({ type: "error", text: "Kaydedilirken hata oluştu." });
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !fetching && url.trim()) {
      e.preventDefault();
      handleFetch();
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Google'dan Firma Ekle</h1>
          <p className="text-sm text-sub-text mt-1">
            Firma websitesi URL&apos;sini girin, bilgileri otomatik çekelim.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-900/30 text-green-400 border border-green-800"
              : "bg-red-900/30 text-red-400 border border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* URL Input Section */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
        <label className="block text-sm font-medium text-sub-text mb-2">
          Firma Websitesi URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="orn: https://www.firma.com.tr"
            className="flex-1 px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm"
          />
          <button
            onClick={handleFetch}
            disabled={fetching || !url.trim()}
            className="px-5 py-2.5 bg-montaj text-white rounded-lg hover:bg-montaj-dark disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm whitespace-nowrap"
          >
            {fetching ? "Yükleniyor..." : "Bilgileri Getir"}
          </button>
        </div>
      </div>

      {/* Company Form */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Firma Bilgileri</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-sub-text mb-1.5">
              Firma Adı <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Firma adı"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-sub-text mb-1.5">
              Kategori <span className="text-red-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm"
            >
              <option value="">Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-sub-text mb-1.5">
              Şehir <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="örn: İstanbul"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-sub-text mb-1.5">
              Telefon
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="örn: +90 555 123 4567"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-sub-text mb-1.5">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@firma.com"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-sub-text mb-1.5">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.firma.com.tr"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-sub-text mb-1.5">
              WhatsApp
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+90 555 123 4567"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-sub-text mb-1.5">
              Adres
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Firma adresi"
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-sub-text mb-1.5">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Firma hakkında kısa açıklama"
              rows={3}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-montaj/50 text-sm resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-montaj text-white rounded-lg hover:bg-montaj-dark disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
          >
            {saving ? "Kaydediliyor..." : "Firmayı Kaydet"}
          </button>
          <span className="text-xs text-sub-text">
            Firma onay bekleyen olarak kaydedilecektir.
          </span>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-5">
        <h3 className="text-sm font-semibold text-white mb-2">İpucu</h3>
        <ul className="text-xs text-sub-text space-y-1.5 list-disc list-inside">
          <li>Firma websitesi URL&apos;sini girip &quot;Bilgileri Getir&quot; butonuna tıklayın.</li>
          <li>Sistem sayfadan firma adı, telefon ve e-posta bilgilerini çekmeye çalışır.</li>
          <li>Eksik alanları manuel doldurun ve kaydedin.</li>
          <li>Kaydedilen firmalar onay bekleyen olarak işaretlenir.</li>
          <li>Onay için &quot;Firmalar&quot; sayfasından onaylayabilirsiniz.</li>
        </ul>
      </div>
    </div>
  );
}
