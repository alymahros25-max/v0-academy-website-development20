import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { CanadaLanding } from "@/components/country-landings/CanadaLanding"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import { canadaLandingConfig } from "@/lib/canada-landing-config"
export const metadata: Metadata = {
  title: canadaLandingConfig.seo.title,
  description: canadaLandingConfig.seo.description,
  alternates: getCountrySeoAlternates("canada"),
  openGraph: { title: canadaLandingConfig.seo.title, description: canadaLandingConfig.seo.description, url: canadaLandingConfig.seo.canonical, locale: "ar_CA", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }] },
  twitter: { card: "summary_large_image", title: canadaLandingConfig.seo.title, description: canadaLandingConfig.seo.description , images: ["https://quran-elhafez.com/images/og-default.webp"]},
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="canada" specializedPage={CanadaLanding} />
}
