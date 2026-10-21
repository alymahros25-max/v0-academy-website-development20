import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SaudiArabiaLanding } from "@/components/country-landings/SaudiArabiaLanding"


export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("saudi-arabia")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="saudi-arabia" />
}

export const revalidate = 3600
