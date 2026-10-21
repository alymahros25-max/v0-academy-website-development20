import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { MexicoLanding } from "@/components/country-landings/MexicoLanding"
import { mexicoLandingConfig } from "@/lib/mexico-landing-config"
const canonical = mexicoLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("mexico")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="mexico" />
}

export const revalidate = 3600
