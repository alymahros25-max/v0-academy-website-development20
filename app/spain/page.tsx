import type { Metadata } from "next"
import { NewCountryLanding } from "@/components/new-country-landing"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { getSeoAlternates } from "@/lib/seo-metadata"
const config = getNewCountryConfig("spain")!
export const metadata: Metadata = { title: config.seoTitle, description: config.seoDescription, keywords: config.keywords, alternates: getSeoAlternates("https://quran-elhafez.com/spain"), openGraph: { title: config.seoTitle, description: config.seoDescription, type:"website", locale:"ar_ES" } }
export default function SpainPage() { return <NewCountryLanding config={config} /> }
