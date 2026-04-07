import Link from "next/link";
import type { AppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";
import { DapartoLogo } from "./daparto-logo";
import { LocaleSwitch } from "./locale-switch";

export function SiteHeader({ locale }: { locale: AppLocale }) {
  const nav = [
    { href: withLocale(locale, "/kategorien"), label: "Kategorien" },
    { href: withLocale(locale, "/ratgeber"), label: "Ratgeber" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-primary)]/10 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <DapartoLogo locale={locale} />
        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--brand-ink-muted)] sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[var(--brand-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitch locale={locale} />
          <Link
            href={withLocale(locale, "/kategorien")}
            className="rounded-full bg-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-accent-dark)] sm:hidden"
          >
            Sortiment
          </Link>
          <Link
            href={withLocale(locale, "/kategorien")}
            className="hidden rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] sm:inline-flex"
          >
            Für Anbieter
          </Link>
        </div>
      </div>
    </header>
  );
}
