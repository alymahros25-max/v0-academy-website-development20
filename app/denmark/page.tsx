import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { DenmarkLanding } from "@/components/country-landings/DenmarkLanding"
import { denmarkLandingConfig } from "@/lib/denmark-landing-config"
const canonical = denmarkLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("denmark")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="denmark" />
}
