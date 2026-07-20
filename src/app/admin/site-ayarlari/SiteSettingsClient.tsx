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
  Sparkles,
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

  const handleDesignChange = (key: string, value: string) => {
    setSettings((prev) => {
      const current = prev.design || DEFAULT_SETTINGS.design;
      return {
        ...prev,
        design: {
          ...current,
          [key]: value,
        } as SiteSettings["design"],
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
      {activeTab === "design" ? (
        <div className="mb-8">
          <DesignPanel
            design={settings.design || DEFAULT_SETTINGS.design}
            settings={settings}
            onDesignChange={handleDesignChange}
            onContentChange={handleFieldChange}
            previewMode={previewMode}
          />
        </div>
      ) : currentGroup && (
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

// ─── Click-to-Edit ─────────────────────────────────────────

function getContentValue(settings: SettingsState, group: string, field: string): string {
  const g = settings[group as keyof SettingsState] as Record<string, unknown> | undefined;
  if (!g) return "";
  const v = g[field];
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function ClickToEdit({
  group,
  field,
  settings,
  onChange,
  previewMode,
  className = "",
  as = "span",
  style,
}: {
  group: string;
  field: string;
  settings: SettingsState;
  onChange: (group: string, field: string, value: string) => void;
  previewMode: boolean;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const val = getContentValue(settings, group, field);
  const display = val || (group === "hero" && field === "badge" ? "Rozet Yazısı" :
    group === "hero" && field === "headline" ? "Ana Başlık" :
    group === "hero" && field === "description" ? "Açıklama metni..." :
    group === "hero" && field === "searchPlaceholder" ? "Ara..." :
    group === "services" && field === "sectionTitle" ? "Hizmetler Başlığı" :
    group === "audience" && field === "sectionTitle" ? "Hedef Kitle Başlığı" : "Metin");

  if (editing && !previewMode) {
    const Tag = as;
    return (
      <Tag className={className} style={style}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => { onChange(group, field, draft); setEditing(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") { onChange(group, field, draft); setEditing(false); } if (e.key === "Escape") { setEditing(false); } }}
          className="w-full bg-transparent border-b-2 border-montaj outline-none px-0 py-0.5 text-inherit font-inherit"
          autoFocus
        />
      </Tag>
    );
  }

  return (
    <span
      onClick={() => { if (!previewMode) { setDraft(val); setEditing(true); } }}
      className={`${className} ${!previewMode ? "cursor-pointer hover:ring-1 hover:ring-montaj/40 hover:bg-montaj/5 rounded px-0.5 -mx-0.5 transition-all" : ""}`}
      style={style}
      title={!previewMode ? "Tıklayarak düzenle" : undefined}
    >
      {display}
    </span>
  );
}

function ClickToEditTextarea({
  group,
  field,
  settings,
  onChange,
  previewMode,
  className = "",
  style,
}: {
  group: string;
  field: string;
  settings: SettingsState;
  onChange: (group: string, field: string, value: string) => void;
  previewMode: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const val = getContentValue(settings, group, field);

  if (editing && !previewMode) {
    return (
      <div className={className} style={style}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => { onChange(group, field, draft); setEditing(false); }}
          onKeyDown={(e) => { if (e.key === "Escape") { setEditing(false); } }}
          className="w-full bg-transparent border-2 border-montaj outline-none rounded px-1 py-0.5 text-inherit font-inherit resize-none"
          rows={3}
          autoFocus
        />
      </div>
    );
  }

  return (
    <span
      onClick={() => { if (!previewMode) { setDraft(val); setEditing(true); } }}
      className={`${className} ${!previewMode ? "cursor-pointer hover:ring-1 hover:ring-montaj/40 hover:bg-montaj/5 rounded px-0.5 -mx-0.5 transition-all" : ""}`}
      style={style}
      title={!previewMode ? "Tıklayarak düzenle" : undefined}
    >
      {val || "Metin..."}
    </span>
  );
}

// ─── Design Panel ──────────────────────────────────────────

const DESIGN_PRESETS = [
  {
    name: "Montajım Var",
    desc: "Varsayılan mavi tema",
    design: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingFont: "Inter, system-ui, sans-serif",
      baseFontSize: "16px",
      borderRadius: "12px",
      sectionGap: "4rem",
      primaryColor: "#0B5FFF",
      textColor: "#18181b",
      headingColor: "#09090b",
      backgroundColor: "#ffffff",
      sectionBgColor: "#fafafa",
      cardBgColor: "#ffffff",
      accentColor: "#f59e0b",
      ctaBgColor: "#0B5FFF",
      ctaTextColor: "#ffffff",
    },
  },
  {
    name: "Koyu Modern",
    desc: "Koyu tema, turkuaz vurgu",
    design: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingFont: "Inter, system-ui, sans-serif",
      baseFontSize: "16px",
      borderRadius: "16px",
      sectionGap: "4rem",
      primaryColor: "#14b8a6",
      textColor: "#e4e4e7",
      headingColor: "#fafafa",
      backgroundColor: "#09090b",
      sectionBgColor: "#18181b",
      cardBgColor: "#27272a",
      accentColor: "#fbbf24",
      ctaBgColor: "#14b8a6",
      ctaTextColor: "#09090b",
    },
  },
  {
    name: "Minimal Beyaz",
    desc: "Sade, minimalist, siyah-beyaz",
    design: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingFont: "Inter, system-ui, sans-serif",
      baseFontSize: "16px",
      borderRadius: "8px",
      sectionGap: "5rem",
      primaryColor: "#000000",
      textColor: "#333333",
      headingColor: "#000000",
      backgroundColor: "#ffffff",
      sectionBgColor: "#f5f5f5",
      cardBgColor: "#ffffff",
      accentColor: "#666666",
      ctaBgColor: "#000000",
      ctaTextColor: "#ffffff",
    },
  },
  {
    name: "Yeşil Doğa",
    desc: "Doğal yeşil tonları, yumuşak",
    design: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingFont: "Inter, system-ui, sans-serif",
      baseFontSize: "16px",
      borderRadius: "14px",
      sectionGap: "4rem",
      primaryColor: "#16a34a",
      textColor: "#1c1917",
      headingColor: "#0c0a09",
      backgroundColor: "#f0fdf4",
      sectionBgColor: "#dcfce7",
      cardBgColor: "#ffffff",
      accentColor: "#65a30d",
      ctaBgColor: "#16a34a",
      ctaTextColor: "#ffffff",
    },
  },
  {
    name: "Sıcak Turuncu",
    desc: "Enerjik turuncu, sıcak tonlar",
    design: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingFont: "Inter, system-ui, sans-serif",
      baseFontSize: "16px",
      borderRadius: "10px",
      sectionGap: "4rem",
      primaryColor: "#ea580c",
      textColor: "#292524",
      headingColor: "#1c1917",
      backgroundColor: "#fff7ed",
      sectionBgColor: "#ffedd5",
      cardBgColor: "#ffffff",
      accentColor: "#d97706",
      ctaBgColor: "#ea580c",
      ctaTextColor: "#ffffff",
    },
  },
];

const COLOR_LABELS: Record<string, string> = {
  primaryColor: "Ana Renk",
  textColor: "Metin Rengi",
  headingColor: "Başlık Rengi",
  backgroundColor: "Arkaplan",
  sectionBgColor: "Bölüm Arkas\u0131",
  cardBgColor: "Kart Arkas\u0131",
  accentColor: "Vurgu Rengi",
  ctaBgColor: "CTA Buton",
  ctaTextColor: "CTA Yaz\u0131",
};

function SectionHeroPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  const h = settings.hero || DEFAULT_SETTINGS.hero;
  return (
    <section className="relative bg-gradient-to-b from-surface to-app/40 overflow-hidden" style={{ backgroundColor: design.backgroundColor }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 right-[-10%] h-[24rem] w-[24rem] rounded-full blur-3xl" style={{ backgroundColor: design.primaryColor + "15" }} />
        <div className="absolute -bottom-20 left-[-10%] h-[20rem] w-[20rem] rounded-full blur-3xl" style={{ backgroundColor: design.accentColor + "10" }} />
      </div>
      <div className="container-app py-16 md:py-22">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center" style={{ fontFamily: design.fontFamily }}>
          <div className="relative z-10">
            <ClickToEdit group="hero" field="badge" settings={settings} onChange={onChange} previewMode={previewMode}
              className="section-label mb-4 inline-flex items-center gap-1.5"
              style={{ color: design.primaryColor }}
              as="span"
            />
            <h1 id="hero-headline" className="heading-xl text-balance" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
              <ClickToEdit group="hero" field="headline" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
            </h1>
            <p className="mt-4 max-w-lg text-text-secondary" style={{ color: design.textColor + "cc" }}>
              <ClickToEditTextarea group="hero" field="description" settings={settings} onChange={onChange} previewMode={previewMode} />
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="btn-primary inline-flex items-center gap-2"
                style={{ backgroundColor: design.ctaBgColor, color: design.ctaTextColor, borderRadius: design.borderRadius }}>
                <span><ClickToEdit group="hero" field="primaryCta" settings={settings} onChange={onChange} previewMode={previewMode} /></span>
                <ArrowRightIcon className="h-4 w-4" />
              </span>
              <span className="btn-secondary"
                style={{ borderColor: design.textColor + "25", color: design.textColor, borderRadius: design.borderRadius }}>
                <ClickToEdit group="hero" field="secondaryCta" settings={settings} onChange={onChange} previewMode={previewMode} />
              </span>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="rounded-card border border-border p-6 shadow-elevated" style={{ backgroundColor: design.cardBgColor, borderRadius: design.borderRadius }}>
              <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: design.textColor + "08" }}>
                <SearchIcon className="h-4 w-4" style={{ color: design.textColor + "55" }} />
                <span className="text-sm" style={{ color: design.textColor + "55" }}>
                  {h.searchPlaceholder || "Hangi montaj hizmetini arıyorsunuz?"}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-xs font-medium" style={{ color: design.textColor + "77" }}>{h.popularLabel || "Popüler:"}</span>
                {(h as any).popularCategories || ["Mobilya", "Klima", "Elektrik", "Nakliye"].slice(0, 4).map((cat: string, i: number) => (
                  <span key={i} className="rounded-full px-3 py-1 text-xs border" style={{ borderColor: design.textColor + "15", color: design.textColor + "88" }}>
                    {cat}
                  </span>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                {[{ label: "Aktif İlan", value: "2.4K", color: design.primaryColor }, { label: "Usta", value: "1.2K+", color: design.accentColor }, { label: "Ort. Puan", value: "4.8", color: design.accentColor }].map((stat) => (
                  <div key={stat.label} className="rounded-lg p-3 border" style={{ backgroundColor: design.backgroundColor, borderColor: design.textColor + "10" }}>
                    <div className="text-xs mb-1.5" style={{ color: design.textColor + "77" }}>{stat.label}</div>
                    <div className="h-1.5 rounded-full" style={{ width: "75%", backgroundColor: stat.color + "25" }}>
                      <div className="h-full rounded-full" style={{ width: "70%", backgroundColor: stat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
}

function SearchIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
}

function SectionTrustBarPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  const items = (settings.trustBar || DEFAULT_SETTINGS.trustBar).items;
  const TRUST_ICONS = [WalletIcon, ShieldIcon, ClockIcon, FileIcon];
  return (
    <section className="border-y border-border bg-surface/60" style={{ backgroundColor: design.sectionBgColor, borderColor: design.textColor + "12" }}>
      <div className="container-app py-6 md:py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((item, i) => {
            const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
            return (
              <div key={item.id} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: design.primaryColor + "12", color: design.primaryColor }}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: design.headingColor }}>{item.label}</div>
                  <div className="mt-0.5 text-xs leading-relaxed" style={{ color: design.textColor + "77" }}>
                    {item.id === "escrow" ? "Ödeme iş teslimine kadar emanette" :
                     item.id === "verified" ? "Kimlik ve referans kontrolleri" :
                     item.id === "coverage" ? "81 ilde hizmet" : "Belirlenmiş süreler"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>;
}
function ShieldIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
}
function ClockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function FileIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
}

function SectionGenericPreview({ group, label, settings, onChange, design, previewMode }: {
  group: string;
  label: string;
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  const isAlt = ["services", "whyUs", "audience"].includes(group);
  const isFaq = group === "faq";
  return (
    <section className={`relative ${isFaq ? "bg-gradient-to-b from-surface to-app/40" : isAlt ? "bg-surface" : "bg-app/40"}`}
      style={{ backgroundColor: isAlt ? design.sectionBgColor : design.backgroundColor }}>
      <div className="container-app py-16 md:py-22">
        <div className={group === "corporate" || group === "capabilities" ? "max-w-2xl" : "max-w-2xl"}>
          <span className="section-label mb-4 inline-flex items-center gap-1.5" style={{ color: design.primaryColor }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.primaryColor }} />
            <ClickToEdit group={group} field="sectionBadge" settings={settings} onChange={onChange} previewMode={previewMode} />
          </span>
          <h2 className="heading-xl text-balance" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
            <ClickToEdit group={group} field="sectionTitle" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
          </h2>
          <p className="mt-4 max-w-xl" style={{ color: design.textColor + "bb" }}>
            <ClickToEditTextarea group={group} field="sectionDescription" settings={settings} onChange={onChange} previewMode={previewMode} />
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionWorkflowPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  const wf = settings.workflow || DEFAULT_SETTINGS.workflow;
  return (
    <section className="relative bg-gradient-to-b from-surface to-app/40" style={{ backgroundColor: design.sectionBgColor }}>
      <div className="container-app py-16 md:py-22">
        <div className="max-w-2xl">
          <span className="section-label mb-4 inline-flex items-center gap-1.5" style={{ color: design.primaryColor }}>
            <LayersIcon className="h-3.5 w-3.5" />
            <ClickToEdit group="workflow" field="sectionBadge" settings={settings} onChange={onChange} previewMode={previewMode} />
          </span>
          <h2 className="heading-xl text-balance" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
            <ClickToEdit group="workflow" field="sectionTitle" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
          </h2>
          <p className="mt-4 max-w-xl" style={{ color: design.textColor + "bb" }}>
            <ClickToEditTextarea group="workflow" field="sectionDescription" settings={settings} onChange={onChange} previewMode={previewMode} />
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {wf.steps.map((step, i) => (
            <div key={i} className="group flex h-full flex-col rounded-card border border-border p-5 shadow-card transition-all duration-200"
              style={{ backgroundColor: design.cardBgColor, borderColor: design.textColor + "10", borderRadius: design.borderRadius }}>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg text-sm font-bold"
                  style={{ backgroundColor: design.primaryColor + "12", color: design.primaryColor }}>
                  {step.step}
                </span>
              </div>
              <div className="text-sm font-semibold" style={{ color: design.headingColor }}>{step.title}</div>
              <div className="mt-1 text-xs leading-relaxed" style={{ color: design.textColor + "88" }}>{step.description}</div>
              <div className="mt-3 space-y-1">
                {step.bullets.map((b, j) => (
                  <div key={j} className="flex items-start gap-1.5 text-xs" style={{ color: design.textColor + "77" }}>
                    <span style={{ color: design.accentColor }}>✓</span> {b}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" /></svg>;
}

function SectionFinalCTAPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  const fc = settings.finalCta || DEFAULT_SETTINGS.finalCta;
  return (
    <section className="relative bg-gradient-to-b from-surface to-app/40" style={{ backgroundColor: design.backgroundColor }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 right-[-10%] h-[24rem] w-[24rem] rounded-full blur-3xl" style={{ backgroundColor: design.primaryColor + "15" }} />
      </div>
      <div className="container-app py-16 md:py-24">
        <div className="rounded-card border border-border p-8 text-center shadow-elevated md:p-12"
          style={{ backgroundColor: design.cardBgColor, borderColor: design.textColor + "10", borderRadius: design.borderRadius }}>
          <h2 className="heading-xl text-balance" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
            <ClickToEdit group="finalCta" field="title" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
          </h2>
          <p className="mx-auto mt-4 max-w-xl" style={{ color: design.textColor + "bb" }}>
            <ClickToEditTextarea group="finalCta" field="description" settings={settings} onChange={onChange} previewMode={previewMode} />
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <span className="btn-primary inline-flex items-center gap-2"
              style={{ backgroundColor: design.ctaBgColor, color: design.ctaTextColor, borderRadius: design.borderRadius }}>
              <ClickToEdit group="finalCta" field="primary" settings={settings} onChange={onChange} previewMode={previewMode} />
              <ArrowRightIcon className="h-4 w-4" />
            </span>
            <span className="btn-secondary" style={{ borderColor: design.textColor + "25", color: design.textColor, borderRadius: design.borderRadius }}>
              <ClickToEdit group="finalCta" field="secondary" settings={settings} onChange={onChange} previewMode={previewMode} />
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs" style={{ color: design.textColor + "77" }}>
            <ShieldCheckIcon className="h-3.5 w-3.5" style={{ color: design.accentColor }} />
            {fc.trustSignals.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <span>{s}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShieldCheckIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
}

function SectionFooterPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  return (
    <section className="border-t border-border" style={{ backgroundColor: design.backgroundColor, borderColor: design.textColor + "12" }}>
      <div className="container-app py-10 text-center">
        <div className="flex items-center justify-center gap-1 text-lg font-bold" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
          <ClickToEdit group="general" field="logoText" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
          <span style={{ color: design.primaryColor }}>
            <ClickToEdit group="general" field="logoAccentText" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
          </span>
        </div>
        <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: design.textColor + "99" }}>
          <ClickToEditTextarea group="footer" field="description" settings={settings} onChange={onChange} previewMode={previewMode} />
        </p>
        <p className="mt-4 text-xs" style={{ color: design.textColor + "66" }}>
          <ClickToEdit group="footer" field="copyright" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
        </p>
      </div>
    </section>
  );
}

function SectionAiTeaserPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  const ai = settings.aiTeaser || DEFAULT_SETTINGS.aiTeaser;
  return (
    <section className="border-y border-border bg-gradient-to-r" style={{ backgroundColor: design.sectionBgColor, borderColor: design.textColor + "10" }}>
      <div className="container-app py-16 md:py-22">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="section-label mb-4 inline-flex items-center gap-1.5" style={{ color: design.primaryColor }}>
              <SparklesIcon className="h-3.5 w-3.5" />
              <ClickToEdit group="aiTeaser" field="sectionBadge" settings={settings} onChange={onChange} previewMode={previewMode} />
            </span>
            <h2 className="heading-lg mt-3 text-balance" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
              <ClickToEdit group="aiTeaser" field="headline" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
            </h2>
            <p className="mt-3 text-sm" style={{ color: design.textColor + "bb" }}>
              <ClickToEditTextarea group="aiTeaser" field="description" settings={settings} onChange={onChange} previewMode={previewMode} />
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor: design.textColor + "20", backgroundColor: design.cardBgColor }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: design.accentColor }} />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
              </span>
              <span className="text-xs font-semibold" style={{ color: design.textColor }}>
                <ClickToEdit group="aiTeaser" field="betaLabel" settings={settings} onChange={onChange} previewMode={previewMode} />
              </span>
              <span style={{ color: design.textColor + "44" }}>&middot;</span>
              <span className="text-xs font-medium" style={{ color: design.primaryColor }}>
                <ClickToEdit group="aiTeaser" field="ctaLabel" settings={settings} onChange={onChange} previewMode={previewMode} />
              </span>
            </div>
          </div>
          <div aria-hidden="true" className="rounded-card border p-6 shadow-elevated" style={{ backgroundColor: design.cardBgColor, borderColor: design.textColor + "10", borderRadius: design.borderRadius }}>
            <div className="mb-4 text-xs font-medium uppercase tracking-wide" style={{ color: design.textColor + "88" }}>AI ön izleme (temsili)</div>
            <div className="flex items-center gap-3 rounded-lg border border-dashed px-4 py-5" style={{ borderColor: design.textColor + "20", backgroundColor: design.backgroundColor, color: design.textColor + "88" }}>
              <CameraIcon className="h-5 w-5" />
              <span className="text-xs">Kullanıcı fotoğraf yükler</span>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-lg border px-4 py-3" style={{ borderColor: design.textColor + "15", backgroundColor: design.backgroundColor }}>
              <SparklesIcon className="h-5 w-5" style={{ color: design.primaryColor }} />
              <span className="text-xs font-medium" style={{ color: design.textColor }}>Tahmini: €240 - €320 · 4-7 saat</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SparklesIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>;
}

function CameraIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>;
}

function SectionStatsLabelsPreview({ design }: { design: SiteSettings["design"] }) {
  return (
    <section className="border-y border-border bg-surface/60" style={{ backgroundColor: design.sectionBgColor, borderColor: design.textColor + "10" }}>
      <div className="container-app py-8 md:py-10">
        <div className="flex justify-center gap-8 md:gap-16">
          {[{ num: "1.200+", label: "Kayıtlı Usta" }, { num: "81", label: "İl" }, { num: "4.8", label: "Ort. Puan" }, { num: "10K+", label: "Tamamlanan İş" }].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold" style={{ fontFamily: design.headingFont, color: design.primaryColor }}>{s.num}</div>
              <div className="text-xs mt-1" style={{ color: design.textColor + "88" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionEditableBlogPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  return (
    <section className="bg-surface" style={{ backgroundColor: design.sectionBgColor }}>
      <div className="container-app py-16 md:py-22">
        <div className="text-center max-w-2xl mx-auto">
          <span className="section-label mb-4 inline-flex items-center gap-1.5" style={{ color: design.primaryColor }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.primaryColor }} />
            <ClickToEdit group="blog" field="sectionBadge" settings={settings} onChange={onChange} previewMode={previewMode} />
          </span>
          <h2 className="heading-xl" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
            <ClickToEdit group="blog" field="sectionTitle" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
          </h2>
          <p className="mt-4" style={{ color: design.textColor + "bb" }}>
            <ClickToEditTextarea group="blog" field="sectionDescription" settings={settings} onChange={onChange} previewMode={previewMode} />
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-card border border-border overflow-hidden shadow-card"
              style={{ backgroundColor: design.cardBgColor, borderColor: design.textColor + "10", borderRadius: design.borderRadius }}>
              <div className="h-40" style={{ backgroundColor: design.textColor + "08" }} />
              <div className="p-5 space-y-2">
                <div className="h-4 w-3/4 rounded" style={{ backgroundColor: design.textColor + "10" }} />
                <div className="h-3 w-full rounded" style={{ backgroundColor: design.textColor + "08" }} />
                <div className="h-3 w-2/3 rounded" style={{ backgroundColor: design.textColor + "08" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <span className="btn-secondary inline-flex items-center gap-2 text-sm"
            style={{ borderColor: design.textColor + "25", color: design.textColor, borderRadius: design.borderRadius }}>
            <ClickToEdit group="blog" field="viewAllLabel" settings={settings} onChange={onChange} previewMode={previewMode} />
          </span>
        </div>
      </div>
    </section>
  );
}

function DesignPanel({
  design,
  settings,
  onDesignChange,
  onContentChange,
  previewMode,
}: {
  design: SiteSettings["design"];
  settings: SettingsState;
  onDesignChange: (key: string, value: string) => void;
  onContentChange: (group: string, field: string, value: string) => void;
  previewMode: boolean;
}) {
  const vis = settings.visibility || DEFAULT_SETTINGS.visibility;

  return (
    <div className="space-y-8">
      {/* Presets */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-montaj" />
            <h2 className="font-semibold text-zinc-900 dark:text-white text-sm">Hazır Temalar</h2>
          </div>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {DESIGN_PRESETS.map((preset) => (
            <button
              key={preset.name}
              disabled={previewMode}
              onClick={() => Object.entries(preset.design).forEach(([k, v]) => onDesignChange(k, v))}
              className="group relative rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 text-left hover:border-montaj hover:shadow-md transition-all disabled:opacity-50"
            >
              <div className="flex gap-1.5 mb-3">
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.design.primaryColor }} />
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.design.accentColor }} />
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.design.backgroundColor }} />
              </div>
              <div className="text-sm font-medium text-zinc-900 dark:text-white">{preset.name}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Full Page Live Preview */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-montaj" />
            <h2 className="font-semibold text-zinc-900 dark:text-white text-sm">Canlı Önizleme</h2>
            <span className="ml-2 text-[10px] text-zinc-400 italic">Metinlere tıkla, düzenle</span>
          </div>
        </div>
        {vis.hero !== false && <SectionHeroPreview settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.trustBar !== false && <SectionTrustBarPreview settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.audience !== false && <SectionGenericPreview group="audience" label="Hedef Kitle" settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.services !== false && <SectionGenericPreview group="services" label="Hizmetler" settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.workflow !== false && <SectionWorkflowPreview settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.capabilities !== false && <SectionGenericPreview group="capabilities" label="Özellikler" settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.corporate !== false && <SectionGenericPreview group="corporate" label="Kurumsal" settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.metrics !== false && <SectionStatsLabelsPreview design={design} />}
        {vis.whyUs !== false && <SectionGenericPreview group="whyUs" label="Neden Biz" settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.aiTeaser !== false && <SectionAiTeaserPreview settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.blog !== false && <SectionEditableBlogPreview settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.faq !== false && <SectionGenericPreview group="faq" label="SSS" settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        {vis.finalCta !== false && <SectionFinalCTAPreview settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />}
        <SectionFooterPreview settings={settings} onChange={onContentChange} design={design} previewMode={previewMode} />
      </div>

      {/* Colors */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-montaj" />
            <h2 className="font-semibold text-zinc-900 dark:text-white text-sm">Renk Paleti</h2>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(COLOR_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <div className="relative">
                <input type="color" value={(design as Record<string, string>)[key] || ""}
                  onChange={(e) => onDesignChange(key, e.target.value)}
                  disabled={previewMode}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="w-10 h-10 rounded-lg border-2 border-zinc-200 dark:border-zinc-700"
                  style={{ backgroundColor: (design as Record<string, string>)[key] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</div>
                <input type="text" value={(design as Record<string, string>)[key] || ""}
                  onChange={(e) => onDesignChange(key, e.target.value)}
                  disabled={previewMode}
                  className="w-full text-sm font-mono text-zinc-900 dark:text-white bg-transparent border-none outline-none p-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-montaj" />
            <h2 className="font-semibold text-zinc-900 dark:text-white text-sm">Tipografi</h2>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Gövde Fontu</label>
            <input type="text" value={design.fontFamily}
              onChange={(e) => onDesignChange("fontFamily", e.target.value)}
              disabled={previewMode}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none" />
            <p className="text-xs mt-1.5" style={{ fontFamily: design.fontFamily, color: design.textColor + "99" }}>
              The quick brown fox jumps over the lazy dog. Türkiye'nin profesyonel montaj platformu.
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Başlık Fontu</label>
            <input type="text" value={design.headingFont}
              onChange={(e) => onDesignChange("headingFont", e.target.value)}
              disabled={previewMode}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none" />
            <h4 className="text-lg font-bold mt-1.5" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
              Montajım Var — Profesyonel Montaj Platformu
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Font Boyutu</label>
              <input type="text" value={design.baseFontSize}
                onChange={(e) => onDesignChange("baseFontSize", e.target.value)}
                disabled={previewMode}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Köşe Yuvarlaklığı</label>
              <input type="text" value={design.borderRadius}
                onChange={(e) => onDesignChange("borderRadius", e.target.value)}
                disabled={previewMode}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Bölüm Arası Boşluk</label>
              <input type="text" value={design.sectionGap}
                onChange={(e) => onDesignChange("sectionGap", e.target.value)}
                disabled={previewMode}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-montaj/20 focus:border-montaj outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}