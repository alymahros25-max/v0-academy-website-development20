import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ColombiaLanding } from "@/components/country-landings/ColombiaLanding"
import { colombiaLandingConfig } from "@/lib/colombia-landing-config"
const canonical = colombiaLandingConfig.seo.canonical
export const metadata: Metadata = { title: colombiaLandingConfig.seo.title, description: colombiaLandingConfig.seo.description, keywords: ["تحفيظ القرآن أونلاين في كولومبيا", "مراجعة القرآن بالعربية في بوغوتا", "تأسيس العربية للناطقين بالعربية في ميديلين", "دروس قرآن فردية في كولومبيا"], alternates: { canonical: colombiaLandingConfig.seo.canonical, languages: { ar: colombiaLandingConfig.seo.canonical, "x-default": colombiaLandingConfig.seo.canonical } }, openGraph: { title: colombiaLandingConfig.seo.title, description: colombiaLandingConfig.seo.description, url: colombiaLandingConfig.seo.canonical, type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: colombiaLandingConfig.seo.title }] }, twitter: { card: "summary_large_image", title: colombiaLandingConfig.seo.title, description: colombiaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] } }
export default function CountryRoute() {
  return <CountryLandingEngine slug="colombia" specializedPage={ColombiaLanding} />
}
