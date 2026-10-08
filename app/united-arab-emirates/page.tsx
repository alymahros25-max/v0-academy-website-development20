import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { UaeLanding } from "@/components/country-landings/UaeLanding"
import { getCountrySeoAlternates } from "@/lib/seo-metadata"
import { getLandingPageConfig } from "@/lib/landing-page-config.server"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const config = await getLandingPageConfig("uae")
  const alternates = getCountrySeoAlternates("unitedArabEmirates")
  return {
    title: config.seo.title,
    description: config.seo.description,
    alternates: { ...alternates, canonical: config.seo.canonical, languages: { ar: config.seo.canonical, "x-default": config.seo.canonical } },
    robots: { index: true, follow: true },
    openGraph: { title: config.seo.title, description: config.seo.description, url: config.seo.canonical, locale: "ar_AE", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }] },
    twitter: { card: "summary_large_image", title: config.seo.title, description: config.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
  }
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="united-arab-emirates" specializedPage={UaeLanding} />
}
