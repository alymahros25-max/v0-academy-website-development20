import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { NorwayLanding } from "@/components/country-landings/NorwayLanding"
import { norwayLandingConfig } from "@/lib/norway-landing-config"
const canonical = norwayLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("norway")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="norway" />
}

export const revalidate = 3600
