import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UaeLanding } from "@/components/country-landings/UaeLanding"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("united-arab-emirates")
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-arab-emirates" />
}
