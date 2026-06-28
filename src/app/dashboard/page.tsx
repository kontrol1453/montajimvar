import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, Star, MessageSquare, Heart, TrendingUp, Calendar, CreditCard, Users, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import PremiumBadge from "@/components/PremiumBadge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const userId = (session.user as any).id;
  const roles: string[] = (session.user as any).roles || [];

  const [messageCount, unreadCount, profile, userRecord] = await Promise.all([
    prisma.message.count({ where: { receiverId: userId } }),
    prisma.message.count({ where: { receiverId: userId, isRead: false } }),
    prisma.profile.findUnique({ where: { userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { premiumUntil: true, name: true },
    }),
  ]);

  const premiumUntil = profile?.premiumUntil || userRecord?.premiumUntil || null;
  const isPremium = premiumUntil != null && new Date(premiumUntil) > new Date();
  const canHaveProfile = roles.includes("ASSEMBLER") || roles.includes("MANUFACTURER");

  // Analytics for ASSEMBLER/MANUFACTURER
  let analytics = null;
  if (profile && (roles.includes("ASSEMBLER") || roles.includes("MANUFACTURER"))) {
    const [sentMessages, reviewCount, favoriteCount, jobCount, offerCount] = await Promise.all([
      prisma.message.count({ where: { senderId: userId } }),
      prisma.review.count({ where: { profileId: profile.id } }),
      prisma.favorite.count({ where: { profileId: profile.id } }),
      prisma.job.count({ where: { customerId: userId } }),
      prisma.offer.count({ where: { artisanId: userId } }),
    ]);
    analytics = {
      viewCount: profile.viewCount,
      ratingAvg: profile.ratingAvg,
      sentMessages,
      reviewCount,
      favoriteCount,
      jobCount,
      offerCount,
    };
  }

  // Premium stats
  const stats = [
    {
      title: "Bugünkü İşler",
      value: analytics?.jobCount || 0,
      icon: Calendar,
      color: "#0B5FFF",
      href: "/dashboard/isler",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Gelir (Bu Ay)",
      value: isPremium ? "₺12,450" : "₺—",
      icon: CreditCard,
      color: "#00C853",
      href: "/dashboard/gelirler",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Bekleyen Teklif",
      value: analytics?.offerCount || 0,
      icon: TrendingUp,
      color: "#F59E0B",
      href: "/dashboard/teklifler",
      trend: "3 yeni",
      trendUp: false,
    },
    {
      title: "Aktif Ekip",
      value: analytics?.reviewCount || 0,
      icon: Users,
      color: "#8B5CF6",
      href: "/dashboard/ekip",
      trend: "+2",
      trendUp: true,
    },
  ];

  // Quick actions based on role
  const quickActions = roles.includes("CUSTOMER") ? [
    { name: "İş Ver", href: "/is-ver", icon: Building2, color: "#0B5FFF" },
    { name: "Firma Ara", href: "/ara", icon: Shield, color: "#00C853" },
    { name: "Mesajlar", href: "/dashboard/mesajlar", icon: MessageSquare, color: "#F59E0B" },
    { name: "Favoriler", href: "/dashboard/favoriler", icon: Heart, color: "#EF4444" },
  ] : [
    { name: "İşlerim", href: "/dashboard/isler", icon: Calendar, color: "#0B5FFF" },
    { name: "Mesajlar", href: "/dashboard/mesajlar", icon: MessageSquare, color: "#00C853" },
    { name: "Profil", href: "/dashboard/firma", icon: Building2, color: "#F59E0B" },
    { name: "Üyelik", href: "/dashboard/uyelik", icon: Shield, color: "#8B5CF6" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <p className="text-sm font-medium text-[var(--color-primary)]">Hoş geldiniz, {userRecord?.name || "Kullanıcı"}</p>
            <h1 className="text-3xl font-extrabold text-[var(--color-dark)] mt-1" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
              Dashboard
            </h1>
            <p className="text-[var(--color-text-tertiary)] mt-1">Platformunuzun durumu ve hızlı erişim.</p>
          </div>
          {isPremium && (
            <PremiumBadge label="Premium" color="amber" size="lg" />
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
              >
                <Link
                  href={stat.href}
                  className="card p-6 group flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${stat.color}10` }}
                    >
                      <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] transition-colors opacity-0 group-hover:opacity-100"
                    />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-tertiary)] mb-1">{stat.title}</p>
                  <p className="text-2xl font-extrabold text-[var(--color-dark)] flex-1" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-xs">
                    <span style={{ color: stat.trendUp ? "#00C853" : "#EF4444" }}>{stat.trend}</span>
                    <span className="text-[var(--color-text-tertiary)]">bu ay</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Firma Analitikleri (for assemblers/manufacturers) */}
        {analytics && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-[var(--color-dark)] mb-5" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
              Firma Analitikleri
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: "Profil Görüntülenme", value: analytics.viewCount, icon: "👁️", color: "#0B5FFF" },
                { label: "Ortalama Puan", value: analytics.ratingAvg > 0 ? analytics.ratingAvg.toFixed(1) : "—", icon: "⭐", color: "#F59E0B" },
                { label: "Yorum Sayısı", value: analytics.reviewCount, icon: "💬", color: "#00C853" },
                { label: "Gönderilen Mesaj", value: analytics.sentMessages, icon: "📤", color: "#8B5CF6" },
                { label: "Favoriye Eklenme", value: analytics.favoriteCount, icon: "❤️", color: "#EF4444" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.05 }}
                >
                  <div className="card p-5 text-center group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl" style={{ background: `${item.color}10` }}>
                      {item.icon}
                    </div>
                    <p className="text-2xl font-extrabold text-[var(--color-dark)] mb-1" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                      {item.value}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Premium active but no profile */}
        {isPremium && !profile && canHaveProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="bg-gradient-to-r from-[var(--color-primary)]/5 via-white to-[var(--color-accent)]/5 border border-[var(--color-primary)]/20 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#0B5FFF10" }}>
                <Building2 size={24} className="text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--color-dark)] mb-1">Premium Üyeliğiniz Aktif!</h3>
                <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
                  Premium avantajlarından (aramada üst sıra, premium rozeti, vitrin desteği) yararlanmak için
                  firma profili oluşturun.
                </p>
                <Link
                  href="/dashboard/firma"
                  className="btn-primary !py-2 !px-4 !text-sm"
                >
                  Firma Profili Oluştur
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-[var(--color-dark)] mb-5" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            Hızlı İşlemler
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.05 }}
              >
                <Link
                  href={action.href}
                  className="card p-5 group text-center"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all group-hover:scale-110"
                    style={{ background: `${action.color}10` }}
                  >
                    <action.icon size={24} style={{ color: action.color }} />
                  </div>
                  <p className="font-semibold text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                    {action.name}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}