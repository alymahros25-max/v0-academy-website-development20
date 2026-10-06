import type { Metadata } from "next"
import { NewCountryLanding } from "@/components/new-country-landing"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import { australiaLandingConfig } from "@/lib/australia-landing-config"
import { getNewCountryConfig } from "@/lib/new-country-pages"

const config = getNewCountryConfig("australia")
if (!config) throw new Error("Missing centralized config for Australia")

export const metadata: Metadata = {
  title: australiaLandingConfig.seo.title,
  description: australiaLandingConfig.seo.description,
  alternates: getCountrySeoAlternates("australia"),
  openGraph: {
    title: australiaLandingConfig.seo.title,
    description: australiaLandingConfig.seo.description,
    url: australiaLandingConfig.seo.canonical,
    locale: "ar_AU",
    type: "website",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }],
  },
  twitter: {
    card: "summary_large_image",
    title: australiaLandingConfig.seo.title,
    description: australiaLandingConfig.seo.description,
    images: ["https://quran-elhafez.com/images/og-default.webp"],
  },
}

export default function AustraliaPage() {
  return <NewCountryLanding config={config} />
}
