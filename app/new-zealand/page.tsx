import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { NewZealandLanding } from "@/components/country-landings/NewZealandLanding"
import { newZealandLandingConfig } from "@/lib/new-zealand-landing-config"
const canonical = newZealandLandingConfig.seo.canonical
export const metadata: Metadata = { title: newZealandLandingConfig.seo.title, description: newZealandLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في نيوزيلندا", "تحفيظ القرآن في أوكلاند", "تعليم العربية أونلاين في نيوزيلندا", "دروس قرآن في ويلينغتون", "باقات القرآن بالدولار النيوزيلندي"], alternates: { canonical: newZealandLandingConfig.seo.canonical, languages: { ar: newZealandLandingConfig.seo.canonical, "x-default": newZealandLandingConfig.seo.canonical } }, openGraph: { title: newZealandLandingConfig.seo.title, description: newZealandLandingConfig.seo.description, url: newZealandLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: newZealandLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: newZealandLandingConfig.seo.title, description: newZealandLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="new-zealand" specializedPage={NewZealandLanding} />
}
