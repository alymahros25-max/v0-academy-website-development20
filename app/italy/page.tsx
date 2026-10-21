import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ItalyLanding } from "@/components/country-landings/ItalyLanding"
import { italyLandingConfig } from "@/lib/italy-landing-config"
const canonical = italyLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("italy")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="italy" />
}

export const revalidate = 3600
