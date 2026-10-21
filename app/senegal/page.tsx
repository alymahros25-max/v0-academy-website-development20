import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SenegalLanding } from "@/components/country-landings/SenegalLanding"
import { senegalLandingConfig } from "@/lib/senegal-landing-config"
const canonical = senegalLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("senegal")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="senegal" />
}

export const revalidate = 3600
