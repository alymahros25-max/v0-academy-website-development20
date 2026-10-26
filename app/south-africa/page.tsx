import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { southAfricaLandingConfig } from "@/lib/south-africa-landing-config"
const canonical = southAfricaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("south-africa")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="south-africa" />
}

export const revalidate = 3600
