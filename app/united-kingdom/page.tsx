import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UnitedKingdomLanding } from "@/components/country-landings/UnitedKingdomLanding"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import { unitedKingdomLandingConfig } from "@/lib/united-kingdom-landing-config"
export const metadata: Metadata = {
  title: unitedKingdomLandingConfig.seo.title,
  description: unitedKingdomLandingConfig.seo.description,
  alternates: getCountrySeoAlternates("unitedKingdom"),
  openGraph: { title: unitedKingdomLandingConfig.seo.title, description: unitedKingdomLandingConfig.seo.description, url: unitedKingdomLandingConfig.seo.canonical, locale: "ar_GB", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }] },
  twitter: { card: "summary_large_image", title: unitedKingdomLandingConfig.seo.title, description: unitedKingdomLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-kingdom" specializedPage={UnitedKingdomLanding} />
}
