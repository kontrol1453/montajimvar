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
  return (
    <div className="px-6 py-12" style={{ backgroundColor: design.backgroundColor }}>
      <div className="max-w-4xl mx-auto text-center" style={{ fontFamily: design.fontFamily }}>
        <ClickToEdit group="hero" field="badge" settings={settings} onChange={onChange} previewMode={previewMode}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4"
          style={{ backgroundColor: design.primaryColor + "15", color: design.primaryColor }}
          as="span"
        />
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
          <ClickToEdit group="hero" field="headline" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
        </h1>
        <p className="text-sm mb-6 max-w-2xl mx-auto" style={{ color: design.textColor + "cc" }}>
          <ClickToEditTextarea group="hero" field="description" settings={settings} onChange={onChange} previewMode={previewMode} />
        </p>
        <div className="flex justify-center gap-3">
          <span className="px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: design.ctaBgColor, color: design.ctaTextColor, borderRadius: design.borderRadius }}>
            <ClickToEdit group="hero" field="primaryCta" settings={settings} onChange={onChange} previewMode={previewMode} />
          </span>
          <span className="px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ border: `1px solid ${design.textColor}33`, color: design.textColor, borderRadius: design.borderRadius }}>
            <ClickToEdit group="hero" field="secondaryCta" settings={settings} onChange={onChange} previewMode={previewMode} />
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionTrustBarPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  const items = (settings.trustBar || DEFAULT_SETTINGS.trustBar).items;
  return (
    <div className="px-6 py-4" style={{ backgroundColor: design.sectionBgColor }}>
      <div className="max-w-4xl mx-auto flex justify-center gap-6 flex-wrap">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs" style={{ color: design.textColor + "aa" }}>
            <svg className="w-3.5 h-3.5" style={{ color: design.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionGenericPreview({ group, label, settings, onChange, design, previewMode }: {
  group: string;
  label: string;
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  return (
    <div className="px-6 py-10 text-center" style={{ backgroundColor: design.backgroundColor }}>
      <div className="max-w-3xl mx-auto" style={{ fontFamily: design.fontFamily }}>
        {group !== "finalCta" && (
          <span className="inline-block text-[10px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: design.primaryColor }}>
            <ClickToEdit group={group} field="sectionBadge" settings={settings} onChange={onChange} previewMode={previewMode} />
          </span>
        )}
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
          <ClickToEdit group={group} field="sectionTitle" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
        </h2>
        <p className="text-sm max-w-2xl mx-auto" style={{ color: design.textColor + "bb" }}>
          <ClickToEditTextarea group={group} field="sectionDescription" settings={settings} onChange={onChange} previewMode={previewMode} />
        </p>
      </div>
    </div>
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
    <div className="px-6 py-10" style={{ backgroundColor: design.sectionBgColor }}>
      <div className="max-w-4xl mx-auto" style={{ fontFamily: design.fontFamily }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
            <ClickToEdit group="workflow" field="sectionTitle" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
          </h2>
          <p className="text-sm" style={{ color: design.textColor + "bb" }}>
            <ClickToEditTextarea group="workflow" field="sectionDescription" settings={settings} onChange={onChange} previewMode={previewMode} />
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {wf.steps.map((step, i) => (
            <div key={i} className="p-4 rounded-xl text-center"
              style={{ backgroundColor: design.cardBgColor, borderRadius: design.borderRadius, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold"
                style={{ backgroundColor: design.primaryColor + "15", color: design.primaryColor }}>
                {step.step}
              </div>
              <div className="text-sm font-semibold mb-1" style={{ color: design.headingColor }}>{step.title}</div>
              <div className="text-xs" style={{ color: design.textColor + "99" }}>{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionFinalCTAPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  return (
    <div className="px-6 py-12 text-center" style={{ backgroundColor: design.primaryColor + "08" }}>
      <div className="max-w-2xl mx-auto" style={{ fontFamily: design.fontFamily }}>
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
          <ClickToEdit group="finalCta" field="title" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
        </h2>
        <p className="text-sm mb-6" style={{ color: design.textColor + "bb" }}>
          <ClickToEditTextarea group="finalCta" field="description" settings={settings} onChange={onChange} previewMode={previewMode} />
        </p>
        <div className="flex justify-center gap-3">
          <span className="px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: design.ctaBgColor, color: design.ctaTextColor, borderRadius: design.borderRadius }}>
            <ClickToEdit group="finalCta" field="primary" settings={settings} onChange={onChange} previewMode={previewMode} />
          </span>
          <span className="px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ border: `1px solid ${design.textColor}33`, color: design.textColor, borderRadius: design.borderRadius }}>
            <ClickToEdit group="finalCta" field="secondary" settings={settings} onChange={onChange} previewMode={previewMode} />
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionFooterPreview({ settings, onChange, design, previewMode }: {
  settings: SettingsState;
  onChange: (g: string, f: string, v: string) => void;
  design: SiteSettings["design"];
  previewMode: boolean;
}) {
  return (
    <div className="px-6 py-6 text-center border-t" style={{ backgroundColor: design.backgroundColor, borderColor: design.textColor + "15" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-1 text-lg font-bold mb-2" style={{ fontFamily: design.headingFont, color: design.headingColor }}>
          <ClickToEdit group="general" field="logoText" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
          <span style={{ color: design.primaryColor }}>
            <ClickToEdit group="general" field="logoAccentText" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: design.textColor + "99" }}>
          <ClickToEditTextarea group="footer" field="description" settings={settings} onChange={onChange} previewMode={previewMode} />
        </p>
        <p className="text-[10px]" style={{ color: design.textColor + "77" }}>
          <ClickToEdit group="footer" field="copyright" settings={settings} onChange={onChange} previewMode={previewMode} as="span" />
        </p>
      </div>
    </div>
  );
}

function SectionStatsLabelsPreview({ design }: { design: SiteSettings["design"] }) {
  return (
    <div className="px-6 py-8" style={{ backgroundColor: design.sectionBgColor }}>
      <div className="max-w-4xl mx-auto flex justify-center gap-8">
        {[{ num: "1.200+", label: "Usta" }, { num: "81", label: "İl" }, { num: "4.8", label: "Puan" }].map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl font-bold" style={{ fontFamily: design.headingFont, color: design.primaryColor }}>{s.num}</div>
            <div className="text-xs" style={{ color: design.textColor + "99" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionBlogPlaceholder({ design }: { design: SiteSettings["design"] }) {
  return (
    <div className="px-6 py-10 text-center" style={{ backgroundColor: design.backgroundColor }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: design.headingFont, color: design.headingColor }}>Blog</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl" style={{ backgroundColor: design.textColor + "0a", borderRadius: design.borderRadius }} />
          ))}
        </div>
      </div>
    </div>
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
        {vis.blog !== false && <SectionBlogPlaceholder design={design} />}
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