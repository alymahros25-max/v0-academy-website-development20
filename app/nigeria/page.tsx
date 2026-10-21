import type { Metadata } from "next"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { NigeriaLanding } from "@/components/country-landings/NigeriaLanding"
import { nigeriaLandingConfig } from "@/lib/nigeria-landing-config"
const canonical = nigeriaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("nigeria")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="nigeria" />
}

export const revalidate = 3600
