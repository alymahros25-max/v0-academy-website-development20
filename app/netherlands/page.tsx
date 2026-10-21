import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("netherlands")
}

export default function NetherlandsPage() {
  return <CountryLandingEngine slug="netherlands" />
}

export const revalidate = 3600
