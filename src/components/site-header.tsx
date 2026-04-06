import Link from "next/link";
import { DapartoLogo } from "./daparto-logo";

const nav = [
  { href: "/kategorien", label: "Kategorien" },
  { href: "/ratgeber", label: "Ratgeber" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <DapartoLogo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--brand-ink-muted)] sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[var(--brand-orange)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/kategorien"
            className="rounded-full bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-orange-dark)] sm:hidden"
          >
            Sortiment
          </Link>
          <Link
            href="/kategorien"
            className="hidden rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange)] sm:inline-flex"
          >
            Für Anbieter
          </Link>
        </div>
      </div>
    </header>
  );
}
