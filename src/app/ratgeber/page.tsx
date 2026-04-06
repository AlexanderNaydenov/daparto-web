import { CmsErrorBanner } from "@/components/cms-error-banner";
import { hygraphFetch } from "@/lib/hygraph";
import { RATGEBER_LIST } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

type Data = {
  ratgeberArtikelbeitraege: {
    id: string;
    titel: string;
    urlSlug: string;
    teaser?: string | null;
  }[];
};

export const metadata: Metadata = {
  title: "Ratgeber",
  description: "Tipps rund um Ersatzteile, Wartung und Kompatibilität.",
};

export default async function RatgeberPage() {
  const res = await hygraphFetch<Data>(RATGEBER_LIST);

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
              href={`/ratgeber/${a.urlSlug}`}
              className="flex flex-col gap-1 px-5 py-5 transition hover:bg-[var(--brand-surface)] sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-[family-name:var(--font-barlow-condensed)] text-xl font-bold text-[var(--brand-ink)]">
                {a.titel}
              </span>
              {a.teaser ? (
                <span className="max-w-xl text-sm text-[var(--brand-ink-muted)]">{a.teaser}</span>
              ) : null}
              <span className="text-sm font-semibold text-[var(--brand-orange)]">Lesen →</span>
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
