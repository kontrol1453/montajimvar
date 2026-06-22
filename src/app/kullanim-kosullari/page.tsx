import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Montajım Var",
  description: "Montajım Var platformu kullanım koşulları ve sözleşmesi.",
};

export default function KullanimKosullariPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Kullanım Koşulları</h1>

      <div className="bg-dark-card rounded-xl border border-dark-border p-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">1. Taraflar</h2>
          <p className="text-muted-text">
            Bu Sözleşme, Montajım Var platformu ("Platform", "Biz") ile platformu kullanan gerçek veya tüzel kişiler ("Kullanıcı", "Siz") 
            arasında, Platform üzerinden sağlanan hizmetlerin kullanım koşullarını düzenler.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">2. Sözleşmenin Kapsamı ve Kabulü</h2>
          <p className="text-muted-text mb-4">
            Platforma erişerek, üye olarak veya misafir olarak kullanarak, bu Kullanım Koşullarını, Gizlilik Politikasını 
            ve Çerez Politikasını okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz. Bu koşulları 
            kabul etmiyorsanız Platformu kullanmayınız.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">3. Hizmet Tanımı</h2>
          <p className="text-muted-text mb-4">
            Montajım Var; montaj firmaları, üreticiler ve müşterileri bir araya getiren bir çevrimiçi platformdur. 
            Sağlanan temel hizmetler:
          </p>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Firma profili oluşturma ve yönetme</li>
            <li>Montaj firmalarını arama, filtreleme ve görüntüleme</li>
            <li>Firmalarla iletişim kurma (mesajlaşma, WhatsApp, telefon)</li>
            <li>Değerlendirme ve puanlama sistemi</li>
            <li>Favori listesi oluşturma</li>
            <li>Premium üyelik ve vitrin (öne çıkan) hizmetleri</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">4. Üyelik ve Hesap Güvenliği</h2>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Kullanıcılar, kayıt sırasında doğru, güncel ve eksiksiz bilgi verme yükümlülüğündedir.</li>
            <li>Hesap şifresinin gizliliği kullanıcıya aittir. Şifre paylaşılmamalıdır.</li>
            <li>Hesabınızın başkaları tarafından kullanılmasından sorumlu sizsiniz.</li>
            <li>Şüpheli aktivite tespit edilirse hesabınız geçici olarak askıya alınabilir.</li>
            <li>Birden fazla hesap açmak yasaktır (tek bir kişi/şirket için tek hesap).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">5. Kullanıcı Sorumlulukları ve Yasaklı Eylemler</h2>
          <p className="text-muted-text mb-4">Platformu kullanırken aşağıdakiler yasaktır:</p>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Yasalara aykırı, dürüstlük kurallarına uygun olmayan içerik paylaşmak</li>
            <li>Başkalarının telif hakları, marka hakları veya gizliliğini ihlal etmek</li>
            <li>Spam, sahte hesap, kimlik avı (phishing) veya dolandırıcılık yapmak</li>
            <li>Platformun altyapısına zarar vermeye çalışmak, veri kazıyıcı (scraper) kullanmak</li>
            <li>Diğer kullanıcıları taciz etmek, tehdit etmek veya rahatsız etmek</li>
            <li>Yanıltıcı, yalan veya ölçüsüz reklamcılık yapmak</li>
            <li>Platform dışında ödeme/iletişim yaparak Platformun komisyon sistemini bypass etmek</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">6. Firma Profilleri ve İçerik</h2>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Firma profillerindeki bilgilerin doğruluğu firma sahibine aittir.</li>
            <li>Platform, firmaların sunduğu hizmetlerin kalitesinden, fiyatından veya güvenilirliğinden sorumlu değildir.</li>
            <li>Değerlendirmeler (yorumlar/puanlar) sadece gerçek deneyimlere dayanmalıdır. Sahte yorum yasaktır.</li>
            <li>Platform, uygunsuz içerikleri (küfür, reklam, spam, yasalara aykırı) önceden haber vermeden kaldırma hakkını saklı tutar.</li>
            <li>Fotoğrafların telif hakkı yüklenecek kişiye aittir. Telif ihlali bildiriminde içerik kaldırılır.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">7. Mesajlaşma ve İletişim</h2>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Kullanıcılar arası mesajlaşma Platform üzerinden sağlanır.</li>
            <li>Mesaj içerikleri Platform tarafından izlenebilir (güvenlik, spam önleme).</li>
            <li>Kişisel veriler (telefon, e-posta, adres) mesajlaşma sırasında paylaşılırsa bu taraflar arasında kalır.</li>
            <li>Platform dışında yapılan iletişimden/sözleşmeden Platform sorumlu tutulamaz.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">7. Premium Üyelik ve Vitrin Hizmeti</h2>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Premium üyelik aylık/yıllık abonelik temelindedir. Otomatik yenilenir (iptal edilmediği sürece).</li>
            <li>Vitrin (öne çıkan) hizmeti ödeme onayından sonra aktif olur.</li>
            <li>İade koşulları: Hizmet başladığında (profil vitrine alındığında) iade hakkı yoktur (Tüketicinin Korunması Hakkında Kanun Madde 15).</li>
            <li>Fatura/ekstre e-posta ile gönderilir.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">8. Sorumluluk Reddi ve Sınırlaması</h2>
          <p className="text-muted-text mb-4">
            Platform "olduğu gibi" sunulur. Aşağıdaki durumlardan Platform sorumlu tutulamaz:
          </p>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Üçüncü taraf (firma/müşteri) davranışlarından kaynaklanan zararlar</li>
            <li>Platforma erişim kesintisi, bakım, teknik arıza, siber saldırı</li>
            <li>Kullanıcı hatasından kaynaklanan veri kaybı</li>
            <li>İnternet bağlantısı, güç kesintisi gibi force majeure nedenleri</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">9. Fikri Mülkiyet Hakları</h2>
          <p className="text-muted-text">
            Platformun tasarımı, kodu, markası, logosu, veritabanı ve tüm yazılımları Montajım Var'a aittir. 
            Kullanıcılar Platform içeriğini (firma profilleri hariç) kopyalayamaz, dağıtamaz, değiştiremez.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">10. Sözleşmenin Feshi</h2>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Kullanıcı her an hesabını silebilir (ayarlar menüsünden).</li>
            <li>Platform, koşullar ihlali durumunda önceden uyarı yaparak veya ciddi ihlallerde uyarısız hesabı askıya alabilir/silebilir.</li>
            <li>Fesih durumunda Premium üyelik iadesi yoktur (hizmet kullanıldıysa).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">11. Değişiklikler</h2>
          <p className="text-muted-text">
            Bu koşullar, yasal düzenlemeler ve Platform güncellemeleri gerektirdiğinde değiştirilebilir. 
            Önemli değişiklikler e-posta ile veya Platform üzerinden duyurulur. Değişikliklerin yayınlanmasının 
            14 gün sonra kabul edilmiş sayılırsınız.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">12. Uyuşmazlık Çözümü ve Hukuk</h2>
          <p className="text-muted-text">
            Bu Sözleşme, Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri 
            yetkilidir. Tüketici hakları saklıdır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">13. İletişim</h2>
          <p className="text-muted-text">
            Bu koşullar hakkında sorularınız için: 
            <a href="mailto:destek@montajimvar.com" className="text-montaj hover:underline">destek@montajimvar.com</a>
          </p>
        </section>

        <p className="text-sm text-sub-text text-center pt-4 border-t border-dark-border">
          Son güncelleme: Haziran 2026
        </p>
      </div>
    </div>
  );
}