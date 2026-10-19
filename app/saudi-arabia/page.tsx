import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SaudiArabiaLanding } from "@/components/country-landings/SaudiArabiaLanding"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("saudi-arabia")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="saudi-arabia" />
}
