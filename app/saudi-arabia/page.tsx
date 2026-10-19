import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SaudiArabiaLanding } from "@/components/country-landings/SaudiArabiaLanding"
import { getLandingPageConfig } from "@/lib/landing-page-config.server"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const config = await getLandingPageConfig("saudi-arabia")
  return getCountrySeoMetadata("saudi-arabia", config.seo.canonical)
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="saudi-arabia" />
}
