import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "İletişim | Montajım Var",
  description: "Montajım Var iletişim bilgileri. Sorularınız ve önerileriniz için bize ulaşın.",
  alternates: {
    canonical: "/iletisim",
  },
  openGraph: {
    title: "İletişim | Montajım Var",
    description: "Sorularınız ve önerileriniz için bize ulaşın.",
  },
  twitter: {
    card: "summary_large_image",
    title: "İletişim | Montajım Var",
    description: "Sorularınız ve önerileriniz için bize ulaşın.",
  },
};

export default function IletisimPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">İletişim</h1>
        <div className="grid gap-6">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-white font-semibold mb-2">E-posta</h2>
            <p className="text-sub-text">info@montajimvar.com</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-white font-semibold mb-2">Destek</h2>
            <p className="text-sub-text">Sorularınız için info@montajimvar.com adresine e-posta gönderebilirsiniz.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
