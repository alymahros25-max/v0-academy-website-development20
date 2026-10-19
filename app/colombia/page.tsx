import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ColombiaLanding } from "@/components/country-landings/ColombiaLanding"
import { colombiaLandingConfig } from "@/lib/colombia-landing-config"
const canonical = colombiaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("colombia")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="colombia" />
}
