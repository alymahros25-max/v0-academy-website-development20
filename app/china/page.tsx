import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ChinaLanding } from "@/components/country-landings/ChinaLanding"
import { chinaLandingConfig } from "@/lib/china-landing-config"
const canonical = chinaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("china")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="china" />
}

export const revalidate = 3600
