import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SaudiArabiaLanding } from "@/components/country-landings/SaudiArabiaLanding"
import { saudiLandingConfig } from "@/lib/saudi-landing-config"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
export const metadata: Metadata = {
  title: saudiLandingConfig.seo.title,
  description: saudiLandingConfig.seo.description,
  alternates: getCountrySeoAlternates("saudiArabia"),
  robots: { index: true, follow: true },
  openGraph: { title: saudiLandingConfig.seo.title, description: saudiLandingConfig.seo.description, url: saudiLandingConfig.seo.canonical, locale: "ar_SA", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }] },
  twitter: { card: "summary_large_image", title: saudiLandingConfig.seo.title, description: saudiLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="saudi-arabia" specializedPage={SaudiArabiaLanding} />
}
