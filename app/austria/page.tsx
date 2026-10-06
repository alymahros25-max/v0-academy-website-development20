import type { Metadata } from "next"
import { NewCountryLanding } from "@/components/new-country-landing"
import { austriaLandingConfig } from "@/lib/austria-landing-config"
import { getNewCountryConfig } from "@/lib/new-country-pages"

const config = getNewCountryConfig("austria")
if (!config) throw new Error("Missing centralized config for Austria")

export const metadata: Metadata = {
  title: austriaLandingConfig.seo.title,
  description: austriaLandingConfig.seo.description,
  keywords: [...austriaLandingConfig.keywords],
  alternates: {
    canonical: austriaLandingConfig.seo.canonical,
    languages: { ar: austriaLandingConfig.seo.canonical, "x-default": austriaLandingConfig.seo.canonical },
  },
  openGraph: {
    title: austriaLandingConfig.seo.title,
    description: austriaLandingConfig.seo.description,
    url: austriaLandingConfig.seo.canonical,
    locale: "ar_AT",
    type: "website",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في النمسا" }],
  },
  twitter: {
    card: "summary_large_image",
    title: austriaLandingConfig.seo.title,
    description: austriaLandingConfig.seo.description,
    images: ["https://quran-elhafez.com/images/og-default.webp"],
  },
}

export default function AustriaPage() {
  return <NewCountryLanding config={config} />
}
