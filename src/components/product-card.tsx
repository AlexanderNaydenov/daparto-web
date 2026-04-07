import Image from "next/image";
import Link from "next/link";
import { previewEntryField } from "@/lib/hygraph-preview-attrs";

export type ProductCardData = {
  id: string;
  titel: string;
  urlSlug: string;
  kurzbeschreibung?: string | null;
  hervorgehoben?: boolean | null;
  produktbilder?: { url: string; width?: number | null; height?: number | null }[] | null;
  marke?: { name: string } | null;
  kategorie?: { name: string; urlSlug: string } | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const img = product.produktbilder?.[0];
  const titelAttrs = previewEntryField(product.id, "titel");
  const kurzAttrs = previewEntryField(product.id, "kurzbeschreibung");
  return (
    <Link
      href={`/produkt/${product.urlSlug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:border-[var(--brand-orange)]/35 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-neutral-100">
        {img?.url ? (
          <Image
            src={img.url}
            alt={product.titel}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">Kein Bild</div>
        )}
        {product.hervorgehoben ? (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--brand-orange)] px-2.5 py-0.5 text-xs font-semibold text-white shadow">
            Top
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--brand-ink-muted)]">
          {product.marke?.name ? (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-medium text-[var(--brand-ink)]">
              {product.marke.name}
            </span>
          ) : null}
          {product.kategorie?.name ? <span>{product.kategorie.name}</span> : null}
        </div>
        <h3
          className="mt-2 line-clamp-2 font-[family-name:var(--font-barlow-condensed)] text-lg font-bold text-[var(--brand-ink)] group-hover:text-[var(--brand-orange)]"
          {...titelAttrs}
        >
          {product.titel}
        </h3>
        {product.kurzbeschreibung ? (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--brand-ink-muted)]" {...kurzAttrs}>
            {product.kurzbeschreibung}
          </p>
        ) : null}
        <span className="mt-auto pt-4 text-sm font-semibold text-[var(--brand-orange)]">
          Zum Produkt →
        </span>
      </div>
    </Link>
  );
}
