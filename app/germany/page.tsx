import type { Metadata } from "next"
import { NewCountryLanding } from "@/components/new-country-landing"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"

const config = getNewCountryConfig("germany")!

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: config.keywords,
  alternates: getCountrySeoAlternates("germany"),
  openGraph: {
    title: config.seoTitle,
    description: config.seoDescription,
    url: "https://quran-elhafez.com/germany",
    locale: "ar_DE",
    type: "website",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }],
  },
}

export default function GermanyPage() {
  return <NewCountryLanding config={config} />
}
