import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ChinaLanding } from "@/components/country-landings/ChinaLanding"
import { chinaLandingConfig } from "@/lib/china-landing-config"
const canonical = chinaLandingConfig.seo.canonical
export const metadata: Metadata = {
  title: chinaLandingConfig.seo.title,
  description: chinaLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين في الصين", "تعليم القرآن أونلاين في بكين", "تحفيظ القرآن في شنغهاي", "تعلم العربية أونلاين في الصين", "دروس قرآن للأطفال في غوانغجو", "معلم قرآن أونلاين في شِنْجِن", "تحفيظ القرآن بالعربية أونلاين"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: { title: chinaLandingConfig.seo.title, description: chinaLandingConfig.seo.description, url: canonical, locale: "ar_CN", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في الصين" }] },
  twitter: { card: "summary_large_image", title: chinaLandingConfig.seo.title, description: chinaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="china" specializedPage={ChinaLanding} />
}
