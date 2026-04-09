import { CmsErrorBanner } from "@/components/cms-error-banner";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { RatgeberInhaltselemente } from "@/components/ratgeber-inhaltselemente";
import { defaultLocale, isAppLocale, type AppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";
import { previewEntryField } from "@/lib/hygraph-preview-attrs";
import { hygraphFetch } from "@/lib/hygraph";
import { RATGEBER_BY_SLUG } from "@/lib/queries";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

type RichText = {
  html?: string | null;
  text?: string | null;
  markdown?: string | null;
};

type Inhaltselement = Record<string, unknown> & { __typename?: string; id?: string };

type RelatedItem =
  | ({ __typename: "Produkt" } & ProductCardData)
  | {
      __typename: "Galerie";
      id: string;
      titel: string;
      eintraege?: {
        id?: string;
        bezeichnung?: string | null;
        linkUrl?: string | null;
        logo?: { url: string; width?: number | null; height?: number | null } | null;
      }[];
    };

type Article = {
  id: string;
  titel: string;
  urlSlug: string;
  teaser?: string | null;
  inhalt?: RichText | null;
  vorschaubild?: { url: string; width?: number | null; height?: number | null } | null;
  themenKategorie?: { id: string; name: string; urlSlug: string } | null;
  teilekategorie?: {
    value: string;
    path: { value: string }[];
  } | null;
  inhaltselemente?: Inhaltselement[] | null;
  relevanteProdukteUndMarken?: RelatedItem[] | null;
  seo?: {
    metaTitel?: string | null;
    metaBeschreibung?: string | null;
    suchmaschinenSichtbar?: boolean | null;
  } | null;
};

type Data = {
  ratgeberArtikelbeitraege: Article[];
};

function TeilekategoriePfad({ teilekategorie }: { teilekategorie: Article["teilekategorie"] }) {
  if (!teilekategorie?.path?.length) return null;
  const labels = teilekategorie.path.map((n) =>
    n.value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ")
  );
  return (
    <p className="mt-2 text-sm text-[var(--brand-ink-muted)]">
      <span className="font-medium text-[var(--brand-ink)]">Teilekategorie:</span>{" "}
      {labels.join(" › ")}
    </p>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale: AppLocale = isAppLocale(raw) ? raw : defaultLocale;
  const res = await hygraphFetch<Data>(RATGEBER_BY_SLUG, { slug }, { locale });
  const a = res.data?.ratgeberArtikelbeitraege?.[0];
  const noIndex = a?.seo?.suchmaschinenSichtbar === false;
  const ogImage = a?.vorschaubild?.url;
  return {
    title: a?.seo?.metaTitel ?? a?.titel,
    description: a?.seo?.metaBeschreibung ?? a?.teaser ?? undefined,
    robots: noIndex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : undefined,
    openGraph: ogImage
      ? {
          images: [{ url: ogImage, width: a.vorschaubild?.width ?? undefined, height: a.vorschaubild?.height ?? undefined }],
        }
      : undefined,
  };
}

export default async function RatgeberArtikelPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw;

  const res = await hygraphFetch<Data>(RATGEBER_BY_SLUG, { slug }, { locale });

  if (res.errors?.length) {
    return <CmsErrorBanner message={res.errors[0]?.message ?? "Fehler"} />;
  }

  const a = res.data?.ratgeberArtikelbeitraege?.[0];
  if (!a) notFound();

  const introHtml = a.inhalt?.html?.trim();
  const introFallback = a.inhalt?.text ?? "";
  const titelAttrs = previewEntryField(a.id, "titel");
  const teaserAttrs = previewEntryField(a.id, "teaser");
  const inhaltAttrs = previewEntryField(a.id, "inhalt");
  const vorschaubildAttrs = previewEntryField(a.id, "vorschaubild");
  const themenAttrs = a.themenKategorie ? previewEntryField(a.themenKategorie.id, "name") : {};

  const related = a.relevanteProdukteUndMarken ?? [];

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <nav className="text-sm text-[var(--brand-ink-muted)]">
          <Link href={withLocale(locale, "/")} className="hover:text-[var(--brand-orange)]">
            Start
          </Link>
          <span className="mx-2">/</span>
          <Link href={withLocale(locale, "/ratgeber")} className="hover:text-[var(--brand-orange)]">
            Ratgeber
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--brand-ink)]">{a.titel}</span>
        </nav>
      </div>

      {a.vorschaubild?.url ? (
        <div
          className="relative mt-8 aspect-[1200/630] w-full overflow-hidden rounded-2xl bg-neutral-100"
          {...vorschaubildAttrs}
        >
          <Image
            src={a.vorschaubild.url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1152px) 100vw, 1152px"
            priority
          />
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl">
      <h1
        className="mt-8 font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold text-[var(--brand-ink)]"
        {...titelAttrs}
      >
        {a.titel}
      </h1>

      {a.themenKategorie ? (
        <p className="mt-3">
          <Link
            href={withLocale(locale, `/kategorie/${a.themenKategorie.urlSlug}`)}
            className="inline-flex rounded-full bg-[var(--brand-surface)] px-3 py-1 text-sm font-semibold text-[var(--brand-orange)] hover:underline"
            {...themenAttrs}
          >
            {a.themenKategorie.name}
          </Link>
        </p>
      ) : null}

      <TeilekategoriePfad teilekategorie={a.teilekategorie} />

      {a.teaser ? (
        <p className="mt-4 text-lg text-[var(--brand-ink-muted)]" {...teaserAttrs}>
          {a.teaser}
        </p>
      ) : null}

      {introHtml ? (
        <div
          className="prose prose-neutral mt-10 max-w-none text-[var(--brand-ink-muted)] prose-headings:font-[family-name:var(--font-barlow-condensed)]"
          {...inhaltAttrs}
          data-hygraph-rich-text-format="html"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      ) : introFallback ? (
        <div
          className="prose prose-neutral mt-10 max-w-none text-[var(--brand-ink-muted)]"
          {...inhaltAttrs}
          data-hygraph-rich-text-format="text"
        >
          {introFallback.split("\n").map((line) => (
            <p key={line.slice(0, 80)}>{line}</p>
          ))}
        </div>
      ) : null}

      </div>

      <div className="mt-12">
        <RatgeberInhaltselemente sections={a.inhaltselemente} ratgeberArtikelId={a.id} />
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-black/10 pt-12">
          <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)]">
            Passende Produkte &amp; Marken
          </h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => {
              if (item.__typename === "Produkt") {
                return <ProductCard key={item.id} product={item} locale={locale} />;
              }
              if (item.__typename === "Galerie") {
                return (
                  <div
                    key={item.id}
                    className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-black/5 bg-[var(--brand-surface)] p-6"
                  >
                    <p className="font-[family-name:var(--font-barlow-condensed)] text-lg font-bold text-[var(--brand-ink)]">
                      {item.titel}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
                      {(item.eintraege ?? []).map((e) =>
                        e.logo?.url ? (
                          e.linkUrl ? (
                            <a
                              key={e.id ?? e.bezeichnung}
                              href={e.linkUrl}
                              className="relative h-10 w-28 opacity-80 transition hover:opacity-100"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={e.logo.url}
                                alt={e.bezeichnung ?? ""}
                                width={e.logo.width ?? 112}
                                height={e.logo.height ?? 40}
                                className="h-10 w-auto max-w-[7rem] object-contain"
                              />
                            </a>
                          ) : (
                            <div
                              key={e.id ?? e.bezeichnung}
                              className="relative h-10 w-28 opacity-80"
                            >
                              <Image
                                src={e.logo.url}
                                alt={e.bezeichnung ?? ""}
                                width={e.logo.width ?? 112}
                                height={e.logo.height ?? 40}
                                className="h-10 w-auto max-w-[7rem] object-contain"
                              />
                            </div>
                          )
                        ) : null
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </section>
      ) : null}
    </article>
  );
}
