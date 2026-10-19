import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { FinlandLanding } from "@/components/country-landings/FinlandLanding"
import { finlandLandingConfig } from "@/lib/finland-landing-config"
const canonical = finlandLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("finland")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="finland" />
}
