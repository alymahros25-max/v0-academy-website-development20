import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { FinlandLanding } from "@/components/country-landings/FinlandLanding"
import { finlandLandingConfig } from "@/lib/finland-landing-config"
const canonical = finlandLandingConfig.seo.canonical
export const metadata: Metadata = { title: finlandLandingConfig.seo.title, description: finlandLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في فنلندا", "تحفيظ القرآن في هلسنكي", "تعليم العربية أونلاين في فنلندا", "دروس قرآن في إسبو", "باقات القرآن باليورو في فنلندا"], alternates: { canonical: finlandLandingConfig.seo.canonical, languages: { ar: finlandLandingConfig.seo.canonical, "x-default": finlandLandingConfig.seo.canonical } }, openGraph: { title: finlandLandingConfig.seo.title, description: finlandLandingConfig.seo.description, url: finlandLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: finlandLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: finlandLandingConfig.seo.title, description: finlandLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="finland" specializedPage={FinlandLanding} />
}
