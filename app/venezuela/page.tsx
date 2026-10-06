import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { VenezuelaLanding } from "@/components/country-landings/VenezuelaLanding"
import { venezuelaLandingConfig } from "@/lib/venezuela-landing-config"
const canonical = venezuelaLandingConfig.seo.canonical
export const metadata: Metadata = { title: venezuelaLandingConfig.seo.title, description: venezuelaLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في فنزويلا", "تحفيظ القرآن في كاراكاس", "تعليم العربية أونلاين في فنزويلا", "دروس قرآن في ماراكايبو", "باقات القرآن بالبوليفار الفنزويلي"], alternates: { canonical: venezuelaLandingConfig.seo.canonical, languages: { ar: venezuelaLandingConfig.seo.canonical, "x-default": venezuelaLandingConfig.seo.canonical } }, openGraph: { title: venezuelaLandingConfig.seo.title, description: venezuelaLandingConfig.seo.description, url: venezuelaLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: venezuelaLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: venezuelaLandingConfig.seo.title, description: venezuelaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="venezuela" specializedPage={VenezuelaLanding} />
}
