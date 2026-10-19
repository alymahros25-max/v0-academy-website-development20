import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { GreeceLanding } from "@/components/country-landings/GreeceLanding"
import { greeceLandingConfig } from "@/lib/greece-landing-config"
const canonical = greeceLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("greece")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="greece" />
}
