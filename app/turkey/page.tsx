import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { TurkeyLanding } from "@/components/country-landings/TurkeyLanding"
import { turkeyLandingConfig } from "@/lib/turkey-landing-config"
const canonical = turkeyLandingConfig.seo.canonical
export const metadata: Metadata = { title: turkeyLandingConfig.seo.title, description: turkeyLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في تركيا", "تحفيظ القرآن في إسطنبول", "تعليم العربية أونلاين في تركيا", "دروس قرآن في أنقرة", "باقات القرآن بالليرة التركية"], alternates: { canonical: turkeyLandingConfig.seo.canonical, languages: { ar: turkeyLandingConfig.seo.canonical, "x-default": turkeyLandingConfig.seo.canonical } }, openGraph: { title: turkeyLandingConfig.seo.title, description: turkeyLandingConfig.seo.description, url: turkeyLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: turkeyLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: turkeyLandingConfig.seo.title, description: turkeyLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="turkey" specializedPage={TurkeyLanding} />
}
