import Image from "next/image";
import Link from "next/link";
import type { AppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";

export function SiteFooter({ locale }: { locale: AppLocale }) {
  const home = withLocale(locale, "/");
  return (
    <footer className="mt-auto border-t border-black/5 bg-[var(--brand-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href={home} className="inline-block">
              <Image
                src="/daparto-logo.svg"
                alt="Daparto"
                width={180}
                height={31}
                unoptimized
                className="h-7 w-auto opacity-90"
              />
            </Link>
            <p className="mt-3 text-sm text-[var(--brand-ink-muted)]">
              Vergleichsmarktplatz für Ersatzteile — strukturiert, transparent, schnell.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--brand-ink)]">Entdecken</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--brand-ink-muted)]">
              <li>
                <Link className="hover:text-[var(--brand-primary)]" href={withLocale(locale, "/kategorien")}>
                  Kategorien
                </Link>
              </li>
              <li>
                <Link className="hover:text-[var(--brand-primary)]" href={withLocale(locale, "/ratgeber")}>
                  Ratgeber
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--brand-ink)]">Hinweis</p>
            <p className="mt-3 text-sm text-[var(--brand-ink-muted)]">
              Demo-Frontend an Hygraph angebunden. Marken- und Produktnamen dienen der Veranschaulichung.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--brand-ink)]">Technologie</p>
            <p className="mt-3 text-sm text-[var(--brand-ink-muted)]">
              Next.js · Hygraph · Vercel
            </p>
          </div>
        </div>
        <p className="mt-10 border-t border-black/5 pt-6 text-xs text-[var(--brand-ink-muted)]">
          © {new Date().getFullYear()} Demo-Showcase. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
