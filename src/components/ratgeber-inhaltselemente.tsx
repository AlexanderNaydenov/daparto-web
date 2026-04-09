import Image from "next/image";
import {
  previewRatgeberBlockField,
  previewRatgeberNestedField,
} from "@/lib/hygraph-preview-attrs";

type RichSlice = { html?: string | null; text?: string | null; markdown?: string | null };

type Section = Record<string, unknown> & { __typename?: string; id?: string };

function proseClass() {
  return "prose prose-neutral max-w-none prose-p:leading-relaxed prose-headings:font-[family-name:var(--font-barlow-condensed)]";
}

function RichHtml({
  html,
  fallbackText,
  className,
  preview,
  richFormat,
}: {
  html?: string | null;
  fallbackText?: string | null;
  className?: string;
  preview: Record<string, string>;
  richFormat: "html" | "markdown";
}) {
  const inner = html?.trim() ? html : fallbackText ?? "";
  if (!inner) return null;
  if (html?.trim()) {
    return (
      <div
        className={className}
        {...preview}
        data-hygraph-rich-text-format={richFormat}
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    );
  }
  return (
    <div className={className} {...preview} data-hygraph-rich-text-format="text">
      <p>{inner}</p>
    </div>
  );
}

function previewBlock(
  ratgeberId: string | undefined,
  blockId: string | undefined,
  fieldApiId: string
): Record<string, string> {
  if (!ratgeberId || !blockId) return {};
  return previewRatgeberBlockField(ratgeberId, blockId, fieldApiId);
}

function nested(
  ratgeberId: string | undefined,
  sectionId: string | undefined,
  childField: string,
  childId: string | undefined,
  leafField: string
): Record<string, string> {
  if (!ratgeberId || !sectionId || !childId) return {};
  return previewRatgeberNestedField(ratgeberId, sectionId, childField, childId, leafField);
}

export function RatgeberInhaltselemente({
  sections,
  ratgeberArtikelId,
}: {
  sections: Section[] | null | undefined;
  ratgeberArtikelId?: string;
}) {
  if (!sections?.length) return null;

  return (
    <div className="space-y-16">
      {sections.map((block, i) => {
        switch (block.__typename) {
          case "BildMitText": {
            const title = block.bmtUeberschrift as string | undefined;
            const align = block.bildAusrichtung as string | undefined;
            const fliessText = block.fliessText as RichSlice | undefined;
            const img = block.abbildung as
              | { url: string; width?: number | null; height?: number | null }
              | null
              | undefined;
            const imageLeft = align === "LINKS";
            const bid = block.id as string | undefined;
            return (
              <section key={`bmt-${i}`} className="mx-auto max-w-6xl">
                <div
                  className={`flex flex-col gap-8 lg:flex-row lg:items-center ${
                    imageLeft ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {img?.url ? (
                    <div
                      className="relative aspect-[4/3] flex-1 overflow-hidden rounded-2xl bg-neutral-100"
                      {...previewBlock(ratgeberArtikelId, bid, "abbildung")}
                    >
                      <Image
                        src={img.url}
                        alt={title ?? "Abschnittsbild"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}
                  <div className="flex-1">
                    {title ? (
                      <h2
                        className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl"
                        {...previewBlock(ratgeberArtikelId, bid, "ueberschrift")}
                      >
                        {title}
                      </h2>
                    ) : null}
                    <RichHtml
                      html={fliessText?.html}
                      fallbackText={fliessText?.text}
                      className={`${proseClass()} mt-4 text-[var(--brand-ink-muted)]`}
                      preview={previewBlock(ratgeberArtikelId, bid, "fliessText")}
                      richFormat="html"
                    />
                  </div>
                </div>
              </section>
            );
          }
          case "KennzahlenLeiste": {
            const title = block.kennUeberschrift as string | undefined;
            const stats =
              (block.kennzahlen as {
                id?: string;
                zahlText: string;
                beschreibung: string;
              }[]) ?? [];
            const bid = block.id as string | undefined;
            return (
              <section
                key={`kn-${i}`}
                className="border-y border-black/5 bg-gradient-to-r from-[var(--brand-surface)] to-white py-12"
              >
                <div className="mx-auto max-w-6xl">
                  {title ? (
                    <h2
                      className="text-center font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl"
                      {...previewBlock(ratgeberArtikelId, bid, "ueberschrift")}
                    >
                      {title}
                    </h2>
                  ) : null}
                  <div className="mt-10 grid gap-8 sm:grid-cols-3">
                    {stats.map((s) => (
                      <div key={s.id ?? s.beschreibung} className="text-center">
                        <p
                          className="font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold text-[var(--brand-orange)] sm:text-5xl"
                          {...nested(ratgeberArtikelId, bid, "kennzahlen", s.id, "zahlText")}
                        >
                          {s.zahlText}
                        </p>
                        <p
                          className="mt-2 text-sm text-[var(--brand-ink-muted)]"
                          {...nested(ratgeberArtikelId, bid, "kennzahlen", s.id, "beschreibung")}
                        >
                          {s.beschreibung}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          case "ZitatBaustein": {
            const src = block.quellenangabe as string | undefined;
            const zitatText = block.zitatText as RichSlice | undefined;
            const bid = block.id as string | undefined;
            return (
              <section key={`zq-${i}`} className="mx-auto max-w-3xl">
                <blockquote className="rounded-2xl border-l-4 border-[var(--brand-orange)] bg-[var(--brand-surface)] px-6 py-8">
                  <div
                    className={`${proseClass()} font-[family-name:var(--font-barlow-condensed)] text-xl font-semibold italic text-[var(--brand-ink)] sm:text-2xl`}
                    {...previewBlock(ratgeberArtikelId, bid, "zitatText")}
                    data-hygraph-rich-text-format="html"
                    dangerouslySetInnerHTML={{
                      __html: zitatText?.html?.trim()
                        ? zitatText.html
                        : `<p>${zitatText?.text ?? ""}</p>`,
                    }}
                  />
                  {src ? (
                    <footer
                      className="mt-4 text-sm text-[var(--brand-ink-muted)]"
                      {...previewBlock(ratgeberArtikelId, bid, "quellenangabe")}
                    >
                      — {src}
                    </footer>
                  ) : null}
                </blockquote>
              </section>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
