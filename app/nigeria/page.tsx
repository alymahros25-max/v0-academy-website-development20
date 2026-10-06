import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { NigeriaLanding } from "@/components/country-landings/NigeriaLanding"
import { nigeriaLandingConfig } from "@/lib/nigeria-landing-config"
const canonical = nigeriaLandingConfig.seo.canonical
export const metadata: Metadata = { title: nigeriaLandingConfig.seo.title, description: nigeriaLandingConfig.seo.description, keywords: [...nigeriaLandingConfig.keywords], alternates: { canonical: nigeriaLandingConfig.seo.canonical, languages: { ar: nigeriaLandingConfig.seo.canonical, "x-default": nigeriaLandingConfig.seo.canonical } }, openGraph: { title: nigeriaLandingConfig.seo.title, description: nigeriaLandingConfig.seo.description, url: nigeriaLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: nigeriaLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: nigeriaLandingConfig.seo.title, description: nigeriaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="nigeria" specializedPage={NigeriaLanding} />
}
