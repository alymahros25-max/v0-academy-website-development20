import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { PolandLanding } from "@/components/country-landings/PolandLanding"
import { polandLandingConfig } from "@/lib/poland-landing-config"
const canonical = polandLandingConfig.seo.canonical
export const metadata: Metadata = { title: polandLandingConfig.seo.title, description: polandLandingConfig.seo.description, keywords: [...polandLandingConfig.keywords], alternates: { canonical: polandLandingConfig.seo.canonical, languages: { ar: polandLandingConfig.seo.canonical, "x-default": polandLandingConfig.seo.canonical } }, openGraph: { title: polandLandingConfig.seo.title, description: polandLandingConfig.seo.description, url: polandLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: polandLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: polandLandingConfig.seo.title, description: polandLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="poland" specializedPage={PolandLanding} />
}
