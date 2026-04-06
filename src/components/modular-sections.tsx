import Image from "next/image";

type Section = Record<string, unknown> & { __typename?: string };

function proseClass() {
  return "prose prose-neutral max-w-none prose-p:leading-relaxed prose-headings:font-[family-name:var(--font-barlow-condensed)]";
}

export function ModularSections({
  sections,
}: {
  sections: Section[] | null | undefined;
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
            return (
              <section key={`ft-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                {abs ? (
                  <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl">
                    {abs}
                  </h2>
                ) : null}
                <div className={`${proseClass()} mt-4 text-[var(--brand-ink-muted)]`}>
                  <p>{text}</p>
                </div>
              </section>
            );
          }
          case "MerkmalBlock": {
            const title = block.blockUeberschrift as string | undefined;
            const rows = (block.zeilen as { bezeichnung: string; wert: string }[]) ?? [];
            return (
              <section key={`mb-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                {title ? (
                  <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl">
                    {title}
                  </h2>
                ) : null}
                <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rows.map((row) => (
                    <div
                      key={`${row.bezeichnung}-${row.wert}`}
                      className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-ink-muted)]">
                        {row.bezeichnung}
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-[var(--brand-ink)]">{row.wert}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          }
          case "FaqBlock": {
            const title = block.faqTitel as string | undefined;
            const items =
              (block.eintraege as { frage: string; antwort?: { text?: string } }[]) ?? [];
            return (
              <section key={`faq-${i}`} className="mx-auto max-w-3xl px-4 sm:px-6">
                {title ? (
                  <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl">
                    {title}
                  </h2>
                ) : null}
                <ul className="mt-8 space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.frage}
                      className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                    >
                      <p className="font-semibold text-[var(--brand-ink)]">{item.frage}</p>
                      <p className="mt-2 text-sm text-[var(--brand-ink-muted)]">
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
              (block.kennzahlen as { zahlText: string; beschreibung: string }[]) ?? [];
            return (
              <section
                key={`kn-${i}`}
                className="border-y border-black/5 bg-gradient-to-r from-[var(--brand-surface)] to-white py-12"
              >
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  {title ? (
                    <h2 className="text-center font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl">
                      {title}
                    </h2>
                  ) : null}
                  <div className="mt-10 grid gap-8 sm:grid-cols-3">
                    {stats.map((s) => (
                      <div key={s.beschreibung} className="text-center">
                        <p className="font-[family-name:var(--font-barlow-condensed)] text-4xl font-bold text-[var(--brand-orange)] sm:text-5xl">
                          {s.zahlText}
                        </p>
                        <p className="mt-2 text-sm text-[var(--brand-ink-muted)]">{s.beschreibung}</p>
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
              (block.karten as { titel: string; kurzbeschreibung?: string; linkUrl: string }[]) ??
              [];
            return (
              <section key={`tr-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                {t ? (
                  <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl">
                    {t}
                  </h2>
                ) : null}
                {sub ? <p className="mt-2 text-[var(--brand-ink-muted)]">{sub}</p> : null}
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((c) => (
                    <a
                      key={c.linkUrl + c.titel}
                      href={c.linkUrl}
                      className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:border-[var(--brand-orange)]/40 hover:shadow-md"
                    >
                      <h3 className="font-[family-name:var(--font-barlow-condensed)] text-xl font-bold text-[var(--brand-ink)] group-hover:text-[var(--brand-orange)]">
                        {c.titel}
                      </h3>
                      {c.kurzbeschreibung ? (
                        <p className="mt-2 text-sm text-[var(--brand-ink-muted)]">{c.kurzbeschreibung}</p>
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
            return (
              <section key={`ll-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                {t ? (
                  <p className="text-center text-sm font-semibold uppercase tracking-widest text-[var(--brand-ink-muted)]">
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
            return (
              <section key={`bmt-${i}`} className="mx-auto max-w-6xl px-4 sm:px-6">
                <div
                  className={`flex flex-col gap-8 lg:flex-row lg:items-center ${
                    imageLeft ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {img?.url ? (
                    <div className="relative aspect-[4/3] flex-1 overflow-hidden rounded-2xl bg-neutral-100">
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
                      <h2 className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl">
                        {title}
                      </h2>
                    ) : null}
                    <div className={`${proseClass()} mt-4 text-[var(--brand-ink-muted)]`}>
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
            return (
              <section key={`zq-${i}`} className="mx-auto max-w-3xl px-4 sm:px-6">
                <blockquote className="rounded-2xl border-l-4 border-[var(--brand-orange)] bg-[var(--brand-surface)] px-6 py-8">
                  <p className="font-[family-name:var(--font-barlow-condensed)] text-xl font-semibold italic text-[var(--brand-ink)] sm:text-2xl">
                    “{quote}”
                  </p>
                  {src ? (
                    <footer className="mt-4 text-sm text-[var(--brand-ink-muted)]">— {src}</footer>
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
