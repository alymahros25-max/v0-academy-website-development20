import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { venezuelaLandingConfig } from "@/lib/venezuela-landing-config"
const canonical = venezuelaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("venezuela")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="venezuela" />
}

export const revalidate = 3600
