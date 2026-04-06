import Link from "next/link";

export type CategoryTileData = {
  id: string;
  name: string;
  urlSlug: string;
  kurzbeschreibung?: string | null;
};

export function CategoryTile({ category }: { category: CategoryTileData }) {
  return (
    <Link
      href={`/kategorie/${category.urlSlug}`}
      className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-[var(--brand-orange)]/40 hover:shadow-md"
    >
      <span className="font-[family-name:var(--font-barlow-condensed)] text-lg font-bold text-[var(--brand-ink)] group-hover:text-[var(--brand-orange)]">
        {category.name}
      </span>
      {category.kurzbeschreibung ? (
        <p className="mt-2 line-clamp-2 text-sm text-[var(--brand-ink-muted)]">{category.kurzbeschreibung}</p>
      ) : (
        <p className="mt-2 text-sm text-[var(--brand-ink-muted)]">Ersatzteile & passendes Zubehör entdecken.</p>
      )}
      <span className="mt-4 text-sm font-semibold text-[var(--brand-orange)]">Öffnen →</span>
    </Link>
  );
}
