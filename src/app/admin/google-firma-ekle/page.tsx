"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageTitle, PageContainer } from "@/components/ui/Typography";

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
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      setMessage({ type: "success", text: d.companyName ? "Bilgiler başarıyla getirildi." : "Sayfa yüklendi, lütfen manuel doldurun." });
    } catch {
      setMessage({ type: "error", text: "Sayfa yüklenirken hata oluştu." });
    } finally {
      setFetching(false);
    }
  }

  async function handleSave() {
    if (!companyName.trim()) { setMessage({ type: "error", text: "Firma adı gerekli." }); return; }
    if (!categoryId) { setMessage({ type: "error", text: "Kategori seçimi gerekli." }); return; }
    if (!city.trim()) { setMessage({ type: "error", text: "Şehir gerekli." }); return; }

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
      setUrl(""); setCompanyName(""); setDescription(""); setPhone(""); setEmail("");
      setWebsite(""); setCategoryId(""); setCity(""); setAddress(""); setWhatsapp("");
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

  const inputClass = "w-full px-4 py-2.5 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-primary)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/50 text-sm";
  const labelClass = "block text-sm font-medium text-[var(--admin-text-secondary)] mb-1.5";

  return (
    <PageContainer>
      <div className="mb-6">
        <PageTitle>Google&apos;dan Firma Ekle</PageTitle>
        <p className="text-sm text-[var(--admin-text-secondary)] mt-1">
          Firma websitesi URL&apos;sini girin, bilgileri otomatik çekelim.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
          message.type === "success"
            ? "bg-[var(--admin-success-soft)] text-[var(--admin-success)] border border-[var(--admin-success)]/30"
            : "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] border border-[var(--admin-danger)]/30"
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-[var(--admin-surface)] rounded-lg border border-[var(--admin-border)] p-6 mb-6">
        <label className={labelClass}>Firma Websitesi URL</label>
        <div className="flex gap-2">
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="orn: https://www.firma.com.tr" className={inputClass} />
          <button onClick={handleFetch} disabled={fetching || !url.trim()}
            className="px-5 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:bg-[var(--admin-primary-strong)] disabled:opacity-50 transition font-medium text-sm whitespace-nowrap">
            {fetching ? "Yükleniyor..." : "Bilgileri Getir"}
          </button>
        </div>
      </div>

      <div className="bg-[var(--admin-surface)] rounded-lg border border-[var(--admin-border)] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--admin-text-primary)] mb-4">Firma Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Firma Adı <span className="text-[var(--admin-danger)]">*</span></label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Firma adı" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Kategori <span className="text-[var(--admin-danger)]">*</span></label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              className={inputClass}>
              <option value="">Kategori Seçin</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Şehir <span className="text-[var(--admin-danger)]">*</span></label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
              placeholder="örn: İstanbul" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telefon</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="örn: +90 555 123 4567" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@firma.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.firma.com.tr" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+90 555 123 4567" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Adres</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="Firma adresi" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Açıklama</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Firma hakkında kısa açıklama" rows={3}
              className={`${inputClass} resize-none`} />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:bg-[var(--admin-primary-strong)] disabled:opacity-50 transition font-medium text-sm">
            {saving ? "Kaydediliyor..." : "Firmayı Kaydet"}
          </button>
          <span className="text-xs text-[var(--admin-text-muted)]">
            Firma onay bekleyen olarak kaydedilecektir.
          </span>
        </div>
      </div>

      <div className="bg-[var(--admin-surface)] rounded-lg border border-[var(--admin-border)] p-5">
        <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-2">İpucu</h3>
        <ul className="text-xs text-[var(--admin-text-secondary)] space-y-1.5 list-disc list-inside">
          <li>Firma websitesi URL&apos;sini girip &quot;Bilgileri Getir&quot; butonuna tıklayın.</li>
          <li>Sistem sayfadan firma adı, telefon ve e-posta bilgilerini çekmeye çalışır.</li>
          <li>Eksik alanları manuel doldurun ve kaydedin.</li>
          <li>Kaydedilen firmalar onay bekleyen olarak işaretlenir.</li>
          <li>Onay için &quot;Firmalar&quot; sayfasından onaylayabilirsiniz.</li>
        </ul>
      </div>
    </PageContainer>
  );
}
