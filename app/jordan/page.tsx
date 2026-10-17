import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadata } from "@/lib/country-seo"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("jordan")
}

export default function JordanPage() {
  return <CountryLandingEngine slug="jordan" />
}
