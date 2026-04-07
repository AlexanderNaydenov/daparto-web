"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";

/** Toggle DE ↔ EN while keeping the same path (minus locale prefix). */
export function LocaleSwitch({ locale }: { locale: AppLocale }) {
  const pathname = usePathname() ?? "/";
  const stripped = pathname.replace(/^\/(de|en)/, "") || "/";
  const target: AppLocale = locale === "de" ? "en" : "de";
  const href = withLocale(target, stripped);

  return (
    <Link
      href={href}
      className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
      hrefLang={target}
    >
      {locale === "de" ? "EN" : "DE"}
    </Link>
  );
}
