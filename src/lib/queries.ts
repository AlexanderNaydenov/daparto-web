export const BANNER_QUERY = /* GraphQL */ `
  query Banner($locales: [Locale!]!) {
    banners(where: { aktiv: true }, first: 1, orderBy: updatedAt_DESC, locales: $locales) {
      id
      text
      linkLabel
      linkUrl
    }
  }
`;

export const HOME_PAGE_QUERY = /* GraphQL */ `
  query HomePage($locales: [Locale!]!) {
    startseiten(locales: $locales, first: 1, orderBy: updatedAt_DESC) {
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
    kategorien(locales: $locales, first: 24, orderBy: name_ASC) {
      id
      name
      urlSlug
      kurzbeschreibung
    }
    produkte(locales: $locales, first: 12, orderBy: updatedAt_DESC) {
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
  query KategorieBySlug($slug: String!, $locales: [Locale!]!) {
    kategorien(where: { urlSlug: $slug }, locales: $locales, first: 1) {
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
      locales: $locales
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
  query ProduktBySlug($slug: String!, $locales: [Locale!]!) {
    produkte(where: { urlSlug: $slug }, locales: $locales, first: 1) {
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
  query KategorienList($locales: [Locale!]!) {
    kategorien(locales: $locales, first: 100, orderBy: name_ASC) {
      id
      name
      urlSlug
      kurzbeschreibung
    }
  }
`;

export const RATGEBER_LIST = /* GraphQL */ `
  query Ratgeber($locales: [Locale!]!) {
    ratgeberArtikelbeitraege(locales: $locales, first: 50, orderBy: updatedAt_DESC) {
      id
      titel
      urlSlug
      teaser
      vorschaubild {
        url
        width
        height
      }
      themenKategorie {
        id
        name
        urlSlug
      }
    }
  }
`;

export const RATGEBER_BY_SLUG = /* GraphQL */ `
  query RatgeberArtikel($slug: String!, $locales: [Locale!]!) {
    ratgeberArtikelbeitraege(where: { urlSlug: $slug }, locales: $locales, first: 1) {
      id
      titel
      urlSlug
      teaser
      inhalt {
        html
        text
        markdown
      }
      vorschaubild {
        url
        width
        height
      }
      themenKategorie {
        id
        name
        urlSlug
      }
      teilekategorie {
        value
        path {
          value
        }
      }
      inhaltselemente {
        __typename
        ... on BildMitText {
          id
          ueberschrift
          bildAusrichtung
          abbildung {
            url
            width
            height
          }
          fliessText {
            html
            text
            markdown
          }
        }
        ... on KennzahlenLeiste {
          id
          ueberschrift
          kennzahlen {
            id
            zahlText
            beschreibung
          }
        }
        ... on ZitatBaustein {
          id
          zitatText {
            html
            text
            markdown
          }
          quellenangabe
        }
      }
      relevanteProdukteUndMarken {
        __typename
        ... on Produkt {
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
        ... on Galerie {
          id
          titel
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
      seo {
        metaTitel
        metaBeschreibung
        suchmaschinenSichtbar
      }
    }
  }
`;
