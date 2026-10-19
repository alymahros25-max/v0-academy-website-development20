import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { IndonesiaLanding } from "@/components/country-landings/IndonesiaLanding"
import { indonesiaLandingConfig } from "@/lib/indonesia-landing-config"
const canonical = indonesiaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("indonesia")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="indonesia" />
}
