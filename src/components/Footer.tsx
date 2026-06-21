export default function Footer() {
  return (
    <footer className="bg-black text-sub-text mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔧</span>
              <span className="font-bold text-xl text-montaj">Montajım Var</span>
            </div>
            <p className="text-sm text-sub-text">
              Türkiye&apos;nin montaj platformu. Montaj firmaları, üreticiler ve müşterileri bir araya getiriyor.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/ara" className="text-sub-text hover:text-montaj transition">Firmalar</a></li>
              <li><a href="/auth/kayit" className="text-sub-text hover:text-montaj transition">Kaydol</a></li>
              <li><a href="/auth/giris" className="text-sub-text hover:text-montaj transition">Giriş Yap</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm text-sub-text">
              <li>Email: info@montajimvar.com</li>
              <li>Telefon: +90 (212) 555 0000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Montajım Var. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
