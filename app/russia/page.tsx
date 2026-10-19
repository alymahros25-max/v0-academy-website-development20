import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { RussiaLanding } from "@/components/country-landings/RussiaLanding"
import { russiaLandingConfig } from "@/lib/russia-landing-config"
const canonical = russiaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("russia")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="russia" />
}
