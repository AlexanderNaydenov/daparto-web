"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { VehicleSelectionBox } from "./vehicle-selection-box";

type Props = {
  title: string;
  subtitle?: string | null;
  primaryCta?: { label: string; href: string } | null;
  secondaryCta?: { label: string; href: string } | null;
};

export function SearchHero({ title, subtitle, primaryCta, secondaryCta }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) {
      router.push(`/kategorien?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/kategorien");
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#002338] via-[#003351] to-[#001a28] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[var(--brand-accent)]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[var(--brand-primary)]/30 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,400px)] lg:items-start lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent)]">
              WE DRIVE PERFORMANCE
            </p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-4 max-w-2xl text-lg text-white/75">{subtitle}</p>
            ) : null}

            <form
              onSubmit={onSubmit}
              className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <label htmlFor="site-search" className="sr-only">
                  Ersatzteil oder Kategorie suchen
                </label>
                <input
                  id="site-search"
                  name="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Hersteller, Teilenummer oder Produkt …"
                  className="w-full rounded-xl border border-white/10 bg-white/95 px-4 py-3.5 text-[var(--brand-ink)] shadow-lg outline-none ring-2 ring-transparent placeholder:text-neutral-400 focus:ring-[var(--brand-accent)]"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[var(--brand-accent)] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--brand-accent-dark)]"
              >
                Suchen
              </button>
            </form>

            {(primaryCta || secondaryCta) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {primaryCta ? (
                  <a
                    href={primaryCta.href}
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[var(--brand-primary)] transition hover:bg-neutral-100"
                  >
                    {primaryCta.label}
                  </a>
                ) : null}
                {secondaryCta ? (
                  <a
                    href={secondaryCta.href}
                    className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {secondaryCta.label}
                  </a>
                ) : null}
              </div>
            )}
          </div>

          <VehicleSelectionBox />
        </div>
      </div>
    </section>
  );
}
