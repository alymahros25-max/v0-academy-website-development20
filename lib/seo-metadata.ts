import type { Metadata } from 'next'

/**
 * Builds canonical and hreflang metadata for pages that have one Arabic URL.
 * Generic pages publish Arabic and x-default; country landing pages use the
 * explicit regional Arabic variants that exist as real, bidirectionally linked URLs.
 */
export function getSeoAlternates(canonical: string): NonNullable<Metadata['alternates']> {
  return {
    canonical,
    languages: {
      ar: canonical,
      'x-default': canonical,
    },
  }
}

const legacyCountryCanonicalBySlug: Record<string, string> = {
  australia: "https://quran-elhafez.com/australia",
  canada: "https://quran-elhafez.com/canada",
  germany: "https://quran-elhafez.com/germany",
  saudiArabia: "https://quran-elhafez.com/saudi-arabia",
  unitedArabEmirates: "https://quran-elhafez.com/united-arab-emirates",
  unitedKingdom: "https://quran-elhafez.com/united-kingdom",
  unitedStates: "https://quran-elhafez.com/united-states",
  kuwait: "https://quran-elhafez.com/kuwait",
  qatar: "https://quran-elhafez.com/qatar",
  oman: "https://quran-elhafez.com/oman",
  jordan: "https://quran-elhafez.com/jordan",
  bahrain: "https://quran-elhafez.com/bahrain",
  france: "https://quran-elhafez.com/france",
  spain: "https://quran-elhafez.com/spain",
  netherlands: "https://quran-elhafez.com/netherlands",
  belgium: "https://quran-elhafez.com/belgium",
  sweden: "https://quran-elhafez.com/sweden",
}

export function getCountrySeoAlternates(canonicalOrSlug: string): NonNullable<Metadata['alternates']> {
  const canonical = canonicalOrSlug.startsWith("http") ? canonicalOrSlug : legacyCountryCanonicalBySlug[canonicalOrSlug] ?? canonicalOrSlug
  return { canonical, languages: { ar: canonical, 'x-default': canonical } }
}

export function withSeoAlternates(metadata: Metadata, canonical: string): Metadata {
  return {
    ...metadata,
    alternates: getSeoAlternates(canonical),
  }
}
