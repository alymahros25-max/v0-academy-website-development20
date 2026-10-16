import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ChinaLanding } from "@/components/country-landings/ChinaLanding"
import { chinaLandingConfig } from "@/lib/china-landing-config"
const canonical = chinaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("china")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="china" specializedPage={ChinaLanding} />
}
