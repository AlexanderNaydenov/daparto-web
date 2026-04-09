import { CmsErrorBanner } from "@/components/cms-error-banner";
import { isAppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";
import { hygraphFetch } from "@/lib/hygraph";
import { RATGEBER_LIST } from "@/lib/queries";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Data = {
  ratgeberArtikelbeitraege: {
    id: string;
    titel: string;
    urlSlug: string;
    teaser?: string | null;
    vorschaubild?: { url: string; width?: number | null; height?: number | null } | null;
    themenKategorie?: { name: string; urlSlug: string } | null;
  }[];
};

export const metadata: Metadata = {
  title: "Ratgeber",
  description: "Tipps rund um Ersatzteile, Wartung und Kompatibilität.",
};

export default async function RatgeberPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw;

  const res = await hygraphFetch<Data>(RATGEBER_LIST, {}, { locale });

  if (res.errors?.length) {
    return <CmsErrorBanner message={res.errors[0]?.message ?? "Fehler"} />;
  }

  const items = res.data?.ratgeberArtikelbeitraege ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold text-[var(--brand-ink)]">
        Ratgeber
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--brand-ink-muted)]">
        Praxisnahe Artikel für bessere Entscheidungen beim Ersatzteil-Kauf.
      </p>

      <ul className="mt-10 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
        {items.map((a) => (
          <li key={a.id}>
            <Link
              href={withLocale(locale, `/ratgeber/${a.urlSlug}`)}
              className="flex flex-col gap-3 px-5 py-5 transition hover:bg-[var(--brand-surface)] sm:flex-row sm:items-center sm:gap-6"
            >
              {a.vorschaubild?.url ? (
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-20 sm:w-32">
                  <Image
                    src={a.vorschaubild.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                {a.themenKategorie ? (
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-orange)]">
                    {a.themenKategorie.name}
                  </span>
                ) : null}
                <span className="mt-0.5 block font-[family-name:var(--font-barlow-condensed)] text-xl font-bold text-[var(--brand-ink)]">
                  {a.titel}
                </span>
                {a.teaser ? (
                  <span className="mt-1 block max-w-xl text-sm text-[var(--brand-ink-muted)]">{a.teaser}</span>
                ) : null}
              </div>
              <span className="shrink-0 text-sm font-semibold text-[var(--brand-orange)] sm:self-center">
                Lesen →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p className="mt-8 text-[var(--brand-ink-muted)]">Noch keine Ratgeber-Artikel.</p>
      ) : null}
    </div>
  );
}
