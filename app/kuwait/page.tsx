import type { Metadata } from "next"
import { NewCountryLanding } from "@/components/new-country-landing"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"

const config = getNewCountryConfig("kuwait")!

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: config.keywords,
  alternates: getCountrySeoAlternates("kuwait"),
  openGraph: { title: config.seoTitle, description: config.seoDescription, type: "website", locale: "ar_KW" },
}

export default function KuwaitPage() {
  return <NewCountryLanding config={config} />
}
