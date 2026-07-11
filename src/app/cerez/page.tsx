import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Montajım Var",
  description: "Montajım Var gizlilik politikası ve kullanıcı verilerinin korunması.",
};

export default function CerezPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Çerez Politikası</h1>
        <p className="text-white/70 mb-8">
          Montajım Var olarak, web sitemizde çerezler kullanmaktayız.
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70">
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Çerez Nedir?</h2>
          <p>
            Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen 
            küçük metin dosyalarıdır. Web sitesinin daha verimli çalışmasını sağlar.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Kullanılan Çerez Türleri</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Zorunlu Çerezler:</strong> Siteyi çalıştırmak için gerekli.</li>
            <li><strong>Analitik Çerezler:</strong> Kullanım istatistiklerini toplar.</li>
            <li><strong>Fonksiyonel Çerezler:</strong> Tercihlerinizi hatırlar.</li>
            <li><strong>Reklam Çerezleri:</strong> İlgi alanınıza göre reklam gösterimi.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Çerezleri Yönetme</h2>
          <p>
            Tarayıcı ayarlarınızdan çerezleri kontrol edebilir veya silebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
