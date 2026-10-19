import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ColombiaLanding } from "@/components/country-landings/ColombiaLanding"
import { colombiaLandingConfig } from "@/lib/colombia-landing-config"
const canonical = colombiaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("colombia")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="colombia" />
}
