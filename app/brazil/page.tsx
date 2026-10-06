import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { BrazilLanding } from "@/components/country-landings/BrazilLanding"
import { brazilLandingConfig } from "@/lib/brazil-landing-config"
const canonical = brazilLandingConfig.seo.canonical
export const metadata: Metadata = {
  title: brazilLandingConfig.seo.title, description: brazilLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين في البرازيل", "تحفيظ القرآن في ساو باولو", "تحفيظ القرآن في ريو دي جانيرو", "تعليم العربية أونلاين في البرازيل", "دروس قرآن في برازيليا", "باقات تحفيظ القرآن بالريال البرازيلي"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: { title: brazilLandingConfig.seo.title, description: brazilLandingConfig.seo.description, url: canonical, locale: "ar_BR", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في البرازيل" }] },
  twitter: { card: "summary_large_image", title: brazilLandingConfig.seo.title, description: brazilLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="brazil" specializedPage={BrazilLanding} />
}
