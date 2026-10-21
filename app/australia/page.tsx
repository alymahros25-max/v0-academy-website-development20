import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("australia")
}

export default function AustraliaPage() {
  return <CountryLandingEngine slug="australia" />
}

export const revalidate = 3600
