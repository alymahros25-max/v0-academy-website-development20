import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { MalaysiaLanding } from "@/components/country-landings/MalaysiaLanding"
import { malaysiaLandingConfig } from "@/lib/malaysia-landing-config"
const canonical = malaysiaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("malaysia")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="malaysia" />
}
