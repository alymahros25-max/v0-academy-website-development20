import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { VenezuelaLanding } from "@/components/country-landings/VenezuelaLanding"
import { venezuelaLandingConfig } from "@/lib/venezuela-landing-config"
const canonical = venezuelaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("venezuela")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="venezuela" />
}
