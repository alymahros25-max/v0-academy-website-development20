import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { switzerlandLandingConfig } from "@/lib/switzerland-landing-config"
const canonical = switzerlandLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("switzerland")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="switzerland" />
}

export const revalidate = 3600
