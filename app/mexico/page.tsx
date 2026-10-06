import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { MexicoLanding } from "@/components/country-landings/MexicoLanding"
import { mexicoLandingConfig } from "@/lib/mexico-landing-config"
const canonical = mexicoLandingConfig.seo.canonical
export const metadata: Metadata = {
  title: mexicoLandingConfig.seo.title, description: mexicoLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين في المكسيك", "تحفيظ القرآن في مدينة مكسيكو", "تحفيظ القرآن في غوادالاخارا", "تعليم العربية أونلاين في المكسيك", "دروس قرآن في مونتيري", "باقات تحفيظ القرآن بالبيزو المكسيكي"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: { title: mexicoLandingConfig.seo.title, description: mexicoLandingConfig.seo.description, url: canonical, locale: "ar_MX", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في المكسيك" }] },
  twitter: { card: "summary_large_image", title: mexicoLandingConfig.seo.title, description: mexicoLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="mexico" specializedPage={MexicoLanding} />
}
