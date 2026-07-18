import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Güvenlik | Montajım Var",
  description: "Montajım Var güvenlik politikaları ve önlemleri.",
  alternates: { canonical: "/guvenlik" },
  openGraph: {
    title: "Güvenlik | Montajım Var",
    description: "Montajım Var güvenlik politikaları ve önlemleri.",
  },
};

export default function GuvenlikPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Güvenlik</h1>
        <div className="space-y-6 text-white/70">
          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Kimlik Doğrulama</h2>
            <p>Tüm kullanıcılar e-posta doğrulamasından geçer. Ustalar ek olarak kimlik ve mesleki yeterlilik belgeleri ile doğrulanır.</p>
          </div>

          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Güvenli Ödeme</h2>
            <p>Ödemeler güvenli altyapı ile işlenir. Ödeme tamamlanana kadar fonlar korunur.</p>
          </div>

          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Veri Güvenliği</h2>
            <p>Kişisel verileriniz şifrelenerek saklanır. SSL sertifikası ile veri iletimi korunur.</p>
          </div>

          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Sigortalı Hizmet</h2>
            <p>Platform üzerinden verilen tüm hizmetler sigorta kapsamındadır. Olası hasar durumlarında güvence altındasınız.</p>
          </div>

          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Müşteri Değerlendirmeleri</h2>
            <p>Her iş sonrası yapılan değerlendirmeler şeffaf şekilde profillerde görüntülenir. Düşük puanlı kullanıcılar uyarılır.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
