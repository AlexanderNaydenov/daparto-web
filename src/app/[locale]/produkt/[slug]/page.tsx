import { CmsErrorBanner } from "@/components/cms-error-banner";
import { isAppLocale, defaultLocale, type AppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";
import { hygraphFetch } from "@/lib/hygraph";
import { previewEntryField } from "@/lib/hygraph-preview-attrs";
import { PRODUCT_BY_SLUG } from "@/lib/queries";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Data = {
  produkte: {
    id: string;
    titel: string;
    urlSlug: string;
    kurzbeschreibung?: string | null;
    herstellerReferenz?: string | null;
    hervorgehoben?: boolean | null;
    vollbeschreibung?: { text?: string | null; markdown?: string | null } | null;
    produktbilder: { url: string; width?: number | null; height?: number | null }[];
    marke?: { name: string; urlSlug: string } | null;
    kategorie?: { name: string; urlSlug: string } | null;
    technischeMerkmale?: {
      blockUeberschrift?: string | null;
      zeilen: { bezeichnung: string; wert: string }[];
    } | null;
    stichwortMerkmale: { bezeichnung: string; wert: string }[];
    seo?: { metaTitel?: string | null; metaBeschreibung?: string | null } | null;
  }[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale: AppLocale = isAppLocale(raw) ? raw : defaultLocale;
  const res = await hygraphFetch<Data>(PRODUCT_BY_SLUG, { slug }, { locale });
  const p = res.data?.produkte?.[0];
  return {
    title: p?.seo?.metaTitel ?? p?.titel,
    description: p?.seo?.metaBeschreibung ?? p?.kurzbeschreibung ?? undefined,
  };
}

export default async function ProduktPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw;

  const res = await hygraphFetch<Data>(PRODUCT_BY_SLUG, { slug }, { locale });

  if (res.errors?.length) {
    return <CmsErrorBanner message={res.errors[0]?.message ?? "Fehler"} />;
  }

  const p = res.data?.produkte?.[0];
  if (!p) notFound();

  const body = p.vollbeschreibung?.text?.split("\n").filter(Boolean) ?? [];
  const titelAttrs = previewEntryField(p.id, "titel");
  const kurzAttrs = previewEntryField(p.id, "kurzbeschreibung");
  const vollAttrs = previewEntryField(p.id, "vollbeschreibung");
  const refAttrs = previewEntryField(p.id, "herstellerReferenz");
  const bildAttrs = previewEntryField(p.id, "produktbilder");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-[var(--brand-ink-muted)]">
        <Link href={withLocale(locale, "/")} className="hover:text-[var(--brand-orange)]">
          Start
        </Link>
        <span className="mx-2">/</span>
        <Link href={withLocale(locale, "/kategorien")} className="hover:text-[var(--brand-orange)]">
          Kategorien
        </Link>
        {p.kategorie ? (
          <>
            <span className="mx-2">/</span>
            <Link
              href={withLocale(locale, `/kategorie/${p.kategorie.urlSlug}`)}
              className="hover:text-[var(--brand-orange)]"
            >
              {p.kategorie.name}
            </Link>
          </>
        ) : null}
        <span className="mx-2">/</span>
        <span className="text-[var(--brand-ink)]">{p.titel}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          {p.produktbilder?.[0]?.url ? (
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100" {...bildAttrs}>
              <Image
                src={p.produktbilder[0].url}
                alt={p.titel}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : null}
          {p.produktbilder && p.produktbilder.length > 1 ? (
            <div className="grid grid-cols-4 gap-2">
              {p.produktbilder.slice(1, 5).map((img) => (
                <div key={img.url} className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
                  <Image src={img.url} alt="" fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {p.marke?.name ? (
              <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-semibold text-[var(--brand-ink)]">
                {p.marke.name}
              </span>
            ) : null}
            {p.hervorgehoben ? (
              <span className="rounded-full bg-[var(--brand-orange)] px-2.5 py-0.5 text-xs font-semibold text-white">
                Hervorgehoben
              </span>
            ) : null}
          </div>
          <h1
            className="mt-3 font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold text-[var(--brand-ink)]"
            {...titelAttrs}
          >
            {p.titel}
          </h1>
          {p.kurzbeschreibung ? (
            <p className="mt-4 text-lg text-[var(--brand-ink-muted)]" {...kurzAttrs}>
              {p.kurzbeschreibung}
            </p>
          ) : null}
          {p.herstellerReferenz ? (
            <p className="mt-4 text-sm text-[var(--brand-ink-muted)]" {...refAttrs}>
              <span className="font-semibold text-[var(--brand-ink)]">Referenz:</span>{" "}
              {p.herstellerReferenz}
            </p>
          ) : null}
        </div>
      </div>

      {body.length > 0 ? (
        <section
          className="prose prose-neutral mt-12 max-w-3xl"
          {...vollAttrs}
          data-hygraph-rich-text-format="text"
        >
          <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)]">
            Beschreibung
          </h2>
          {body.map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </section>
      ) : null}

      {p.technischeMerkmale?.zeilen?.length ? (
        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)]">
            {p.technischeMerkmale.blockUeberschrift ?? "Technische Merkmale"}
          </h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {p.technischeMerkmale.zeilen.map((z) => (
              <div
                key={`${z.bezeichnung}-${z.wert}`}
                className="flex justify-between gap-4 rounded-xl border border-black/5 bg-[var(--brand-surface)] px-4 py-3"
              >
                <dt className="text-sm text-[var(--brand-ink-muted)]">{z.bezeichnung}</dt>
                <dd className="text-sm font-semibold text-[var(--brand-ink)]">{z.wert}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {p.stichwortMerkmale?.length ? (
        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)]">
            Stichworte
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.stichwortMerkmale.map((m) => (
              <li
                key={`${m.bezeichnung}-${m.wert}`}
                className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-[var(--brand-ink)]"
              >
                <span className="text-[var(--brand-ink-muted)]">{m.bezeichnung}:</span> {m.wert}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
