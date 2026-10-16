import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SenegalLanding } from "@/components/country-landings/SenegalLanding"
import { senegalLandingConfig } from "@/lib/senegal-landing-config"
const canonical = senegalLandingConfig.seo.canonical
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("senegal")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="senegal" specializedPage={SenegalLanding} />
}
