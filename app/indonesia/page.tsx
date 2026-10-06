import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { IndonesiaLanding } from "@/components/country-landings/IndonesiaLanding"
import { indonesiaLandingConfig } from "@/lib/indonesia-landing-config"
const canonical = indonesiaLandingConfig.seo.canonical
export const metadata: Metadata = { title: indonesiaLandingConfig.seo.title, description: indonesiaLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في إندونيسيا", "تحفيظ القرآن في جاكرتا", "تعليم العربية أونلاين في إندونيسيا", "دروس قرآن في سورابايا", "باقات القرآن بالروبية الإندونيسية"], alternates: { canonical: indonesiaLandingConfig.seo.canonical, languages: { ar: indonesiaLandingConfig.seo.canonical, "x-default": indonesiaLandingConfig.seo.canonical } }, openGraph: { title: indonesiaLandingConfig.seo.title, description: indonesiaLandingConfig.seo.description, url: indonesiaLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: indonesiaLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: indonesiaLandingConfig.seo.title, description: indonesiaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="indonesia" specializedPage={IndonesiaLanding} />
}
