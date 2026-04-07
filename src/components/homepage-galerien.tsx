import Image from "next/image";
import Link from "next/link";

export type GalerieEintrag = {
  bezeichnung: string;
  linkUrl?: string | null;
  logo?: { url: string; width?: number | null; height?: number | null } | null;
};

export type GalerieRow = {
  id: string;
  titel: string;
  kategorie: "TOP_HAENDLER" | "TOP_HERSTELLER" | "FAHRZEUGMARKEN";
  eintraege: GalerieEintrag[];
};

const ORDER: GalerieRow["kategorie"][] = ["TOP_HAENDLER", "TOP_HERSTELLER", "FAHRZEUGMARKEN"];

function sortGalerien(rows: GalerieRow[]): GalerieRow[] {
  const map = new Map(rows.map((r) => [r.kategorie, r]));
  return ORDER.map((k) => map.get(k)).filter(Boolean) as GalerieRow[];
}

function LogoCell({ eintrag }: { eintrag: GalerieEintrag }) {
  const img = eintrag.logo;
  const href = eintrag.linkUrl?.trim();
  const showLink = href && href !== "#";

  const inner = (
    <div className="flex h-[15rem] w-full min-w-0 flex-col items-center justify-center rounded-xl border border-[var(--brand-primary)]/10 bg-white px-4 py-3 shadow-sm transition hover:border-[var(--brand-accent)]/40 hover:shadow-md sm:h-[18rem]">
      {img?.url ? (
        <div className="relative h-36 w-full sm:h-[10.5rem]">
          <Image
            src={img.url}
            alt={eintrag.bezeichnung}
            fill
            unoptimized
            className="object-contain"
            sizes="(max-width: 640px) 85vw, 420px"
          />
        </div>
      ) : (
        <span className="text-center text-sm font-medium text-[var(--brand-ink-muted)] sm:text-base">
          {eintrag.bezeichnung}
        </span>
      )}
      <span className="mt-2 line-clamp-1 text-center text-xs font-medium text-[var(--brand-ink-muted)] sm:text-sm">
        {eintrag.bezeichnung}
      </span>
    </div>
  );

  if (showLink) {
    return (
      <Link href={href} className="block shrink-0">
        {inner}
      </Link>
    );
  }

  return <div className="shrink-0">{inner}</div>;
}

export function HomepageGalerien({ galerien }: { galerien: GalerieRow[] | null | undefined }) {
  const rows = sortGalerien(galerien ?? []).filter((r) => (r.eintraege?.length ?? 0) > 0);
  if (rows.length === 0) return null;

  return (
    <section className="border-y border-[var(--brand-primary)]/10 bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
          Partner & Marken
        </p>
        <div className="mt-10 space-y-12">
          {rows.map((row) => (
            <div key={row.id}>
              <h2 className="font-[family-name:var(--font-barlow-condensed)] text-xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-2xl">
                {row.titel}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(row.eintraege ?? []).map((e, i) => (
                  <LogoCell key={`${row.id}-${e.bezeichnung}-${i}`} eintrag={e} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
