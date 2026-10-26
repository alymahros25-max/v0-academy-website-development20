import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { russiaLandingConfig } from "@/lib/russia-landing-config"
const canonical = russiaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("russia")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="russia" />
}

export const revalidate = 3600
