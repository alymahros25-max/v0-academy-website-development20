import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { getCountrySeoMetadata } from "@/lib/country-seo"

export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("kuwait")
}

export default function KuwaitPage() {
  return <CountryLandingEngine slug="kuwait" />
}
