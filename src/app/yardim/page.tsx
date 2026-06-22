import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yardım & SSS - Montajım Var",
  description:
    "Sıkça sorulan sorular ve yardım dokümanları. Montajım Var platformunda firma nasıl bulunur, profil nasıl oluşturulur.",
};

const faqs = [
  {
    q: "Montajım Var nedir?",
    a: "Montajım Var, Türkiye'nin dört bir yanındaki montaj firmaları, üreticiler ve müşterileri bir araya getiren bir platformdur. Müşteriler ihtiyaçlarına uygun firmaları bulabilir, montajcılar ve üreticiler ise dijital bir vitrin oluşturarak müşterilere ulaşabilir.",
  },
  {
    q: "Nasıl üye olabilirim?",
    a: 'Üst menüdeki "Kaydol" butonuna tıklayarak kayıt formunu doldurabilirsiniz. Kayıt olurken Müşteri, Montajcı veya Üretici rolünü seçebilirsiniz. Kayıt tamamen ücretsizdir.',
  },
  {
    q: "Firma profili nasıl oluşturulur?",
    a: "Montajcı veya Üretici rolüyle kaydolduktan sonra Panelim > Firma Profili Oluştur bölümünden firma profilinizi oluşturabilirsiniz. Firma adı, açıklama, kategori, şehir ve iletişim bilgilerinizi ekleyerek profilinizi tamamlayabilirsiniz.",
  },
  {
    q: "Firma profili oluşturmak ücretli mi?",
    a: "Hayır, firma profili oluşturmak tamamen ücretsizdir. Profilinizi dilediğiniz gibi düzenleyebilir, görsel ekleyebilir ve iletişim bilgilerinizi paylaşabilirsiniz.",
  },
  {
    q: "Bir firmaya nasıl mesaj gönderebilirim?",
    a: "Firma detay sayfasında bulunan 'Mesaj Gönder' butonuna tıklayarak firmaya mesaj gönderebilirsiniz. Mesaj göndermek için giriş yapmış olmanız yeterlidir.",
  },
  {
    q: "WhatsApp üzerinden nasıl iletişime geçebilirim?",
    a: "Firma profillerinde WhatsApp numarası paylaşılmışsa, doğrudan WhatsApp üzerinden firmayla iletişime geçebilirsiniz. WhatsApp butonuna tıklamanız yeterlidir.",
  },
  {
    q: "Firmaları nasıl değerlendirebilirim?",
    a: "Firma detay sayfasında bulunan değerlendirme bölümünden, daha önce hizmet aldığınız firmaları yıldız puanı ve yorum ile değerlendirebilirsiniz. Her firmaya yalnızca bir kez yorum yapabilirsiniz.",
  },
  {
    q: "Favorilere nasıl eklerim?",
    a: "Firma detay sayfasındaki kalp ikonuna tıklayarak firmayı favorilerinize ekleyebilirsiniz. Favorilerinizi Panelim > Favorilerim bölümünden görüntüleyebilirsiniz.",
  },
  {
    q: "Şifremi unuttum, ne yapmalıyım?",
    a: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinizi girin. Size şifre sıfırlama bağlantısı göndereceğiz.',
  },
  {
    q: "Hangi şehirlerde hizmet veriyorsunuz?",
    a: "Türkiye'nin tüm şehirlerinde hizmet veriyoruz. Aramayı şehre göre filtreleyerek bölgenizdeki firmaları bulabilirsiniz.",
  },
  {
    q: "Profil bilgilerimi nasıl güncellerim?",
    a: "Panelim > Profil Bilgilerim bölümünden ad, e-posta, telefon ve şehir bilgilerinizi güncelleyebilirsiniz. Firma profiliniz varsa Panelim > Firma Profilim bölümünden firma bilgilerinizi düzenleyebilirsiniz.",
  },
  {
    q: "Hesabımı nasıl silebilirim?",
    a: "Hesap silme işlemi için bizimle iletişime geçmeniz gerekmektedir. İletişim bilgilerimiz üzerinden talebinizi iletebilirsiniz.",
  },
];

export default function YardimPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">
        Yardım & Sıkça Sorulan Sorular
      </h1>
      <p className="text-muted-text mb-10">
        Montajım Var platformu hakkında merak ettiğiniz her şey.
      </p>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <details
            key={i}
            className="bg-dark-card rounded-xl border border-dark-border overflow-hidden group cursor-pointer"
          >
            <summary className="flex items-center justify-between p-5 text-white font-medium hover:bg-dark-section transition list-none marker:hidden">
              <span>{item.q}</span>
              <svg
                className="w-5 h-5 text-sub-text shrink-0 ml-4 group-open:rotate-180 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 text-muted-text leading-relaxed">
              {item.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 bg-dark-card rounded-xl border border-dark-border p-6 text-center">
        <h2 className="text-lg font-semibold text-white mb-2">
          Başka bir sorunuz mu var?
        </h2>
        <p className="text-sm text-muted-text mb-4">
          Aradığınız cevabı bulamadıysanız, bizimle iletişime geçin.
        </p>
        <a
          href="mailto:destek@montajimvar.com"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          destek@montajimvar.com
        </a>
      </div>
    </div>
  );
}
