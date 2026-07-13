import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Montajım Var",
  description: "Montajım Var platformunun gizlilik politikası ve KVKK uyumluluk bilgileri.",
};

export default function GizlilikPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Gizlilik Politikası ve KVKK Aydınlatma Metni</h1>

      <div className="bg-dark-card rounded-xl border border-dark-border p-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">1. Veri Sorumlusu</h2>
          <p className="text-muted-text">
            Montajım Var platformu ("Platform"), veri sorumlusu olarak, Kişisel Verilerin Korunması Kanunu ("KVKK") 
            ve Genel Veri Koruma Yönetmeliği ("GDPR") kapsamında kişisel verilerinizi korumayı taahhüt eder.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">2. Toplanan Kişisel Veriler</h2>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, e-posta adresi, telefon numarası</li>
            <li><strong>Firma Bilgileri:</strong> Firma adı, adres, şehir, web sitesi, WhatsApp numarası</li>
            <li><strong>Konum Bilgileri:</strong> Şehir, ilçe, enlem/boylam (isteğe bağlı)</li>
            <li><strong>İletişim Verileri:</strong> Mesajlaşma içeriği, iletişim formu verileri</li>
            <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgileri, çerezler, oturum verileri</li>
            <li><strong>İşlem Verileri:</strong> Profil görüntüleme sayısı, favori işlemleri, değerlendirmeler</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">3. Verilerin İşlenme Amaçları</h2>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Hesap oluşturma ve yönetimi</li>
            <li>Firma profili oluşturma ve yayınlama</li>
            <li>Kullanıcılar arası iletişimi sağlama (mesajlaşma)</li>
            <li>Arama ve filtreleme hizmetleri sunma</li>
            <li>Değerlendirme ve puanlama sistemi</li>
            <li>Güvenlik ve dolandırıcılık önleme</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Platform iyileştirme ve analitik</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">4. Verilerin Paylaşılması</h2>
          <p className="text-muted-text mb-4">
            Kişisel verileriniz; yasal zorunluluklar dışında, sizin açık rızanız olmadan üçüncü taraflarla paylaşılmaz.
            Paylaşım durumları:
          </p>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Diğer platform kullanıcılarıyla (mesajlaşma, firma profili görünürlüğü)</li>
            <li>Yasal makamlarla (mahkeme, savcılık, BTK vb. talep halinde)</li>
            <li>Hizmet sağlayıcılarımızla (bulut depolama, e-posta gönderimi, analitik - sadece gerekli ölçüde)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">5. Veri Saklama Süresi</h2>
          <p className="text-muted-text">
            Kişisel verileriniz, işlenme amacı gerçekleşene veya yasal saklama süreleri bitene kadar saklanır. 
            Hesabınızı sildiğinizde verileriniz 30 gün içinde silinir (yasal bekletme yükümlülükleri hariç).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">6. Kullanıcı Hakları (KVKK Madde 11)</h2>
          <p className="text-muted-text mb-4">
            KVKK Madde 11 uyarınca aşağıdaki haklara sahipsiniz:
          </p>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenen verilerinizin ne amaçla işlendiğini ve amaca uygun olarak kullanılıp kullanılmadığını bilme</li>
            <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse bunların düzeltilmesini isteme</li>
            <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
            <li>Verilerinizin işlenmesine itiraz etme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">7. Çerezler (Cookies)</h2>
          <p className="text-muted-text mb-4">
            Platformumuz, kullanıcı deneyimini iyileştirmek, oturum yönetimi ve analitik için çerezleri kullanır:
          </p>
          <ul className="space-y-2 text-muted-text list-disc pl-6">
            <li><strong>Zorunlu Çerezler:</strong> Oturum yönetimi, güvenlik (oturum açma, CSRF koruması)</li>
            <li><strong>Tercih Çerezleri:</strong> Tema tercihi (koyu/açık), dil ayarları</li>
            <li><strong>Analitik Çerezler:</strong> Sayfa görüntülemeleri, kullanıcı davranışı analizi (anonimleştirilmiş)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">8. Veri Güvenliği</h2>
          <p className="text-muted-text">
            Verilerinizin güvenliği için teknik ve idari önlemler alınmıştır: SSL/TLS şifreleme, 
            şifre hashleme (bcrypt), erişim kontrolü, düzenli güvenlik denetimleri.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">9. İletişim</h2>
          <p className="text-muted-text">
            Gizlilik politikası ve KVKK başvurularınız için: 
            <a href="mailto:destek@montajimvar.com" className="text-montaj hover:underline">destek@montajimvar.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-montaj mb-4">10. Güncellemeler</h2>
          <p className="text-muted-text">
            Bu gizlilik politikası, yasal düzenlemeler ve platform değişiklikleri doğrultusunda güncellenebilir. 
            Değişiklikler bu sayfada yayınlanacaktır. Son güncelleme: <strong>Haziran 2026</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}