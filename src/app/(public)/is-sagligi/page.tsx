import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İş Sağlığı ve Güvenliği | Montajım Var",
  description: "Montajım Var iş sağlığı ve güvenliği politikaları.",
};

export default function IsSagligiPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">İş Sağlığı ve Güvenliği</h1>
        <div className="space-y-6 text-white/70">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Güvenli Çalışma Ortamı</h2>
            <p>Tüm montaj ekiplerimiz iş sağlığı ve güvenliği kurallarına uygun şekilde çalışmaktadır.</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Kişisel Koruyucu Ekipman</h2>
            <p>Ekiplerimiz çalışma alanına uygun koruyucu ekipman kullanmaktadır. Eldiven, baret, emniyet kemeri gibi ekipmanlar zorunludur.</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Sigorta</h2>
            <p>Tüm montaj işlemleri sigorta kapsamındadır. Olası kaza veya hasar durumlarında güvence altındasınız.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
