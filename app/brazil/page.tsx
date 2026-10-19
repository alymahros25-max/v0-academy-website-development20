import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { BrazilLanding } from "@/components/country-landings/BrazilLanding"
import { brazilLandingConfig } from "@/lib/brazil-landing-config"
const canonical = brazilLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("brazil")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="brazil" />
}
