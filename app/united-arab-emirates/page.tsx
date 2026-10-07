import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UaeLanding } from "@/components/country-landings/UaeLanding"
import { uaeLandingConfig } from "@/lib/uae-landing-config"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
export const metadata: Metadata = {
  title: uaeLandingConfig.seo.title,
  description: uaeLandingConfig.seo.description,
  alternates: getCountrySeoAlternates("unitedArabEmirates"),
  robots: { index: true, follow: true },
  openGraph: { title: uaeLandingConfig.seo.title, description: uaeLandingConfig.seo.description, url: uaeLandingConfig.seo.canonical, locale: "ar_AE", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }] },
  twitter: { card: "summary_large_image", title: uaeLandingConfig.seo.title, description: uaeLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-arab-emirates" specializedPage={UaeLanding} />
}
