import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("sweden")
}

export default function SwedenPage() {
  return <CountryLandingEngine slug="sweden" />
}

export const revalidate = 3600
