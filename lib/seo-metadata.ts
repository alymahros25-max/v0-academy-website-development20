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

export function getCountrySeoAlternates(canonical: string): NonNullable<Metadata['alternates']> {
  return {
    canonical,
    languages: {
      ar: canonical,
      'x-default': canonical,
    },
  }
}

export function withSeoAlternates(metadata: Metadata, canonical: string): Metadata {
  return {
    ...metadata,
    alternates: getSeoAlternates(canonical),
  }
}
