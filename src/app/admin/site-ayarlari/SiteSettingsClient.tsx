"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Save,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Palette,
  Layout,
  Type,
  Images,
  Link2,
  Globe,
  ChevronDown,
  ChevronRight,
  EyeOff,
  ToggleLeft,
} from "lucide-react";
import type { SiteSettings, SettingGroupConfig } from "@/lib/site-settings-constants";
import { SETTING_GROUPS, DEFAULT_SETTINGS } from "@/lib/site-settings-constants";

type SettingsState = Partial<SiteSettings>;

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

function getFieldValue(settings: SettingsState, group: string, fieldKey: string): string {
  const groupData = settings[group as keyof SettingsState];
  if (!groupData || typeof groupData !== "object") return "";
  const val = (groupData as Record<string, unknown>)[fieldKey];
  if (typeof val === "object" && val !== null) {
    return JSON.stringify(val, null, 2);
  }
  return String(val ?? "");
}

function setFieldValue(
  settings: SettingsState,
  group: string,
  fieldKey: string,
  value: string
): SettingsState {
  const updated = { ...settings };
  const groupData = { ...((updated[group as keyof SettingsState] as Record<string, unknown>) || {}) };

  // Check if it's a JSON object (link type)
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) {
      groupData[fieldKey] = parsed;
    } else {
      groupData[fieldKey] = value;
    }
  } catch {
    groupData[fieldKey] = value;
  }

  (updated as Record<string, unknown>)[group] = groupData;
  return updated;
}

const GROUP_ICONS: Record<string, React.ReactNode> = {
  general: <Globe className="h-4 w-4" />,
  hero: <Layout className="h-4 w-4" />,
  audience: <UsersIcon className="h-4 w-4" />,
  services: <Settings2 className="h-4 w-4" />,
  workflow: <Type className="h-4 w-4" />,
  finalCta: <Link2 className="h-4 w-4" />,
  footer: <Images className="h-4 w-4" />,
  visibility: <EyeOff className="h-4 w-4" />,
  design: <Palette className="h-4 w-4" />,
};

function UsersIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function SiteSettingsClient() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SETTING_GROUPS.forEach((g) => (initial[g.key] = true));
    return initial;
  });
  const [activeTab, setActiveTab] = useState<string>(SETTING_GROUPS[0]?.key ?? "general");
  const [previewMode, setPreviewMode] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/site-ayarlari");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Ayarlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-ayarlari", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Ayarlar başarıyla kaydedildi");
      router.refresh();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Ayarlar kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSettings({ ...DEFAULT_SETTINGS });
    toast.success("Varsayılan ayarlar yüklendi (henüz kaydedilmedi)");
  };

  const handleFieldChange = (group: string, fieldKey: string, value: string) => {
    setSettings((prev) => setFieldValue(prev, group, fieldKey, value));
  };

  const handleToggleChange = (fieldKey: string, checked: boolean) => {
    setSettings((prev) => {
      const current = prev.visibility || DEFAULT_SETTINGS.visibility;
      return {
        ...prev,
        visibility: {
          ...current,
          [fieldKey]: checked,
        } as SiteSettings["visibility"],
      };
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse space-y-2">
          <div className="h-7 w-56 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-4 w-80 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const currentGroup = SETTING_GROUPS.find((g) => g.key === activeTab);
  // Other groups (for accordion view)
  const otherGroups = SETTING_GROUPS.filter((g) => g.key !== activeTab);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Palette className="h-5 w-5 text-montaj" />
            Site Ayarları
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Anasayfa metinlerini, renkleri ve içerikleri buradan düzenleyin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Varsayılana Dön
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            {previewMode ? "Düzenle" : "Önizleme"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-montaj text-white hover:bg-montaj/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-2">
        {SETTING_GROUPS.map((group) => (
          <button
            key={group.key}
            onClick={() => setActiveTab(group.key)}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === group.key
                ? "text-montaj border-b-2 border-montaj bg-montaj/5"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {GROUP_ICONS[group.key] || <Settings2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{group.label}</span>
          </button>
        ))}
      </div>

      {/* Active Group Fields */}
      {currentGroup && (
        <div className="mb-8">
          <FieldGroup
            group={currentGroup}
            settings={settings}
            onFieldChange={handleFieldChange}
            onToggleChange={handleToggleChange}
            previewMode={previewMode}
          />
        </div>
      )}

      {/* Preview Mode */}
      {previewMode && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4 text-montaj" />
            Canlı Önizleme
          </h3>
          <PreviewPanel settings={settings} />
        </div>
      )}
    </div>
  );
}

function FieldGroup({
  group,
  settings,
  onFieldChange,
  onToggleChange,
  previewMode,
}: {
  group: SettingGroupConfig;
  settings: SettingsState;
  onFieldChange: (group: string, key: string, value: string) => void;
  onToggleChange: (key: string, checked: boolean) => void;
  previewMode: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
        <div className="flex items-center gap-2">
          {GROUP_ICONS[group.key] || <Settings2 className="h-4 w-4 text-montaj" />}
          <h2 className="font-semibold text-zinc-900 dark:text-white text-sm">
            {group.label}
          </h2>
        </div>
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {group.fields.map((field) => (
          <div key={field.key} className="px-5 py-4">
            {field.type === "toggle" ? (
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {field.label}
                </label>
                <button
                  type="button"
                  role="switch"
                  disabled={previewMode}
                  onClick={() => {
                    const vis = settings.visibility || DEFAULT_SETTINGS.visibility;
                    const current = vis[field.key as keyof typeof vis] ?? true;
                    onToggleChange(field.key, !current);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    (settings.visibility || DEFAULT_SETTINGS.visibility)[field.key as keyof SiteSettings["visibility"]] !== false
                      ? "bg-montaj"
                      : "bg-zinc-300 dark:bg-zinc-600"
                  } ${previewMode ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      (settings.visibility || DEFAULT_SETTINGS.visibility)[field.key as keyof SiteSettings["visibility"]] !== false
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ) : (
              <>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {field.label}
                </label>
                {field.description && !field.description.startsWith("{") && (
                  <p className="text-xs text-zinc-400 mb-2">{field.description}</p>
                )}
                {field.type === "color" ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={getFieldValue(settings, group.key, field.key) || "#0B5FFF"}
                      onChange={(e) => onFieldChange(group.key, field.key, e.target.value)}
                      className="h-9 w-9 rounded-md border border-zinc-300 dark:border-zinc-600 cursor-pointer"
                      disabled={previewMode}
                    />
                    <input
                      type="text"
                      value={getFieldValue(settings, group.key, field.key) || ""}
                      onChange={(e) => onFieldChange(group.key, field.key, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none"
                      disabled={previewMode}
                    />
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={getFieldValue(settings, group.key, field.key) || ""}
                    onChange={(e) => onFieldChange(group.key, field.key, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none resize-y"
                    disabled={previewMode}
                  />
                ) : field.type === "link" ? (
                  <LinkField
                    value={getFieldValue(settings, group.key, field.key) || "{}"}
                    onChange={(v) => onFieldChange(group.key, field.key, v)}
                    disabled={previewMode}
                  />
                ) : (
                  <input
                    type="text"
                    value={getFieldValue(settings, group.key, field.key) || ""}
                    onChange={(e) => onFieldChange(group.key, field.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none"
                    disabled={previewMode}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  let parsed: { label?: string; href?: string } = { label: "", href: "" };
  try {
    parsed = JSON.parse(value);
  } catch {
    // use defaults
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-zinc-400 mb-1">Buton Yazısı</label>
        <input
          type="text"
          value={parsed.label ?? ""}
          onChange={(e) => {
            const newVal = JSON.stringify({ ...parsed, label: e.target.value });
            onChange(newVal);
          }}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none"
          placeholder="Buton yazısı"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-xs text-zinc-400 mb-1">Link</label>
        <input
          type="text"
          value={parsed.href ?? ""}
          onChange={(e) => {
            const newVal = JSON.stringify({ ...parsed, href: e.target.value });
            onChange(newVal);
          }}
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none"
          placeholder="/ornek-link"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

// ─── Preview Panel ────────────────────────────────────────

function PreviewPanel({ settings }: { settings: SettingsState }) {
  const hero = (settings.hero || DEFAULT_SETTINGS.hero) as SiteSettings["hero"];
  const finalCta = (settings.finalCta || DEFAULT_SETTINGS.finalCta) as SiteSettings["finalCta"];
  const general = (settings.general || DEFAULT_SETTINGS.general) as SiteSettings["general"];

  return (
    <div className="space-y-6">
      {/* Hero Preview */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-gradient-to-b from-blue-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-montaj/10 text-montaj text-xs font-medium mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-montaj" />
          {hero.badge}
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          {hero.headline}
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {hero.description}
        </p>
        <div className="flex gap-2 mt-4">
          <span className="px-4 py-2 rounded-lg bg-montaj text-white text-sm font-medium">
            {hero.primaryCta.label}
          </span>
          <span className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm font-medium">
            {hero.secondaryCta.label}
          </span>
        </div>
      </div>

      {/* Final CTA Preview */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 text-center">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          {finalCta.title}
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {finalCta.description}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <span className="px-4 py-2 rounded-lg bg-montaj text-white text-sm font-medium">
            {finalCta.primary.label}
          </span>
          <span className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm font-medium">
            {finalCta.secondary.label}
          </span>
        </div>
      </div>

      {/* Colors */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Tema Renkleri
        </h4>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg border border-zinc-300"
            style={{ backgroundColor: general.themeColor }}
          />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {general.themeColor}
          </span>
        </div>
      </div>
    </div>
  );
}