import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SenegalLanding } from "@/components/country-landings/SenegalLanding"
import { senegalLandingConfig } from "@/lib/senegal-landing-config"
const canonical = senegalLandingConfig.seo.canonical
export const metadata: Metadata = { title: senegalLandingConfig.seo.title, description: senegalLandingConfig.seo.description, keywords: [...senegalLandingConfig.keywords], alternates: { canonical: senegalLandingConfig.seo.canonical, languages: { ar: senegalLandingConfig.seo.canonical, "x-default": senegalLandingConfig.seo.canonical } }, openGraph: { title: senegalLandingConfig.seo.title, description: senegalLandingConfig.seo.description, url: senegalLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: senegalLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: senegalLandingConfig.seo.title, description: senegalLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="senegal" specializedPage={SenegalLanding} />
}
