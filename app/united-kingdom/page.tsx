import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UnitedKingdomLanding } from "@/components/country-landings/UnitedKingdomLanding"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import { unitedKingdomLandingConfig } from "@/lib/united-kingdom-landing-config"
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("united-kingdom")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-kingdom" specializedPage={UnitedKingdomLanding} />
}
