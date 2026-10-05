import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CountryPageRenderer } from "@/components/country-pages/country-page-renderer"
import { getCountryPageModel } from "@/lib/country-pages/repository"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"

const config = getNewCountryConfig("qatar")!

export const metadata: Metadata = {
  title: config.seoTitle,
  description: config.seoDescription,
  keywords: config.keywords,
  alternates: getCountrySeoAlternates("qatar"),
  openGraph: {
    title: config.seoTitle,
    description: config.seoDescription,
    type: "website",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }],
    locale: "ar_QA",
  },
}

export default async function QatarPage( ) {
  const page = await getCountryPageModel("qatar")
  if (!page) notFound()
  return <CountryPageRenderer page={page} />
}
