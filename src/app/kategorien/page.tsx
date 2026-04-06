import { CategoryTile } from "@/components/category-tile";
import { CmsErrorBanner } from "@/components/cms-error-banner";
import { hygraphFetch } from "@/lib/hygraph";
import { KATEGORIEN_LIST } from "@/lib/queries";
import type { Metadata } from "next";

export const revalidate = 60;

type Data = {
  kategorien: {
    id: string;
    name: string;
    urlSlug: string;
    kurzbeschreibung?: string | null;
  }[];
};

export const metadata: Metadata = {
  title: "Kategorien",
  description: "Alle Teilekategorien — von Bremsen bis Zubehör.",
};

export default async function KategorienPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const qRaw = sp.q;
  const q = typeof qRaw === "string" ? qRaw.trim().toLowerCase() : "";

  const res = await hygraphFetch<Data>(KATEGORIEN_LIST);

  if (res.errors?.length) {
    return <CmsErrorBanner message={res.errors[0]?.message ?? "Fehler"} />;
  }

  const all = res.data?.kategorien ?? [];
  const filtered =
    q.length === 0
      ? all
      : all.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.urlSlug.toLowerCase().includes(q) ||
            (c.kurzbeschreibung?.toLowerCase().includes(q) ?? false)
        );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold text-[var(--brand-ink)]">
        Kategorien
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--brand-ink-muted)]">
        {q
          ? `Treffer für „${q}“: ${filtered.length} von ${all.length} Kategorien.`
          : "Wählen Sie eine Kategorie, um passende Ersatzteile zu sehen."}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CategoryTile key={c.id} category={c} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-[var(--brand-ink-muted)]">
          Keine Kategorie gefunden.{" "}
          <a className="font-semibold text-[var(--brand-orange)]" href="/kategorien">
            Filter zurücksetzen
          </a>
        </p>
      ) : null}
    </div>
  );
}
