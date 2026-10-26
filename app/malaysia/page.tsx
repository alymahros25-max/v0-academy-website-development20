import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { malaysiaLandingConfig } from "@/lib/malaysia-landing-config"
const canonical = malaysiaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("malaysia")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="malaysia" />
}

export const revalidate = 3600
