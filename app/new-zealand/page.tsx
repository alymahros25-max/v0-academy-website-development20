import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { NewZealandLanding } from "@/components/country-landings/NewZealandLanding"
import { newZealandLandingConfig } from "@/lib/new-zealand-landing-config"
const canonical = newZealandLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("new-zealand")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="new-zealand" specializedPage={NewZealandLanding} />
}
