import { CategoryTile } from "@/components/category-tile";
import { CmsErrorBanner } from "@/components/cms-error-banner";
import { HomepageGalerien, type GalerieRow } from "@/components/homepage-galerien";
import { ModularSections } from "@/components/modular-sections";
import { ProductCard } from "@/components/product-card";
import { SearchHero } from "@/components/search-hero";
import { isAppLocale, defaultLocale, type AppLocale } from "@/i18n/config";
import { resolveCmsHref, withLocale } from "@/i18n/navigation";
import { hygraphFetch } from "@/lib/hygraph";
import { previewModularField } from "@/lib/hygraph-preview-attrs";
import { HOME_PAGE_QUERY } from "@/lib/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

type HeldSektion = {
  __typename: "HeldSektion";
  id?: string;
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
    galerien?: GalerieRow[] | null;
  }[];
  kategorien: {
    id: string;
    name: string;
    urlSlug: string;
    kurzbeschreibung?: string | null;
  }[];
  produkte: import("@/components/product-card").ProductCardData[];
};

export function generateStaticParams() {
  return [{ locale: "de" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isAppLocale(raw) ? raw : defaultLocale;
  const res = await hygraphFetch<Pick<HomeData, "startseiten">>(HOME_PAGE_QUERY, {}, { locale });
  const s = res.data?.startseiten?.[0];
  const seo = s?.seo;
  return {
    title: seo?.metaTitel ?? s?.titel ?? undefined,
    description: seo?.metaBeschreibung ?? undefined,
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw;

  const res = await hygraphFetch<HomeData>(HOME_PAGE_QUERY, {}, { locale });

  if (res.errors?.length) {
    return (
      <>
        <CmsErrorBanner message={res.errors[0]?.message ?? "Unbekannter Fehler"} />
        <SearchHero
          locale={locale}
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
  const sid = page?.id;
  const hid = held?.id;
  const heroTitleAttrs = sid && hid ? previewModularField(sid, hid, "ueberschrift") : undefined;
  const heroSubtitleAttrs = sid && hid ? previewModularField(sid, hid, "untertitel") : undefined;

  return (
    <>
      <SearchHero
        locale={locale}
        title={held?.heldTitel ?? siteTitle}
        subtitle={
          held?.untertitel ??
          "Finden Sie passende Komponenten für Ihr Fahrzeug — mit klaren Kategorien und vergleichbaren Angeboten."
        }
        previewTitleAttrs={heroTitleAttrs}
        previewSubtitleAttrs={heroSubtitleAttrs}
        primaryCta={
          held?.primaererAufruf
            ? {
                label: held.primaererAufruf.buttonBeschriftung,
                href: resolveCmsHref(locale, held.primaererAufruf.zielUrl),
              }
            : { label: "Kategorien", href: withLocale(locale, "/kategorien") }
        }
        secondaryCta={
          held?.sekundaererAufruf
            ? {
                label: held.sekundaererAufruf.buttonBeschriftung,
                href: resolveCmsHref(locale, held.sekundaererAufruf.zielUrl),
              }
            : { label: "Ratgeber", href: withLocale(locale, "/ratgeber") }
        }
      />

      <ModularSections sections={sections} startseiteId={page?.id} />

      <HomepageGalerien galerien={page?.galerien} />

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
            href={withLocale(locale, "/kategorien")}
            className="text-sm font-semibold text-[var(--brand-orange)] hover:underline"
          >
            Alle Kategorien
          </a>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(res.data?.kategorien ?? []).map((c) => (
            <CategoryTile key={c.id} category={c} locale={locale} />
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
              href={withLocale(locale, "/kategorien")}
              className="text-sm font-semibold text-[var(--brand-orange)] hover:underline"
            >
              Mehr entdecken
            </a>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(res.data?.produkte ?? []).map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
