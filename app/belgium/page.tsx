import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("belgium")
}

export default function BelgiumPage() {
  return <CountryLandingEngine slug="belgium" />
}

export const revalidate = 3600
