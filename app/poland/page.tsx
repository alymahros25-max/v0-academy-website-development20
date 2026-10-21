import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { PolandLanding } from "@/components/country-landings/PolandLanding"
import { polandLandingConfig } from "@/lib/poland-landing-config"
const canonical = polandLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("poland")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="poland" />
}

export const revalidate = 3600
