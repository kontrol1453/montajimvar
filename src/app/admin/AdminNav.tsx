"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar" },
  { href: "/admin/firmalar", label: "Firmalar" },
  { href: "/admin/isler", label: "İşler" },
  { href: "/admin/yorumlar", label: "Yorumlar" },
  { href: "/admin/bildirim", label: "Bildirim" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/kategoriler", label: "Kategoriler" },
  { href: "/admin/izinler", label: "İzinler" },
  { href: "/admin/google-firma-ekle", label: "Google Firma" },
  { href: "/admin/abonelik-plani", label: "Abonelik" },
];

export default function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="hidden md:flex items-center gap-4 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-1.5 rounded-lg transition font-medium ${
            isActive(link.href)
              ? "bg-montaj/20 text-montaj"
              : "text-sub-text hover:text-white hover:bg-dark-section"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
