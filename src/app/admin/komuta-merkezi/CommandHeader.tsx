export default function CommandHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--admin-text-primary)] tracking-tight">
          Komuta Merkezi
        </h1>
        <p className="text-sm text-[var(--admin-text-secondary)] mt-1">
          Platform operasyonlarını, bekleyen işlemleri ve kritik durumları tek noktadan yönetin.
        </p>
      </div>
    </div>
  );
}
