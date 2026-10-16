import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { NewCountryLanding } from "@/components/new-country-landing"
import { austriaLandingConfig } from "@/lib/austria-landing-config"
import { getNewCountryConfig } from "@/lib/new-country-pages"

const config = getNewCountryConfig("austria")
if (!config) throw new Error("Missing centralized config for Austria")

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("austria")
}
export default function AustriaPage() {
  return <NewCountryLanding config={config} />
}
