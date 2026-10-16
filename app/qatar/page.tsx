import type { Metadata } from "next"
import { getCountrySeoMetadata } from "@/lib/country-seo"
import { NewCountryLanding } from "@/components/new-country-landing"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
const config = getNewCountryConfig("qatar")!
export async function generateMetadata(): Promise<Metadata> {
  return getCountrySeoMetadata("qatar")
}
export default function QatarPage() { return <NewCountryLanding config={config} /> }
