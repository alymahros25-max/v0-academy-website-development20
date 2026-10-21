import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("germany")
}

export default function GermanyPage() {
  return <CountryLandingEngine slug="germany" />
}

export const revalidate = 3600
