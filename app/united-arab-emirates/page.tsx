import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UaeLanding } from "@/components/country-landings/UaeLanding"


export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("united-arab-emirates")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-arab-emirates" />
}

export const revalidate = 3600
