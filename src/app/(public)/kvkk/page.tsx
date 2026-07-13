import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Montajım Var",
  description: "Kişisel verilerin korunması kapsamında Montajım Var KVKK aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">KVKK Aydınlatma Metni</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70">
          <p>
            Montajım Var olarak, kişisel verilerinizin güvenliğine önem vermekteyiz. 
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) 
            kapsamında veri sorumlusu sıfatıyla hangi kişisel verilerinizi hangi amaçlarla 
            işlediğimiz konusunda sizi bilgilendirmek amacıyla hazırlanmıştır.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Veri Sorumlusu</h2>
          <p>
            Veri sorumlusu olarak Montajım Var, kişisel verilerinizi aşağıda açıklanan 
            kapsamda ve amaçla işleyebilecektir.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. İşlenen Kişisel Veriler</h2>
          <p>
            Platformumuz üzerinden topladığımız kişisel veriler şunlardır:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Kimlik bilgileri (ad, soyad)</li>
            <li>İletişim bilgileri (e-posta, telefon)</li>
            <li>Kullanıcı bilgileri (şifre, profil fotoğrafı)</li>
            <li>İşlem bilgileri (iş geçmişi, ödeme bilgileri)</li>
            <li>Konum bilgileri (şehir, ilçe, adres)</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Veri İşleme Amaçları</h2>
          <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Hesap oluşturma ve yönetimi</li>
            <li>Hizmetlerin sunulması ve takibi</li>
            <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
            <li>Müşteri destek hizmetleri</li>
            <li>Hukuki yükümlülüklerin yerine getirilmesi</li>
            <li>Pazarlama ve reklam faaliyetleri (onayınız dahilinde)</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Verilerin Aktarılması</h2>
          <p>
            Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle 
            paylaşılmamaktadır. Ödeme hizmet sağlayıcıları ile sınırlı ölçüde 
            paylaşılabilir.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Haklarınız</h2>
          <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse bilgi talep etme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini talep etme</li>
            <li>İtiraz etme</li>
          </ul>

          <p className="mt-8">
            Taleplerinizi info@montajimvar.com adresine iletebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
