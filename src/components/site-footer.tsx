import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/5 bg-[var(--brand-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-[family-name:var(--font-barlow-condensed)] text-lg font-bold text-[var(--brand-ink)]">
              dapa<span className="text-[var(--brand-orange)]">rto</span>
            </p>
            <p className="mt-2 text-sm text-[var(--brand-ink-muted)]">
              Vergleichsmarktplatz für Ersatzteile — strukturiert, transparent, schnell.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--brand-ink)]">Entdecken</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--brand-ink-muted)]">
              <li>
                <Link className="hover:text-[var(--brand-orange)]" href="/kategorien">
                  Kategorien
                </Link>
              </li>
              <li>
                <Link className="hover:text-[var(--brand-orange)]" href="/ratgeber">
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
