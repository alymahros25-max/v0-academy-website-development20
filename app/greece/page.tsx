import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { GreeceLanding } from "@/components/country-landings/GreeceLanding"
import { greeceLandingConfig } from "@/lib/greece-landing-config"
const canonical = greeceLandingConfig.seo.canonical
export const metadata: Metadata = { title: greeceLandingConfig.seo.title, description: greeceLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في اليونان", "تحفيظ القرآن في أثينا", "تعليم العربية أونلاين في اليونان", "دروس قرآن في سالونيك", "باقات القرآن باليورو"], alternates: { canonical: greeceLandingConfig.seo.canonical, languages: { ar: greeceLandingConfig.seo.canonical, "x-default": greeceLandingConfig.seo.canonical } }, openGraph: { title: greeceLandingConfig.seo.title, description: greeceLandingConfig.seo.description, url: greeceLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: greeceLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: greeceLandingConfig.seo.title, description: greeceLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="greece" specializedPage={GreeceLanding} />
}
