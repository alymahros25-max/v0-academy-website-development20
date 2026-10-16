import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { NewCountryLanding } from "@/components/new-country-landing"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import { australiaLandingConfig } from "@/lib/australia-landing-config"
import { getNewCountryConfig } from "@/lib/new-country-pages"

const config = getNewCountryConfig("australia")
if (!config) throw new Error("Missing centralized config for Australia")

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("australia")
}
export default function AustraliaPage() {
  return <NewCountryLanding config={config} />
}
