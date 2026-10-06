import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { DenmarkLanding } from "@/components/country-landings/DenmarkLanding"
import { denmarkLandingConfig } from "@/lib/denmark-landing-config"
const canonical = denmarkLandingConfig.seo.canonical
export const metadata: Metadata = { title: denmarkLandingConfig.seo.title, description: denmarkLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في الدنمارك", "تحفيظ القرآن في كوبنهاغن", "تعليم العربية أونلاين في الدنمارك", "دروس قرآن في آرهوس", "باقات القرآن بالكرونة الدنماركية"], alternates: { canonical: denmarkLandingConfig.seo.canonical, languages: { ar: denmarkLandingConfig.seo.canonical, "x-default": denmarkLandingConfig.seo.canonical } }, openGraph: { title: denmarkLandingConfig.seo.title, description: denmarkLandingConfig.seo.description, url: denmarkLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: denmarkLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: denmarkLandingConfig.seo.title, description: denmarkLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="denmark" specializedPage={DenmarkLanding} />
}
