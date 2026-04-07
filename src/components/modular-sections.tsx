import Image from "next/image";
import {
  previewModularField,
  previewModularNestedField,
} from "@/lib/hygraph-preview-attrs";

type Section = Record<string, unknown> & { __typename?: string; id?: string };

function proseClass() {
  return "prose prose-neutral max-w-none prose-p:leading-relaxed prose-headings:font-[family-name:var(--font-barlow-condensed)]";
}

function a(
  startseiteId: string | undefined,
  blockId: string | undefined,
  fieldApiId: string
): Record<string, string> {
  if (!startseiteId || !blockId) return {};
  return previewModularField(startseiteId, blockId, fieldApiId);
}

function nested(
  startseiteId: string | undefined,
  sectionId: string | undefined,
  childField: string,
  childId: string | undefined,
  leafField: string
): Record<string, string> {
  if (!startseiteId || !sectionId || !childId) return {};
  return previewModularNestedField(startseiteId, sectionId, childField, childId, leafField);
}

export function ModularSections({
  sections,
  startseiteId,
}: {
  sections: Section[] | null | undefined;
  /** Startseite entry id — enables Hygraph click-to-edit on modular blocks */
  startseiteId?: string;
}) {
  if (!sections?.length) return null;

  return (
    <div className="space-y-16 py-12">
      {sections.map((block, i) => {
        if (block.__typename === "HeldSektion") return null;

        switch (block.__typename) {
          case "FreitextSektion": {
            const abs = block.abschnittsUeberschrift as string | undefined;
            const text =
              (block.inhalt as { text?: string } | undefined)?.text ?? "";
            const bid = block.id as string | undefined;
            return (
              <section key={`ft-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                {abs ? (
                  <h2
                    className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl"
                    {...a(startseiteId, bid, "abschnittsUeberschrift")}
                  >
                    {abs}
                  </h2>
                ) : null}
                <div
                  className={`${proseClass()} mt-4 text-[var(--brand-ink-muted)]`}
                  {...a(startseiteId, bid, "inhalt")}
                  data-hygraph-rich-text-format="markdown"
                >
                  <p>{text}</p>
                </div>
              </section>
            );
          }
          case "MerkmalBlock": {
            const title = block.blockUeberschrift as string | undefined;
            const rows =
              (block.zeilen as { id?: string; bezeichnung: string; wert: string }[]) ?? [];
            const bid = block.id as string | undefined;
            return (
              <section key={`mb-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                {title ? (
                  <h2
                    className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl"
                    {...a(startseiteId, bid, "blockUeberschrift")}
                  >
                    {title}
                  </h2>
                ) : null}
                <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rows.map((row) => (
                    <div
                      key={row.id ?? `${row.bezeichnung}-${row.wert}`}
                      className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                    >
                      <dt
                        className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-ink-muted)]"
                        {...nested(startseiteId, bid, "zeilen", row.id, "bezeichnung")}
                      >
                        {row.bezeichnung}
                      </dt>
                      <dd
                        className="mt-1 text-lg font-semibold text-[var(--brand-ink)]"
                        {...nested(startseiteId, bid, "zeilen", row.id, "wert")}
                      >
                        {row.wert}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          }
          case "FaqBlock": {
            const title = block.faqTitel as string | undefined;
            const items =
              (block.eintraege as {
                id?: string;
                frage: string;
                antwort?: { text?: string };
              }[]) ?? [];
            const bid = block.id as string | undefined;
            return (
              <section key={`faq-${i}`} className="mx-auto max-w-3xl px-4 sm:px-6">
                {title ? (
                  <h2
                    className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl"
                    {...a(startseiteId, bid, "ueberschrift")}
                  >
                    {title}
                  </h2>
                ) : null}
                <ul className="mt-8 space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.id ?? item.frage}
                      className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                    >
                      <p
                        className="font-semibold text-[var(--brand-ink)]"
                        {...nested(startseiteId, bid, "eintraege", item.id, "frage")}
                      >
                        {item.frage}
                      </p>
                      <p
                        className="mt-2 text-sm text-[var(--brand-ink-muted)]"
                        {...nested(startseiteId, bid, "eintraege", item.id, "antwort")}
                        data-hygraph-rich-text-format="text"
                      >
                        {item.antwort?.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          case "KennzahlenLeiste": {
            const title = block.kennTitel as string | undefined;
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
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  {title ? (
                    <h2
                      className="text-center font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl"
                      {...a(startseiteId, bid, "ueberschrift")}
                    >
                      {title}
                    </h2>
                  ) : null}
                  <div className="mt-10 grid gap-8 sm:grid-cols-3">
                    {stats.map((s) => (
                      <div key={s.id ?? s.beschreibung} className="text-center">
                        <p
                          className="font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold text-[var(--brand-orange)] sm:text-5xl"
                          {...nested(startseiteId, bid, "kennzahlen", s.id, "zahlText")}
                        >
                          {s.zahlText}
                        </p>
                        <p
                          className="mt-2 text-sm text-[var(--brand-ink-muted)]"
                          {...nested(startseiteId, bid, "kennzahlen", s.id, "beschreibung")}
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
          case "TeaserRaster": {
            const t = block.teaserTitel as string | undefined;
            const sub = block.untertitel as string | undefined;
            const cards =
              (block.karten as {
                id?: string;
                titel: string;
                kurzbeschreibung?: string;
                linkUrl: string;
              }[]) ?? [];
            const bid = block.id as string | undefined;
            return (
              <section key={`tr-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                {t ? (
                  <h2
                    className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl"
                    {...a(startseiteId, bid, "ueberschrift")}
                  >
                    {t}
                  </h2>
                ) : null}
                {sub ? (
                  <p className="mt-2 text-[var(--brand-ink-muted)]" {...a(startseiteId, bid, "untertitel")}>
                    {sub}
                  </p>
                ) : null}
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((c) => (
                    <a
                      key={c.id ?? c.linkUrl + c.titel}
                      href={c.linkUrl}
                      className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:border-[var(--brand-orange)]/40 hover:shadow-md"
                    >
                      <h3
                        className="font-[family-name:var(--font-barlow-condensed)] text-xl font-bold text-[var(--brand-ink)] group-hover:text-[var(--brand-orange)]"
                        {...nested(startseiteId, bid, "karten", c.id, "titel")}
                      >
                        {c.titel}
                      </h3>
                      {c.kurzbeschreibung ? (
                        <p
                          className="mt-2 text-sm text-[var(--brand-ink-muted)]"
                          {...nested(startseiteId, bid, "karten", c.id, "kurzbeschreibung")}
                        >
                          {c.kurzbeschreibung}
                        </p>
                      ) : null}
                      <span className="mt-4 inline-flex text-sm font-semibold text-[var(--brand-orange)]">
                        Mehr erfahren →
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            );
          }
          case "LogoLeiste": {
            const t = block.logoTitel as string | undefined;
            const bid = block.id as string | undefined;
            return (
              <section key={`ll-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                {t ? (
                  <p
                    className="text-center text-sm font-semibold uppercase tracking-widest text-[var(--brand-ink-muted)]"
                    {...a(startseiteId, bid, "ueberschrift")}
                  >
                    {t}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale">
                  {["Bosch", "Continental", "ZF", "Valeo", "Hella"].map((name) => (
                    <span
                      key={name}
                      className="font-[family-name:var(--font-barlow-condensed)] text-xl font-bold text-[var(--brand-ink)]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </section>
            );
          }
          case "BildMitText": {
            const title = block.bmtTitel as string | undefined;
            const align = block.bildAusrichtung as string | undefined;
            const text =
              (block.fliessText as { text?: string } | undefined)?.text ?? "";
            const img = block.abbildung as
              | { url: string; width?: number; height?: number }
              | null
              | undefined;
            const imageLeft = align === "LINKS";
            const bid = block.id as string | undefined;
            return (
              <section key={`bmt-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                <div
                  className={`flex flex-col gap-8 lg:flex-row lg:items-center ${
                    imageLeft ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {img?.url ? (
                    <div
                      className="relative aspect-[4/3] flex-1 overflow-hidden rounded-2xl bg-neutral-100"
                      {...a(startseiteId, bid, "abbildung")}
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
                        {...a(startseiteId, bid, "ueberschrift")}
                      >
                        {title}
                      </h2>
                    ) : null}
                    <div
                      className={`${proseClass()} mt-4 text-[var(--brand-ink-muted)]`}
                      {...a(startseiteId, bid, "fliessText")}
                      data-hygraph-rich-text-format="markdown"
                    >
                      <p>{text}</p>
                    </div>
                  </div>
                </div>
              </section>
            );
          }
          case "ZitatBaustein": {
            const src = block.quellenangabe as string | undefined;
            const quote =
              (block.zitatText as { text?: string } | undefined)?.text ?? "";
            const bid = block.id as string | undefined;
            return (
              <section key={`zq-${i}`} className="mx-auto max-w-3xl px-4 sm:px-6">
                <blockquote className="rounded-2xl border-l-4 border-[var(--brand-orange)] bg-[var(--brand-surface)] px-6 py-8">
                  <p
                    className="font-[family-name:var(--font-barlow-condensed)] text-xl font-semibold italic text-[var(--brand-ink)] sm:text-2xl"
                    {...a(startseiteId, bid, "zitatText")}
                    data-hygraph-rich-text-format="text"
                  >
                    “{quote}”
                  </p>
                  {src ? (
                    <footer
                      className="mt-4 text-sm text-[var(--brand-ink-muted)]"
                      {...a(startseiteId, bid, "quellenangabe")}
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
