/**
 * Resolve one country's landing snapshot without allowing another slug's data
 * to leak into the result. Matching database values take precedence over the
 * same country's fallback values.
 */
export function resolveCountryLandingData(slug, database, fallback) {
  const matchingDatabase = database.area?.slug === slug ? database : null
  const matchingFallback = fallback?.area?.slug === slug ? fallback : null
  const area = matchingDatabase?.area ?? matchingFallback?.area ?? null
  const currencyCode = area?.currency_code

  const databasePackages = (matchingDatabase?.packages ?? []).filter(
    (pkg) => !currencyCode || pkg.currency_code === currencyCode,
  )
  const fallbackPackages = (matchingFallback?.packages ?? []).filter(
    (pkg) => !currencyCode || pkg.currency_code === currencyCode,
  )

  return {
    area,
    packages: databasePackages.length ? databasePackages : fallbackPackages,
    faq: matchingDatabase?.faq.length ? matchingDatabase.faq : matchingFallback?.faq ?? [],
    content: matchingDatabase?.content.length ? matchingDatabase.content : matchingFallback?.content ?? [],
    links: matchingDatabase?.links.length ? matchingDatabase.links : matchingFallback?.links ?? [],
    theme: matchingDatabase?.theme ?? matchingFallback?.theme ?? null,
    cities: matchingDatabase?.cities.length ? matchingDatabase.cities : matchingFallback?.cities ?? [],
    timezones: matchingDatabase?.timezones.length ? matchingDatabase.timezones : matchingFallback?.timezones ?? [],
  }
}

/** Older country seed keys omit duration and represent the standard 30-minute lesson. */
export function packageDuration(packageKey) {
  const explicitDuration = packageKey.match(/^(?:quran|arabic|other)-(\d+)-\d+(?:-\d+)?$/)
  if (explicitDuration) return Number(explicitDuration[1])
  return /^(?:quran|arabic)-\d+$/.test(packageKey) ? 30 : 0
}

export function isCountrySlug(slug) {
  return slug.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export function countryLandingCacheTag(slug) {
  return `country-content:${slug}`
}
