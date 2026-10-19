import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UnitedKingdomLanding } from "@/components/country-landings/UnitedKingdomLanding"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import { unitedKingdomLandingConfig } from "@/lib/united-kingdom-landing-config"
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("united-kingdom")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-kingdom" />
}
