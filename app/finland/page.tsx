import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { FinlandLanding } from "@/components/country-landings/FinlandLanding"
import { finlandLandingConfig } from "@/lib/finland-landing-config"
const canonical = finlandLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("finland")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="finland" />
}
