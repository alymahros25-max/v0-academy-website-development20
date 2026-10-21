import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("austria")
}

export default function AustriaPage() {
  return <CountryLandingEngine slug="austria" />
}

export const revalidate = 3600
