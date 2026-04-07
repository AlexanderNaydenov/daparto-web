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
    <div className="flex h-20 w-full min-w-[7rem] flex-col items-center justify-center rounded-xl border border-[var(--brand-primary)]/10 bg-white px-3 py-2 shadow-sm transition hover:border-[var(--brand-accent)]/40 hover:shadow-md sm:h-24 sm:min-w-[8.5rem]">
      {img?.url ? (
        <div className="relative h-12 w-full sm:h-14">
          <Image
            src={img.url}
            alt={eintrag.bezeichnung}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 28vw, 140px"
          />
        </div>
      ) : (
        <span className="text-center text-xs font-medium text-[var(--brand-ink-muted)]">
          {eintrag.bezeichnung}
        </span>
      )}
      <span className="mt-1 line-clamp-1 text-center text-[10px] font-medium text-[var(--brand-ink-muted)] sm:text-xs">
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
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
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
