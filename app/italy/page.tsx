import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ItalyLanding } from "@/components/country-landings/ItalyLanding"
import { italyLandingConfig } from "@/lib/italy-landing-config"
const canonical = italyLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("italy")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="italy" specializedPage={ItalyLanding} />
}
