import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  AlertCircle,
  Star,
  FileText,
  Shield,
  DollarSign,
  CreditCard,
  Bell,
} from "lucide-react";
import { PageTitle, PageContainer, SectionTitle, Stack } from "@/components/ui/Typography";
import StatCard from "@/components/admin/StatCard";

export default async function AdminDashboardPage() {
  const [
    userCount,
    profileCount,
    unverifiedCount,
    reviewCount,
    permCount,
    jobCount,
    blogCount,
    jobReviewCount,
    paymentStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.profile.count(),
    prisma.profile.count({ where: { isVerified: false } }),
    prisma.review.count(),
    prisma.rolePermission.count(),
    prisma.job.count(),
    prisma.blogPost.count(),
    prisma.jobReview.count(),
    prisma.payment.aggregate({
      _sum: { amount: true, commission: true },
      _count: true,
    }) ?? { _sum: { amount: 0, commission: 0 }, _count: 0 },
  ]);

  const totalAmount = Number(paymentStats._sum?.amount ?? 0);
  const totalCommission = Number(paymentStats._sum?.commission ?? 0);
  const totalCount = Number(paymentStats._count ?? 0);

  const stats = [
    {
      label: "Toplam Kullanıcı",
      value: userCount,
      icon: <Users size={24} />,
      href: "/admin/kullanicilar",
      variant: "blue" as const,
    },
    {
      label: "Firma Profili",
      value: profileCount,
      icon: <Building2 size={24} />,
      href: "/admin/firmalar",
      variant: "amber" as const,
    },
    {
      label: "Toplam İş",
      value: jobCount,
      icon: <Briefcase size={24} />,
      href: "/admin/isler",
      variant: "cyan" as const,
    },
    {
      label: "Onay Bekleyen",
      value: unverifiedCount,
      icon: <AlertCircle size={24} />,
      href: "/admin/firmalar",
      variant: "yellow" as const,
    },
    {
      label: "Firma Yorumu",
      value: reviewCount,
      icon: <Star size={24} />,
      href: "/admin/yorumlar",
      variant: "purple" as const,
    },
    {
      label: "İş Yorumu",
      value: jobReviewCount,
      icon: <Star size={24} />,
      href: "/admin/yorumlar",
      variant: "pink" as const,
    },
    {
      label: "Blog Yazısı",
      value: blogCount,
      icon: <FileText size={24} />,
      href: "/admin/blog",
      variant: "emerald" as const,
    },
    {
      label: "Rol İzinleri",
      value: permCount,
      icon: <Shield size={24} />,
      href: "/admin/izinler",
      variant: "orange" as const,
    },
  ];

  const quickActions = [
    {
      href: "/admin/kullanicilar",
      title: "Kullanıcıları Yönet",
      desc: `${userCount} kullanıcıyı görüntüle ve yönet`,
      icon: <Users size={20} />,
      variant: "blue" as const,
    },
    {
      href: "/admin/firmalar",
      title: "Firmaları Onayla",
      desc:
        unverifiedCount > 0
          ? `${unverifiedCount} firma onay bekliyor`
          : "Tüm firmalar onaylanmış",
      icon: <AlertCircle size={20} />,
      variant: "emerald" as const,
    },
    {
      href: "/admin/kategoriler",
      title: "Kategorileri Yönet",
      desc: "Kategori ekle, düzenle, sil",
      icon: <Building2 size={20} />,
      variant: "purple" as const,
    },
    {
      href: "/admin/izinler",
      title: "Rol İzinleri",
      desc: "Rollerin görebileceği özellikleri belirleyin",
      icon: <Shield size={20} />,
      variant: "pink" as const,
    },
    {
      href: "/admin/isler",
      title: "İşleri Yönet",
      desc: `${jobCount} iş kaydı, durum takibi ve teklifler`,
      icon: <Briefcase size={20} />,
      variant: "cyan" as const,
    },
    {
      href: "/admin/yorumlar",
      title: "Yorumları Yönet",
      desc: `${reviewCount + jobReviewCount} yorum, denetleme ve silme`,
      icon: <Star size={20} />,
      variant: "amber" as const,
    },
    {
      href: "/admin/bildirim",
      title: "Bildirim Merkezi",
      desc: "Push notification gönder, admin bildirimlerini gör",
      icon: <Bell size={20} />,
      variant: "orange" as const,
    },
    {
      href: "/admin/abonelik-plani",
      title: "Abonelik Planları",
      desc: "Premium planları yönetin",
      icon: <CreditCard size={20} />,
      variant: "yellow" as const,
    },
    {
      href: "/admin/blog",
      title: "Blog Yazıları",
      desc: `${blogCount} yayında olan yazı`,
      icon: <FileText size={20} />,
      variant: "emerald" as const,
    },
  ];

  return (
    <PageContainer>
      <Stack>
        <PageTitle
          actions={
            <div className="flex items-center gap-2">
              <Link
                href="/admin/kullanicilar"
                className="text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]"
              >
                Kullanıcılar
              </Link>
              <span className="text-[var(--admin-border)]">|</span>
              <Link
                href="/admin/firmalar"
                className="text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]"
              >
                Firmalar
              </Link>
            </div>
          }
        >
          Admin Paneli
        </PageTitle>

        {/* Stats grid */}
        <SectionTitle>İstatistikler</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              href={stat.href}
              variant={stat.variant}
            />
          ))}
        </div>

        {/* Revenue */}
        <SectionTitle>Gelir Özeti</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Toplam Gelir"
            value={`${(totalAmount / 100).toLocaleString("tr-TR")} TL`}
            icon={<DollarSign size={24} />}
            variant="emerald"
          />
          <StatCard
            label="Toplam Komisyon"
            value={`${(totalCommission / 100).toLocaleString("tr-TR")} TL`}
            icon={<CreditCard size={24} />}
            variant="amber"
          />
          <StatCard
            label="Toplam Ödeme"
            value={totalCount}
            icon={<DollarSign size={24} />}
            variant="blue"
          />
        </div>

        {/* Quick actions */}
        <SectionTitle>Hızlı İşlemler</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:border-[var(--admin-primary)] transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  action.variant === "blue"
                    ? "bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]"
                    : action.variant === "amber"
                      ? "bg-amber-100 text-amber-600"
                      : action.variant === "cyan"
                        ? "bg-cyan-100 text-cyan-600"
                        : action.variant === "yellow"
                          ? "bg-yellow-100 text-yellow-600"
                          : action.variant === "purple"
                            ? "bg-purple-100 text-purple-600"
                            : action.variant === "pink"
                              ? "bg-pink-100 text-pink-600"
                              : action.variant === "emerald"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-orange-100 text-orange-600"
                }`}
              >
                {action.icon}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-[var(--admin-text-primary)]">
                  {action.title}
                </p>
                <p className="text-sm text-[var(--admin-text-secondary)]">
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Stack>
    </PageContainer>
  );
}