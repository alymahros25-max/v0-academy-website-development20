import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadataFromDatabase } from "@/lib/country-seo-data"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadataFromDatabase("oman")
}

export default function OmanPage() {
  return <CountryLandingEngine slug="oman" />
}

export const revalidate = 3600
