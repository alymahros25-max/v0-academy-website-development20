import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UnitedStatesLanding } from "@/components/country-landings/UnitedStatesLanding"
import { unitedStatesLandingConfig } from "@/lib/united-states-landing-config"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
export const metadata: Metadata = {
  title: unitedStatesLandingConfig.seo.title,
  description: unitedStatesLandingConfig.seo.description,
  alternates: getCountrySeoAlternates("unitedStates"),
  openGraph: { title: unitedStatesLandingConfig.seo.title, description: unitedStatesLandingConfig.seo.description, url: unitedStatesLandingConfig.seo.canonical, locale: "ar_US", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }] },
  twitter: { card: "summary_large_image", title: unitedStatesLandingConfig.seo.title, description: unitedStatesLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-states" specializedPage={UnitedStatesLanding} />
}
