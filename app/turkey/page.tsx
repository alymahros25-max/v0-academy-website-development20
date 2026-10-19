import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { TurkeyLanding } from "@/components/country-landings/TurkeyLanding"
import { turkeyLandingConfig } from "@/lib/turkey-landing-config"
const canonical = turkeyLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("turkey")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="turkey" />
}
