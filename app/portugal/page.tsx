import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { portugalLandingConfig } from "@/lib/portugal-landing-config"
const canonical = portugalLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("portugal")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="portugal" />
}

export const revalidate = 3600
