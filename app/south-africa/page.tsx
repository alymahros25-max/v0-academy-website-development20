import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SouthAfricaLanding } from "@/components/country-landings/SouthAfricaLanding"
import { southAfricaLandingConfig } from "@/lib/south-africa-landing-config"
const canonical = southAfricaLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("south-africa")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="south-africa" />
}
