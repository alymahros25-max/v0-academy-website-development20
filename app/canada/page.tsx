import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { CanadaLanding } from "@/components/country-landings/CanadaLanding"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import { canadaLandingConfig } from "@/lib/canada-landing-config"
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("canada")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="canada" />
}
