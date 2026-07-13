import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "Nasıl montaj ekibi bulabilirim?",
    a: "İş Ver sayfasından işinizi tanımlayın, fotoğraflarınızı ekleyin ve bütçenizi belirtin. Sistemimiz size uygun doğrulanmış montaj ekiplerinden teklifleri anında iletir.",
  },
  {
    q: "Montaj ekibi nasıl kayıt olabilir?",
    a: "Kaydol sayfasından ücretsiz hesap oluşturun, firma bilgilerinizi ekleyin ve doğrulama sürecini tamamlayın. Onaylanan ekipler hemen teklif almaya başlayabilir.",
  },
  {
    q: "Ödeme nasıl korunuyor?",
    a: "Ödeme işleminiz, iş tamamlanana kadar güvence altında tutulur. İşi onayladığınızda ödeme montaj ekibine aktarılır.",
  },
  {
    q: "Hangi şehirlerde hizmet veriyorsunuz?",
    a: "Türkiye genelinde hizmet ağımız bulunuyor. Uygun ekiplerin olduğu bölgelerde talepler kısa sürede eşleştirilir.",
  },
  {
    q: "Kurumsal çözümler sunuyor musunuz?",
    a: "Evet, zincir mağaza kurulumları, AVM montajları ve fuar standı projeleri için kurumsal çözümler sunuyoruz. Toplu işlerde özel fiyatlandırma ve öncelikli destek sağlıyoruz.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-24 bg-white" id="sss">
      <div className="container-app">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              SSS
            </span>
            <h2 className="heading-lg mt-4 mb-3">Sık Sorulan Sorular</h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Merak ettiğiniz her şeyin cevabı burada.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="card overflow-hidden group open:ring-1 open:ring-[var(--color-primary)]/10"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-sm font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors">
                  {faq.q}
                  <ArrowRight size={16} className="shrink-0 transition-transform group-open:rotate-90 text-[var(--color-text-tertiary)]" />
                </summary>
                <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border-light)] pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
