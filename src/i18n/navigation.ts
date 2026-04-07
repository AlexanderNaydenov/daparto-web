import type { AppLocale } from "./config";

/** Prefix a path with the current UI locale (e.g. `/de/kategorien`). */
export function withLocale(locale: AppLocale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

/** CMS link: keep absolute URLs; prefix internal paths with locale. */
export function resolveCmsHref(locale: AppLocale, href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
    return href;
  }
  if (href.startsWith("/")) {
    return withLocale(locale, href);
  }
  return href;
}
