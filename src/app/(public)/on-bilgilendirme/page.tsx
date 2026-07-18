import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu | Montajım Var",
  description: "Mesafeli Sözleşme ön bilgilendirme formu.",
  alternates: { canonical: "/on-bilgilendirme" },
  openGraph: {
    title: "Ön Bilgilendirme Formu | Montajım Var",
    description: "Mesafeli Sözleşme ön bilgilendirme formu.",
  },
};

export default function OnBilgilendirmePage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Ön Bilgilendirme Formu</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70">
          <p>
            İşbu ön bilgilendirme formu, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
            Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Satıcı Bilgileri</h2>
          <p>
            <strong>Ünvan:</strong> Montajım Var Teknoloji A.Ş.<br />
            <strong>Adres:</strong> İstanbul, Türkiye<br />
            <strong>E-posta:</strong> info@montajimvar.com
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Hizmet Bilgileri</h2>
          <p>
            Platform üzerinden talep edilen montaj hizmetinin türü, kapsamı, süresi ve 
            fiyatı iş oluşturma aşamasında belirtilir.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Ödeme ve Teslimat</h2>
          <p>
            Ödeme, platform üzerinden güvenli ödeme altyapısı ile gerçekleştirilir. 
            Hizmet teslimatı, işin niteliğine göre belirlenen süre içinde tamamlanır.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Cayma Hakkı</h2>
          <p>
            Tüketici, hizmetin ifasına başlanılmadığı sürece 14 gün içinde cayma hakkına sahiptir.
            Tüketicinin onayı ile hizmet ifasına başlanmışsa cayma hakkı kullanılamaz.
          </p>
        </div>
      </div>
    </div>
  );
}
