import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ArgentinaLanding } from "@/components/country-landings/ArgentinaLanding"
import { argentinaLandingConfig } from "@/lib/argentina-landing-config"
const canonical = argentinaLandingConfig.seo.canonical
export const metadata: Metadata = { title: argentinaLandingConfig.seo.title, description: argentinaLandingConfig.seo.description, keywords: [...argentinaLandingConfig.keywords], alternates: { canonical: argentinaLandingConfig.seo.canonical, languages: { ar: argentinaLandingConfig.seo.canonical, "x-default": argentinaLandingConfig.seo.canonical } }, openGraph: { title: argentinaLandingConfig.seo.title, description: argentinaLandingConfig.seo.description, url: argentinaLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: argentinaLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: argentinaLandingConfig.seo.title, description: argentinaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="argentina" specializedPage={ArgentinaLanding} />
}
