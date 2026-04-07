import { CmsErrorBanner } from "@/components/cms-error-banner";
import { isAppLocale, defaultLocale, type AppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";
import { hygraphFetch } from "@/lib/hygraph";
import { RATGEBER_BY_SLUG } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Data = {
  ratgeberArtikelbeitraege: {
    id: string;
    titel: string;
    urlSlug: string;
    teaser?: string | null;
    inhalt?: { text?: string | null } | null;
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
  const res = await hygraphFetch<Data>(RATGEBER_BY_SLUG, { slug }, { locale });
  const a = res.data?.ratgeberArtikelbeitraege?.[0];
  return {
    title: a?.seo?.metaTitel ?? a?.titel,
    description: a?.seo?.metaBeschreibung ?? a?.teaser ?? undefined,
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

  const paragraphs = a.inhalt?.text?.split("\n").filter(Boolean) ?? [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
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

      <h1 className="mt-6 font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold text-[var(--brand-ink)]">
        {a.titel}
      </h1>
      {a.teaser ? <p className="mt-4 text-lg text-[var(--brand-ink-muted)]">{a.teaser}</p> : null}

      <div className="prose prose-neutral mt-10 max-w-none text-[var(--brand-ink-muted)]">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      </div>
    </article>
  );
}
