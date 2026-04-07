/**
 * Visual-only vehicle selector (non-functional), inspired by daparto.de Fahrzeugauswahl.
 */
export function VehicleSelectionBox() {
  return (
    <div className="w-full rounded-2xl border border-white/15 bg-white p-5 shadow-2xl shadow-black/20 ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <h2 className="font-[family-name:var(--font-barlow-condensed)] text-lg font-bold tracking-tight text-[var(--brand-primary)] sm:text-xl">
          Fahrzeug auswählen
        </h2>
        <span className="rounded-md bg-[var(--brand-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-ink-muted)]">
          Demo
        </span>
      </div>

      <div className="mt-4 space-y-6">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-ink-muted)]">
            Fahrzeugauswahl nach KBA-Nr.
          </h3>
          <p className="mt-1 text-xs text-[var(--brand-ink-muted)]">
            Schlüsselnummern aus der Zulassungsbescheinigung Teil I (Felder D.2 + D.3).
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="kba-1" className="text-xs font-medium text-[var(--brand-ink)]">
                D.2 (4 Zeichen)
              </label>
              <input
                id="kba-1"
                name="kbaHsn"
                inputMode="numeric"
                maxLength={4}
                placeholder="0603"
                className="w-[5.5rem] rounded-lg border border-neutral-300 bg-neutral-50 px-2.5 py-2 text-center text-sm font-medium text-[var(--brand-ink)] outline-none ring-[var(--brand-accent)] focus:ring-2"
              />
            </div>
            <span className="mb-2.5 text-neutral-400" aria-hidden>
              /
            </span>
            <div className="flex flex-col gap-1">
              <label htmlFor="kba-2" className="text-xs font-medium text-[var(--brand-ink)]">
                D.3 (3 Zeichen)
              </label>
              <input
                id="kba-2"
                name="kbaTsn"
                inputMode="numeric"
                maxLength={3}
                placeholder="123"
                className="w-[4.5rem] rounded-lg border border-neutral-300 bg-neutral-50 px-2.5 py-2 text-center text-sm font-medium text-[var(--brand-ink)] outline-none ring-[var(--brand-accent)] focus:ring-2"
              />
            </div>
            <button
              type="button"
              disabled
              className="ml-auto rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white opacity-90 shadow-sm"
            >
              Übernehmen
            </button>
          </div>
        </section>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs font-medium uppercase tracking-wide text-[var(--brand-ink-muted)]">
            <span className="bg-white px-3">oder</span>
          </div>
        </div>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-ink-muted)]">
            Auswahl über den Fahrzeugkatalog
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--brand-ink)]">Hersteller</span>
              <select
                disabled
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-[var(--brand-ink)]"
                defaultValue=""
              >
                <option value="">Bitte wählen</option>
                <option>Audi</option>
                <option>BMW</option>
                <option>Mercedes-Benz</option>
                <option>VW</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--brand-ink)]">Modellreihe</span>
              <select
                disabled
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-[var(--brand-ink)]"
                defaultValue=""
              >
                <option value="">Bitte wählen</option>
                <option>A3</option>
                <option>Golf</option>
                <option>C-Klasse</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--brand-ink)]">Modell</span>
              <select
                disabled
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-[var(--brand-ink)]"
                defaultValue=""
              >
                <option value="">Bitte wählen</option>
                <option>Limousine</option>
                <option>Touring</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--brand-ink)]">Kraftstoff</span>
              <select
                disabled
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-[var(--brand-ink)]"
                defaultValue=""
              >
                <option value="">Bitte wählen</option>
                <option>Benzin</option>
                <option>Diesel</option>
                <option>Elektro</option>
                <option>Hybrid</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--brand-ink)]">Leistung (kW)</span>
              <select
                disabled
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-[var(--brand-ink)]"
                defaultValue=""
              >
                <option value="">Bitte wählen</option>
                <option>85</option>
                <option>110</option>
                <option>140</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[var(--brand-ink)]">Baujahr</span>
              <select
                disabled
                className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-[var(--brand-ink)]"
                defaultValue=""
              >
                <option value="">Bitte wählen</option>
                <option>2022</option>
                <option>2021</option>
                <option>2020</option>
              </select>
            </label>
          </div>
        </section>

        <div className="flex flex-col gap-2 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled
            className="rounded-lg bg-[var(--brand-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-md opacity-90"
          >
            Fahrzeug übernehmen
          </button>
          <button type="button" className="text-sm font-medium text-[var(--brand-primary)] underline-offset-2 hover:underline">
            Hilfe zur Fahrzeugauswahl
          </button>
        </div>
      </div>
    </div>
  );
}
