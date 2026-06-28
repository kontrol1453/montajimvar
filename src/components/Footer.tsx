import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark)] text-[#eaecf0] mt-auto">
      <div className="container-app py-16">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Şirket */}
          <div>
            <span
              className="text-xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
            >
              Montajım<span style={{ color: "var(--color-primary)" }}>Var</span>
            </span>
            <p className="mt-3 text-sm text-[#98a2b3] leading-relaxed max-w-xs">
              Kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturan
              profesyonel platform.
            </p>
            <div className="mt-5 text-sm text-[#98a2b3] space-y-1">
              <p>info@montajimvar.com</p>
              <p>+90 (212) 555 0000</p>
            </div>
          </div>

          {/* Hizmetler */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Hizmetler
            </h3>
            <ul className="space-y-3">
              {[
                ["Mobilya Montajı", "/ara?q=Mobilya"],
                ["Reklam Tabelası", "/ara?q=Reklam"],
                ["AVM Montajı", "/ara?q=AVM"],
                ["Fuar Standı", "/ara?q=Fuar"],
                ["Elektrik Montajı", "/ara?q=Elektrik"],
                ["Kurumsal Çözümler", "/kurumsal"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#98a2b3] hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Destek
            </h3>
            <ul className="space-y-3">
              {[
                ["Yardım Merkezi", "/yardim"],
                ["Sık Sorulan Sorular", "/#sss"],
                ["İletişim", "/iletisim"],
                ["Güvenlik", "/guvenlik"],
                ["İş Sağlığı ve Güvenliği", "/is-sagligi"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#98a2b3] hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Yasal
            </h3>
            <ul className="space-y-3">
              {[
                ["Kullanım Koşulları", "/kullanim-kosullari"],
                ["Gizlilik Politikası", "/gizlilik"],
                ["Çerez Politikası", "/cerez"],
                ["KVKK Aydınlatma Metni", "/kvkk"],
                ["Ön Bilgilendirme Formu", "/on-bilgilendirme"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#98a2b3] hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#ffffff]/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#98a2b3]">
          <p>
            &copy; {new Date().getFullYear()} Montajım Var. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/kvkk" className="hover:text-white transition-colors">
              KVKK
            </Link>
            <span className="w-px h-3 bg-[#ffffff]/10" />
            <Link href="/cerez" className="hover:text-white transition-colors">
              Çerez
            </Link>
            <span className="w-px h-3 bg-[#ffffff]/10" />
            <Link href="/kullanim-kosullari" className="hover:text-white transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
