import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("france")
}

export default function FrancePage() {
  return <CountryLandingEngine slug="france" />
}

export const revalidate = 3600
