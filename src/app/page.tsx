import { CategoryTile } from "@/components/category-tile";
import { CmsErrorBanner } from "@/components/cms-error-banner";
import { ModularSections } from "@/components/modular-sections";
import { ProductCard } from "@/components/product-card";
import { SearchHero } from "@/components/search-hero";
import { hygraphFetch } from "@/lib/hygraph";
import { HOME_PAGE_QUERY } from "@/lib/queries";
import type { Metadata } from "next";

export const revalidate = 60;

type HeldSektion = {
  __typename: "HeldSektion";
  heldTitel: string;
  untertitel?: string | null;
  primaererAufruf?: { buttonBeschriftung: string; zielUrl: string } | null;
  sekundaererAufruf?: { buttonBeschriftung: string; zielUrl: string } | null;
};

type HomeData = {
  startseiten: {
    id: string;
    titel: string;
    urlSlug: string;
    seo?: { metaTitel?: string | null; metaBeschreibung?: string | null } | null;
    modulareSektionen?: Record<string, unknown>[] | null;
  }[];
  kategorien: {
    id: string;
    name: string;
    urlSlug: string;
    kurzbeschreibung?: string | null;
  }[];
  produkte: import("@/components/product-card").ProductCardData[];
};

export async function generateMetadata(): Promise<Metadata> {
  const res = await hygraphFetch<Pick<HomeData, "startseiten">>(HOME_PAGE_QUERY);
  const s = res.data?.startseiten?.[0];
  const seo = s?.seo;
  return {
    title: seo?.metaTitel ?? s?.titel ?? undefined,
    description: seo?.metaBeschreibung ?? undefined,
  };
}

export default async function Home() {
  const res = await hygraphFetch<HomeData>(HOME_PAGE_QUERY);

  if (res.errors?.length) {
    return (
      <>
        <CmsErrorBanner message={res.errors[0]?.message ?? "Unbekannter Fehler"} />
        <SearchHero
          title="Ersatzteile vergleichen"
          subtitle="Verbinden Sie dieses Frontend mit Hygraph und konfigurieren Sie die Umgebungsvariablen."
        />
      </>
    );
  }

  const page = res.data?.startseiten?.[0];
  const sections = page?.modulareSektionen as Record<string, unknown>[] | undefined;
  const held = sections?.find((b) => b.__typename === "HeldSektion") as HeldSektion | undefined;
  const siteTitle = page?.titel ?? "Ersatzteile vergleichen";

  return (
    <>
      <SearchHero
        title={held?.heldTitel ?? siteTitle}
        subtitle={
          held?.untertitel ??
          "Finden Sie passende Komponenten für Ihr Fahrzeug — mit klaren Kategorien und vergleichbaren Angeboten."
        }
        primaryCta={
          held?.primaererAufruf
            ? {
                label: held.primaererAufruf.buttonBeschriftung,
                href: held.primaererAufruf.zielUrl,
              }
            : { label: "Kategorien", href: "/kategorien" }
        }
        secondaryCta={
          held?.sekundaererAufruf
            ? {
                label: held.sekundaererAufruf.buttonBeschriftung,
                href: held.sekundaererAufruf.zielUrl,
              }
            : { label: "Ratgeber", href: "/ratgeber" }
        }
      />

      <ModularSections sections={sections} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-bold text-[var(--brand-ink)]">
              Beliebte Kategorien
            </h2>
            <p className="mt-1 text-[var(--brand-ink-muted)]">
              Direkt zu passenden Ersatzteilen und Zubehör.
            </p>
          </div>
          <a
            href="/kategorien"
            className="text-sm font-semibold text-[var(--brand-orange)] hover:underline"
          >
            Alle Kategorien
          </a>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(res.data?.kategorien ?? []).map((c) => (
            <CategoryTile key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="border-t border-black/5 bg-[var(--brand-surface)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-bold text-[var(--brand-ink)]">
                Aktuelle Produkte
              </h2>
              <p className="mt-1 text-[var(--brand-ink-muted)]">
                Aus dem Hygraph-Sortiment — mit Bildern und Marken.
              </p>
            </div>
            <a
              href="/kategorien"
              className="text-sm font-semibold text-[var(--brand-orange)] hover:underline"
            >
              Mehr entdecken
            </a>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(res.data?.produkte ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
