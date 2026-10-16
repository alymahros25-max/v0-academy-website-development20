import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { PolandLanding } from "@/components/country-landings/PolandLanding"
import { polandLandingConfig } from "@/lib/poland-landing-config"
const canonical = polandLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("poland")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="poland" specializedPage={PolandLanding} />
}
