import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadata } from "@/lib/country-seo"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("spain")
}

export default function SpainPage() {
  return <CountryLandingEngine slug="spain" />
}
