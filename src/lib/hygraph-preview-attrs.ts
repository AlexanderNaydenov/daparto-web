import { createComponentChainLink, createPreviewAttributes } from "@hygraph/preview-sdk/core";

type PreviewDataAttrs = Record<string, string>;

function attrs(a: ReturnType<typeof createPreviewAttributes>): PreviewDataAttrs {
  return a as unknown as PreviewDataAttrs;
}

/** Root Startseite field `modulareSektionen` + one component instance. */
export function previewModularField(
  startseiteId: string,
  sectionInstanceId: string,
  fieldApiId: string
): PreviewDataAttrs {
  return attrs(
    createPreviewAttributes({
      entryId: startseiteId,
      fieldApiId,
      componentChain: [createComponentChainLink("modulareSektionen", sectionInstanceId)],
    })
  );
}

/** Two-level component nesting (e.g. FAQ item under FaqBlock). */
export function previewModularNestedField(
  startseiteId: string,
  sectionInstanceId: string,
  childFieldApiId: string,
  childInstanceId: string,
  leafFieldApiId: string
): PreviewDataAttrs {
  return attrs(
    createPreviewAttributes({
      entryId: startseiteId,
      fieldApiId: leafFieldApiId,
      componentChain: [
        createComponentChainLink("modulareSektionen", sectionInstanceId),
        createComponentChainLink(childFieldApiId, childInstanceId),
      ],
    })
  );
}

/** Galerie row: field `eintraege` + logo component instance. */
export function previewGalerieEintragField(
  galerieId: string,
  eintragInstanceId: string,
  fieldApiId: string
): PreviewDataAttrs {
  return attrs(
    createPreviewAttributes({
      entryId: galerieId,
      fieldApiId,
      componentChain: [createComponentChainLink("eintraege", eintragInstanceId)],
    })
  );
}

/** Top-level model entry + field (e.g. Produkt, Kategorie). */
export function previewEntryField(entryId: string, fieldApiId: string): PreviewDataAttrs {
  return attrs(
    createPreviewAttributes({
      entryId,
      fieldApiId,
    })
  );
}

/** Ratgeber-Artikel: field `inhaltselemente` + one component block (BildMitText, KennzahlenLeiste, ZitatBaustein). */
export function previewRatgeberBlockField(
  ratgeberArtikelId: string,
  blockInstanceId: string,
  fieldApiId: string
): PreviewDataAttrs {
  return attrs(
    createPreviewAttributes({
      entryId: ratgeberArtikelId,
      fieldApiId,
      componentChain: [createComponentChainLink("inhaltselemente", blockInstanceId)],
    })
  );
}

/** Nested under a Ratgeber block (e.g. Kennzahlen row). */
export function previewRatgeberNestedField(
  ratgeberArtikelId: string,
  blockInstanceId: string,
  childFieldApiId: string,
  childInstanceId: string,
  leafFieldApiId: string
): PreviewDataAttrs {
  return attrs(
    createPreviewAttributes({
      entryId: ratgeberArtikelId,
      fieldApiId: leafFieldApiId,
      componentChain: [
        createComponentChainLink("inhaltselemente", blockInstanceId),
        createComponentChainLink(childFieldApiId, childInstanceId),
      ],
    })
  );
}
