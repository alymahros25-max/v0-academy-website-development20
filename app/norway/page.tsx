import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { NorwayLanding } from "@/components/country-landings/NorwayLanding"
import { norwayLandingConfig } from "@/lib/norway-landing-config"
const canonical = norwayLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("norway")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="norway" specializedPage={NorwayLanding} />
}
