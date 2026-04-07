import { ProductCard } from "@/components/product-card";
import { CmsErrorBanner } from "@/components/cms-error-banner";
import { isAppLocale, defaultLocale, type AppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";
import { hygraphFetch } from "@/lib/hygraph";
import { CATEGORY_BY_SLUG } from "@/lib/queries";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Data = {
  kategorien: {
    id: string;
    name: string;
    urlSlug: string;
    kurzbeschreibung?: string | null;
    einleitungstext?: { text?: string | null } | null;
  }[];
  produkte: import("@/components/product-card").ProductCardData[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale: AppLocale = isAppLocale(raw) ? raw : defaultLocale;
  const res = await hygraphFetch<Data>(CATEGORY_BY_SLUG, { slug }, { locale });
  const k = res.data?.kategorien?.[0];
  return {
    title: k?.name ?? "Kategorie",
    description: k?.kurzbeschreibung ?? undefined,
  };
}

export default async function KategoriePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw;

  const res = await hygraphFetch<Data>(CATEGORY_BY_SLUG, { slug }, { locale });

  if (res.errors?.length) {
    return <CmsErrorBanner message={res.errors[0]?.message ?? "Fehler"} />;
  }

  const k = res.data?.kategorien?.[0];
  if (!k) notFound();

  const intro = k.einleitungstext?.text?.split("\n").filter(Boolean) ?? [];

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
        <span className="mx-2">/</span>
        <span className="text-[var(--brand-ink)]">{k.name}</span>
      </nav>

      <h1 className="mt-6 font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold text-[var(--brand-ink)]">
        {k.name}
      </h1>
      {k.kurzbeschreibung ? (
        <p className="mt-3 max-w-3xl text-lg text-[var(--brand-ink-muted)]">{k.kurzbeschreibung}</p>
      ) : null}

      {intro.length > 0 ? (
        <div className="prose prose-neutral mt-8 max-w-3xl text-[var(--brand-ink-muted)]">
          {intro.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      ) : null}

      <h2 className="mt-14 font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)]">
        Produkte in dieser Kategorie
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(res.data?.produkte ?? []).map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>

      {(res.data?.produkte ?? []).length === 0 ? (
        <p className="mt-8 text-[var(--brand-ink-muted)]">Noch keine Produkte in dieser Kategorie.</p>
      ) : null}
    </div>
  );
}
