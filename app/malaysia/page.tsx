import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { MalaysiaLanding } from "@/components/country-landings/MalaysiaLanding"
import { malaysiaLandingConfig } from "@/lib/malaysia-landing-config"
const canonical = malaysiaLandingConfig.seo.canonical
export const metadata: Metadata = { title: malaysiaLandingConfig.seo.title, description: malaysiaLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في ماليزيا", "تحفيظ القرآن في كوالالمبور", "تعليم العربية أونلاين في ماليزيا", "دروس قرآن في جورج تاون", "باقات القرآن بالرينغيت الماليزي"], alternates: { canonical: malaysiaLandingConfig.seo.canonical, languages: { ar: malaysiaLandingConfig.seo.canonical, "x-default": malaysiaLandingConfig.seo.canonical } }, openGraph: { title: malaysiaLandingConfig.seo.title, description: malaysiaLandingConfig.seo.description, url: malaysiaLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: malaysiaLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: malaysiaLandingConfig.seo.title, description: malaysiaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="malaysia" specializedPage={MalaysiaLanding} />
}
