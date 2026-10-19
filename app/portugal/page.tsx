import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { PortugalLanding } from "@/components/country-landings/PortugalLanding"
import { portugalLandingConfig } from "@/lib/portugal-landing-config"
const canonical = portugalLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("portugal")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="portugal" />
}
