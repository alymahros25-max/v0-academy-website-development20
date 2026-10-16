import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { CanadaLanding } from "@/components/country-landings/CanadaLanding"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import { canadaLandingConfig } from "@/lib/canada-landing-config"
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("canada")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="canada" specializedPage={CanadaLanding} />
}
