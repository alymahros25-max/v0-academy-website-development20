import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UaeLanding } from "@/components/country-landings/UaeLanding"
import { getLandingPageConfig } from "@/lib/landing-page-config.server"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const config = await getLandingPageConfig("uae")
  return getCountrySeoMetadata("united-arab-emirates", config.seo.canonical)
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-arab-emirates" specializedPage={UaeLanding} />
}
