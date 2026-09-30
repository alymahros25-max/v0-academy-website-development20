import type { Metadata } from "next"
import { NewCountryLanding } from "@/components/new-country-landing"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
const config = getNewCountryConfig("bahrain")!
export const metadata: Metadata = { title: config.seoTitle, description: config.seoDescription, keywords: config.keywords, alternates: getCountrySeoAlternates("bahrain"), openGraph: { title: config.seoTitle, description: config.seoDescription, type:"website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }], locale:"ar_BH" } }
export default function BahrainPage() { return <NewCountryLanding config={config} /> }
