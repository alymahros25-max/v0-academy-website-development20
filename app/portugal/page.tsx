import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { PortugalLanding } from "@/components/country-landings/PortugalLanding"
import { portugalLandingConfig } from "@/lib/portugal-landing-config"
const canonical = portugalLandingConfig.seo.canonical
export const metadata: Metadata = { title: portugalLandingConfig.seo.title, description: portugalLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في البرتغال", "تحفيظ القرآن في لشبونة", "تعليم العربية أونلاين في البرتغال", "دروس قرآن في بورتو", "باقات تحفيظ القرآن باليورو في البرتغال"], alternates: { canonical: portugalLandingConfig.seo.canonical, languages: { ar: portugalLandingConfig.seo.canonical, "x-default": portugalLandingConfig.seo.canonical } }, openGraph: { title: portugalLandingConfig.seo.title, description: portugalLandingConfig.seo.description, url: portugalLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: portugalLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: portugalLandingConfig.seo.title, description: portugalLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="portugal" specializedPage={PortugalLanding} />
}
