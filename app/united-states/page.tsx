import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UnitedStatesLanding } from "@/components/country-landings/UnitedStatesLanding"
import { unitedStatesLandingConfig } from "@/lib/united-states-landing-config"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("united-states")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-states" />
}

export const revalidate = 3600
