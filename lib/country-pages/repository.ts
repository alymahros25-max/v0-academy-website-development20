import { getAreaLandingData } from "@/lib/country-content"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { normalizeCountryPageModel } from "@/lib/country-pages/normalizer"
import type { CountryPageModel } from "@/lib/country-pages/types"

export type CountryPageRepositoryOptions = {
  loadLandingData?: typeof getAreaLandingData
}

/**
 * Transitional repository for the central page contract.
 * It reads the existing area loader today, so the current routes and database
 * remain untouched while a new staging adapter can be introduced later.
 */
export async function getCountryPageModel(
  slug: string,
  options: CountryPageRepositoryOptions = {},
): Promise<CountryPageModel | null> {
  const config = getNewCountryConfig(slug)
  if (!config) return null

  const loadLandingData = options.loadLandingData ?? getAreaLandingData
  const landingData = await loadLandingData(slug)
  return normalizeCountryPageModel(slug, config, landingData)
}
