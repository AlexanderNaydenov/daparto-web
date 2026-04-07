export const BANNER_QUERY = /* GraphQL */ `
  query Banner {
    banners(where: { aktiv: true }, first: 1, orderBy: updatedAt_DESC) {
      id
      text
      linkLabel
      linkUrl
    }
  }
`;

export const HOME_PAGE_QUERY = /* GraphQL */ `
  query HomePage {
    startseiten(first: 1, orderBy: updatedAt_DESC) {
      id
      titel
      urlSlug
      seo {
        metaTitel
        metaBeschreibung
      }
      modulareSektionen {
        __typename
        ... on HeldSektion {
          id
          heldTitel: ueberschrift
          untertitel
          primaererAufruf {
            buttonBeschriftung
            zielUrl
          }
          sekundaererAufruf {
            buttonBeschriftung
            zielUrl
          }
        }
        ... on TeaserRaster {
          id
          teaserTitel: ueberschrift
          untertitel
          karten {
            id
            titel
            kurzbeschreibung
            linkUrl
          }
        }
        ... on KennzahlenLeiste {
          id
          kennTitel: ueberschrift
          kennzahlen {
            id
            zahlText
            beschreibung
          }
        }
        ... on LogoLeiste {
          id
          logoTitel: ueberschrift
        }
        ... on FreitextSektion {
          id
          abschnittsUeberschrift
          inhalt {
            text
            markdown
          }
        }
        ... on MerkmalBlock {
          id
          blockUeberschrift
          zeilen {
            id
            bezeichnung
            wert
          }
        }
        ... on FaqBlock {
          id
          faqTitel: ueberschrift
          eintraege {
            id
            frage
            antwort {
              text
              markdown
            }
          }
        }
        ... on BildMitText {
          id
          bmtTitel: ueberschrift
          bildAusrichtung
          fliessText {
            text
            markdown
          }
          abbildung {
            url
            width
            height
          }
        }
        ... on ZitatBaustein {
          id
          zitatText {
            text
            markdown
          }
          quellenangabe
        }
      }
      galerien {
        id
        titel
        kategorie
        eintraege {
          id
          bezeichnung
          linkUrl
          logo {
            url
            width
            height
          }
        }
      }
    }
    kategorien(first: 24, orderBy: name_ASC) {
      id
      name
      urlSlug
      kurzbeschreibung
    }
    produkte(first: 12, orderBy: updatedAt_DESC) {
      id
      titel
      urlSlug
      kurzbeschreibung
      hervorgehoben
      produktbilder(first: 1) {
        url
        width
        height
      }
      marke {
        name
      }
      kategorie {
        name
        urlSlug
      }
    }
  }
`;

export const CATEGORY_BY_SLUG = /* GraphQL */ `
  query KategorieBySlug($slug: String!) {
    kategorien(where: { urlSlug: $slug }, first: 1) {
      id
      name
      urlSlug
      kurzbeschreibung
      einleitungstext {
        text
        markdown
      }
    }
    produkte(
      where: { kategorie: { urlSlug: $slug } }
      first: 48
      orderBy: titel_ASC
    ) {
      id
      titel
      urlSlug
      kurzbeschreibung
      produktbilder(first: 1) {
        url
        width
        height
      }
      marke {
        name
      }
    }
  }
`;

export const PRODUCT_BY_SLUG = /* GraphQL */ `
  query ProduktBySlug($slug: String!) {
    produkte(where: { urlSlug: $slug }, first: 1) {
      id
      titel
      urlSlug
      kurzbeschreibung
      herstellerReferenz
      hervorgehoben
      vollbeschreibung {
        text
        markdown
      }
      produktbilder {
        url
        width
        height
      }
      marke {
        name
        urlSlug
      }
      kategorie {
        name
        urlSlug
      }
      technischeMerkmale {
        blockUeberschrift
        zeilen {
          bezeichnung
          wert
        }
      }
      stichwortMerkmale {
        bezeichnung
        wert
      }
      seo {
        metaTitel
        metaBeschreibung
      }
    }
  }
`;

export const KATEGORIEN_LIST = /* GraphQL */ `
  query KategorienList {
    kategorien(first: 100, orderBy: name_ASC) {
      id
      name
      urlSlug
      kurzbeschreibung
    }
  }
`;

export const RATGEBER_LIST = /* GraphQL */ `
  query Ratgeber {
    ratgeberArtikelbeitraege(first: 50, orderBy: updatedAt_DESC) {
      id
      titel
      urlSlug
      teaser
    }
  }
`;

export const RATGEBER_BY_SLUG = /* GraphQL */ `
  query RatgeberArtikel($slug: String!) {
    ratgeberArtikelbeitraege(where: { urlSlug: $slug }, first: 1) {
      id
      titel
      urlSlug
      teaser
      inhalt {
        text
        markdown
      }
      seo {
        metaTitel
        metaBeschreibung
      }
    }
  }
`;
