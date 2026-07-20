import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";
import type { SiteSettings, SettingGroupConfig, SettingFieldConfig } from "./site-settings-constants";
import { DEFAULT_SETTINGS, SETTING_GROUPS } from "./site-settings-constants";

// ─── Helper Functions ─────────────────────────────────────

const SETTING_KEY = "site_settings_v1";

/** Merge DB settings with defaults — DB values win */
function mergeSettings(dbValue: unknown): SiteSettings {
  const partial = dbValue as Record<string, unknown>;
  const merged: SiteSettings = { ...DEFAULT_SETTINGS };

  for (const groupKey of Object.keys(DEFAULT_SETTINGS)) {
    const groupPartial = partial[groupKey];
    if (groupPartial && typeof groupPartial === "object") {
      const mergedGroup = (merged as unknown as Record<string, unknown>)[groupKey] as Record<string, unknown>;
      const partialGroup = groupPartial as Record<string, unknown>;
      for (const key of Object.keys(partialGroup)) {
        if (partialGroup[key] !== undefined && partialGroup[key] !== null) {
          mergedGroup[key] = partialGroup[key];
        }
      }
    }
  }

  return merged;
}

/** Get site settings from DB, falling back to defaults */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: SETTING_KEY },
    });
    if (record?.value) {
      return mergeSettings(record.value);
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Update site settings in DB */
export async function updateSiteSettings(
  updates: Partial<SiteSettings>,
  adminId?: number
): Promise<SiteSettings> {
  const existing = await prisma.siteSetting.findUnique({
    where: { key: SETTING_KEY },
  });

  const currentValue = (existing?.value ?? {}) as Record<string, unknown>;

  // Merge: keep existing values for groups not being updated
  const newValue: Record<string, unknown> = { ...currentValue };
  for (const [groupKey, groupUpdates] of Object.entries(updates)) {
    if (groupUpdates && typeof groupUpdates === "object") {
      const existingGroup = (currentValue[groupKey] as Record<string, unknown>) || {};
      newValue[groupKey] = { ...existingGroup, ...groupUpdates };
    }
  }

  await prisma.siteSetting.upsert({
    where: { key: SETTING_KEY },
    create: {
      key: SETTING_KEY,
      value: newValue as Prisma.JsonObject,
      group: "general",
      label: "Ana Site Ayarları",
      type: "json",
    },
    update: {
      value: newValue as Prisma.JsonObject,
      updatedBy: adminId ?? null,
    },
  });

  return mergeSettings(newValue);
}