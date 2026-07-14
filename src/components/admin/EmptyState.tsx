"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4", className)}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-[var(--admin-surface-muted)] flex items-center justify-center mb-4 text-[var(--admin-text-muted)]">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-[var(--admin-text-primary)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--admin-text-muted)] max-w-sm mb-4">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Pre-configured empty states
export function EmptyUsers({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
      title="Henüz kullanıcı yok"
      description="Sistemde kayıtlı hiç kullanıcı bulunamadı."
      action={onCreate && (
        <button onClick={onCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium">
          İlk kullanıcıyı ekle
        </button>
      )}
    />
  );
}

export function EmptyJobs({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
      title="Henüz iş ilanı yok"
      description="Müşterilerinizden herhangi biri henüz iş ilanı oluşturmamış."
      action={onCreate && (
        <button onClick={onCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium">
          İş ilanı oluştur
        </button>
      )}
    />
  );
}

export function EmptyCompanies({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
      title="Henüz firma yok"
      description="Sistemde onaylı veya bekleyen firma profili bulunamadı."
      action={onCreate && (
        <button onClick={onCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium">
          Firma ekle
        </button>
      )}
    />
  );
}

export function EmptyReviews() {
  return (
    <EmptyState
      icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
      title="Henüz yorum yok"
      description="Sistemde hiç yorum veya değerlendirme bulunamadı."
    />
  );
}

export function EmptyDisputes() {
  return (
    <EmptyState
      icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
      title="Anlaşmazlık yok"
      description="Şu anda açık veya çözülmüş hiç anlaşmazlık bulunamadı."
    />
  );
}

export function EmptyCertificates() {
  return (
    <EmptyState
      icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
      title="Sertifika yok"
      description="Henüz tanımlı bir sertifika veya kategori bulunamadı."
    />
  );
}

export function EmptyGeneric({ title = "Veri bulunamadı", description = "Listelenecek hiçbir kayıt yok.", icon }: { title?: string; description?: string; icon?: ReactNode }) {
  return (
    <EmptyState
      icon={icon || <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
      title={title}
      description={description}
    />
  );
}