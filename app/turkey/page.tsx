import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { turkeyLandingConfig } from "@/lib/turkey-landing-config"
const canonical = turkeyLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("turkey")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="turkey" />
}

export const revalidate = 3600
