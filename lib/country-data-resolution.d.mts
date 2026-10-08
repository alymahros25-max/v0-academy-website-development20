export type CountrySnapshotShape = {
  area: { slug: string; currency_code: string | null } | null
  packages: Array<{ currency_code: string; package_key: string }>
  faq: unknown[]
  content: unknown[]
  links: unknown[]
  theme: unknown | null
  cities: unknown[]
  timezones: unknown[]
}

export function resolveCountryLandingData<T extends CountrySnapshotShape>(
  slug: string,
  database: T,
  fallback: T | null,
): T

export function packageDuration(packageKey: string): number
export function isCountrySlug(slug: string): boolean
export function countryLandingCacheTag(slug: string): string
