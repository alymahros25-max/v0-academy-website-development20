import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SwitzerlandLanding } from "@/components/country-landings/SwitzerlandLanding"
import { switzerlandLandingConfig } from "@/lib/switzerland-landing-config"
const canonical = switzerlandLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("switzerland")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="switzerland" specializedPage={SwitzerlandLanding} />
}
