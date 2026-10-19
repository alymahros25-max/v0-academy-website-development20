import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ArgentinaLanding } from "@/components/country-landings/ArgentinaLanding"
import { argentinaLandingConfig } from "@/lib/argentina-landing-config"
const canonical = argentinaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("argentina")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="argentina" />
}
