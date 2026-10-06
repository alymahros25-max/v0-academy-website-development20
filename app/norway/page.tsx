import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { NorwayLanding } from "@/components/country-landings/NorwayLanding"
import { norwayLandingConfig } from "@/lib/norway-landing-config"
const canonical = norwayLandingConfig.seo.canonical
export const metadata: Metadata = {
  title: norwayLandingConfig.seo.title,
  description: norwayLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين في النرويج", "تحفيظ القرآن في أوسلو", "تحفيظ القرآن في بيرغن", "تعليم العربية أونلاين في النرويج", "دروس قرآن في تروندهايم", "تعلم العربية في ستافنجر", "باقات تحفيظ القرآن بالكرونة النرويجية"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: { title: norwayLandingConfig.seo.title, description: norwayLandingConfig.seo.description, url: canonical, locale: "ar_NO", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في النرويج" }] },
  twitter: { card: "summary_large_image", title: norwayLandingConfig.seo.title, description: norwayLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="norway" specializedPage={NorwayLanding} />
}
