import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UnitedStatesLanding } from "@/components/country-landings/UnitedStatesLanding"
import { unitedStatesLandingConfig } from "@/lib/united-states-landing-config"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("united-states")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-states" specializedPage={UnitedStatesLanding} />
}
