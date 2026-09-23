import type { Metadata } from "next"
import { NewCountryLanding } from "@/components/new-country-landing"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
const config = getNewCountryConfig("france")!
export const metadata: Metadata = { title: config.seoTitle, description: config.seoDescription, keywords: config.keywords, alternates: getCountrySeoAlternates("france"), openGraph: { title: config.seoTitle, description: config.seoDescription, type:"website", locale:"ar_FR" } }
export default function FrancePage() { return <NewCountryLanding config={config} /> }
