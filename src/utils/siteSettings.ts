import { SITE } from "@/config";
import { listSiteSettings } from "@/db/d1";
import { getD1 } from "@/utils/cloudflare";

export const SITE_SETTING_KEYS = [
  "website",
  "title",
  "description",
  "author",
  "profile",
  "ogImage",
  "lang",
  "dir",
  "themeColor",
] as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];

export interface RuntimeSiteSettings {
  website: string;
  title: string;
  description: string;
  author: string;
  profile: string;
  ogImage: string;
  lang: string;
  dir: "ltr" | "rtl" | "auto";
  themeColor: string;
}

type SiteSettingsLocals = App.Locals & {
  siteSettingsPromise?: Promise<RuntimeSiteSettings>;
};

export const DEFAULT_SITE_SETTINGS: RuntimeSiteSettings = {
  website: SITE.website,
  title: SITE.title,
  description: SITE.desc,
  author: SITE.author,
  profile: SITE.profile,
  ogImage: SITE.ogImage,
  lang: SITE.lang || "en",
  dir: SITE.dir,
  themeColor: "",
};

function normalizeDir(value: string): RuntimeSiteSettings["dir"] {
  return value === "rtl" || value === "auto" ? value : "ltr";
}

function normalizeSettings(values: Record<string, string>) {
  return {
    website: values.website || DEFAULT_SITE_SETTINGS.website,
    title: values.title || DEFAULT_SITE_SETTINGS.title,
    description: values.description || DEFAULT_SITE_SETTINGS.description,
    author: values.author || DEFAULT_SITE_SETTINGS.author,
    profile: values.profile || DEFAULT_SITE_SETTINGS.profile,
    ogImage: values.ogImage || DEFAULT_SITE_SETTINGS.ogImage,
    lang: values.lang || DEFAULT_SITE_SETTINGS.lang,
    dir: normalizeDir(values.dir || DEFAULT_SITE_SETTINGS.dir),
    themeColor: values.themeColor || DEFAULT_SITE_SETTINGS.themeColor,
  };
}

export async function getRuntimeSiteSettings(locals: App.Locals) {
  const runtimeLocals = locals as SiteSettingsLocals;

  runtimeLocals.siteSettingsPromise ??= (async () => {
    try {
      const rows = await listSiteSettings(getD1(locals));
      return normalizeSettings(
        Object.fromEntries(rows.map(row => [row.key, row.value]))
      );
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  })();

  return runtimeLocals.siteSettingsPromise;
}

export function sanitizeSiteSettings(input: Record<string, unknown>) {
  const values: Record<string, string> = {};

  for (const key of SITE_SETTING_KEYS) {
    const value = input[key];
    values[key] = typeof value === "string" ? value.trim() : "";
  }

  return normalizeSettings(values);
}

export function toSiteSettingsRecord(settings: RuntimeSiteSettings) {
  return Object.fromEntries(
    SITE_SETTING_KEYS.map(key => [key, settings[key]])
  ) as Record<SiteSettingKey, string>;
}

export function resolveSiteTitle(title: string | undefined, siteTitle: string) {
  if (!title || title === SITE.title) return siteTitle;
  const suffix = `| ${SITE.title}`;
  return title.endsWith(suffix)
    ? `${title.slice(0, -SITE.title.length)}${siteTitle}`
    : title;
}
