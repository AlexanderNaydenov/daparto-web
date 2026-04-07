/** Hygraph project locales (must match CMS). */
export const locales = ["de", "en"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "de";

export function isAppLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}

/** Hygraph returns the first locale that has content; include fallback so DE can fall back to EN until translated. */
export function graphLocalesForUi(locale: AppLocale): AppLocale[] {
  return locale === "de" ? ["de", "en"] : ["en", "de"];
}
