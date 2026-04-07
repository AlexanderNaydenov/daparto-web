import Link from "next/link";
import type { AppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";
import { previewEntryField } from "@/lib/hygraph-preview-attrs";

export type CategoryTileData = {
  id: string;
  name: string;
  urlSlug: string;
  kurzbeschreibung?: string | null;
};

export function CategoryTile({ category, locale }: { category: CategoryTileData; locale: AppLocale }) {
  const nameAttrs = previewEntryField(category.id, "name");
  const kurzAttrs = previewEntryField(category.id, "kurzbeschreibung");
  return (
    <Link
      href={withLocale(locale, `/kategorie/${category.urlSlug}`)}
      className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-[var(--brand-orange)]/40 hover:shadow-md"
    >
      <span
        className="font-[family-name:var(--font-barlow-condensed)] text-lg font-bold text-[var(--brand-ink)] group-hover:text-[var(--brand-orange)]"
        {...nameAttrs}
      >
        {category.name}
      </span>
      {category.kurzbeschreibung ? (
        <p className="mt-2 line-clamp-2 text-sm text-[var(--brand-ink-muted)]" {...kurzAttrs}>
          {category.kurzbeschreibung}
        </p>
      ) : (
        <p className="mt-2 text-sm text-[var(--brand-ink-muted)]">Ersatzteile & passendes Zubehör entdecken.</p>
      )}
      <span className="mt-4 text-sm font-semibold text-[var(--brand-orange)]">Öffnen →</span>
    </Link>
  );
}
