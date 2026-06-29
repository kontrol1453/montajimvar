"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const URGENCY_OPTIONS = [
  { value: "normal", label: "Normal", desc: "1-3 gün içinde", icon: "📅" },
  { value: "acil", label: "Acil", desc: "24 saat içinde", icon: "⚡" },
  { value: "cok_acil", label: "Çok Acil", desc: "Hemen", icon: "🔥" },
];

interface FormData {
  title: string;
  description: string;
  urgency: string;
  budgetMin: string;
  budgetMax: string;
}

interface Props {
  data: FormData;
  updateData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepDetails({ data, updateData, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.title || data.title.length < 10)
      errs.title = "Başlık en az 10 karakter olmalıdır.";
    if (!data.description || data.description.length < 20)
      errs.description = "Açıklama en az 20 karakter olmalıdır.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">İş Detayları</h2>
        <p className="text-sub-text text-sm">İşiniz hakkında detaylı bilgi verin</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-text mb-1.5">İş Başlığı *</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          placeholder="Örn: 3 adet IKEA PAX dolap montajı"
          maxLength={100}
          className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-dark-card text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj focus:border-transparent ${
            errors.title ? "border-red-500" : "border-dark-border"
          }`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
        <p className="mt-1 text-xs text-sub-text">{data.title.length}/100</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-text mb-1.5">İş Açıklaması *</label>
        <textarea
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          placeholder="İşiniz hakkında detaylı bilgi verin... Kaç adet ürün, hangi marka, ölçüler, varsa özel durumlar..."
          rows={5}
          className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-dark-card text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj focus:border-transparent resize-none ${
            errors.description ? "border-red-500" : "border-dark-border"
          }`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
        <p className="mt-1 text-xs text-sub-text">{data.description.length} karakter</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-text mb-2">Çalışma Zamanı</label>
        <div className="grid grid-cols-3 gap-3">
          {URGENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateData({ urgency: opt.value })}
              className={`p-3 rounded-xl border text-center transition-all ${
                data.urgency === opt.value
                  ? "bg-montaj/20 border-montaj/30 text-montaj"
                  : "bg-dark-card border-white/[0.06] text-muted-text hover:border-montaj/20"
              }`}
            >
              <div className="text-xl mb-1">{opt.icon}</div>
              <div className="text-sm font-medium">{opt.label}</div>
              <div className="text-xs text-sub-text mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-text mb-2">Bütçe Aralığı (opsiyonel)</label>
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <input
              type="number"
              value={data.budgetMin}
              onChange={(e) => updateData({ budgetMin: e.target.value })}
              placeholder="Min ₺"
              min={0}
              className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj focus:border-transparent"
            />
          </div>
          <span className="text-sub-text">-</span>
          <div className="flex-1">
            <input
              type="number"
              value={data.budgetMax}
              onChange={(e) => updateData({ budgetMax: e.target.value })}
              placeholder="Max ₺"
              min={0}
              className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Geri</Button>
        <Button variant="primary" size="lg" onClick={handleNext}>Devam</Button>
      </div>
    </div>
  );
}
