import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SwitzerlandLanding } from "@/components/country-landings/SwitzerlandLanding"
import { switzerlandLandingConfig } from "@/lib/switzerland-landing-config"
const canonical = switzerlandLandingConfig.seo.canonical
export const metadata: Metadata = {
  title: switzerlandLandingConfig.seo.title,
  description: switzerlandLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين في سويسرا", "تحفيظ القرآن في زيورخ", "تحفيظ القرآن في جنيف", "تعليم العربية أونلاين في سويسرا", "دروس قرآن في بازل", "تعلم العربية في برن", "باقات تحفيظ القرآن بالفرنك السويسري"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: { title: switzerlandLandingConfig.seo.title, description: switzerlandLandingConfig.seo.description, url: canonical, locale: "ar_CH", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في سويسرا" }] },
  twitter: { card: "summary_large_image", title: switzerlandLandingConfig.seo.title, description: switzerlandLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="switzerland" specializedPage={SwitzerlandLanding} />
}
