import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("bahrain")
}

export default function BahrainPage() {
  return <CountryLandingEngine slug="bahrain" />
}

export const revalidate = 3600
