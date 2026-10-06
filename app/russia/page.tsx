import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { RussiaLanding } from "@/components/country-landings/RussiaLanding"
import { russiaLandingConfig } from "@/lib/russia-landing-config"
const canonical = russiaLandingConfig.seo.canonical
export const metadata: Metadata = {
  title: russiaLandingConfig.seo.title,
  description: russiaLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين في روسيا", "تحفيظ القرآن في موسكو", "تحفيظ القرآن في سانت بطرسبرغ", "تعليم العربية أونلاين في روسيا", "دروس قرآن في قازان", "تعلم العربية في نوفوسيبيرسك", "باقات تحفيظ القرآن بالروبل"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: { title: russiaLandingConfig.seo.title, description: russiaLandingConfig.seo.description, url: canonical, locale: "ar_RU", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في روسيا" }] },
  twitter: { card: "summary_large_image", title: russiaLandingConfig.seo.title, description: russiaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="russia" specializedPage={RussiaLanding} />
}
