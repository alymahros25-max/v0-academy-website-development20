import type { ReactElement } from "react"
import { NewCountryLanding } from "@/components/new-country-landing"
import { getNewCountryConfig } from "@/lib/new-country-pages"

type CountryLandingEngineProps = {
  slug: string
  specializedPage?: () => Promise<ReactElement>
}

/** Central route dispatcher: specialized country experiences remain intact while using one engine entry point. */
export function CountryLandingEngine({ slug, specializedPage: SpecializedPage }: CountryLandingEngineProps) {
  if (SpecializedPage) return <SpecializedPage />

  const config = getNewCountryConfig(slug)
  if (!config) throw new Error(`Missing centralized country landing configuration for ${slug}`)
  return <NewCountryLanding config={config} />
}
