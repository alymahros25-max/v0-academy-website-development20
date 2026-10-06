import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { SouthAfricaLanding } from "@/components/country-landings/SouthAfricaLanding"
import { southAfricaLandingConfig } from "@/lib/south-africa-landing-config"
const canonical = southAfricaLandingConfig.seo.canonical
export const metadata: Metadata = {
  title: southAfricaLandingConfig.seo.title,
  description: southAfricaLandingConfig.seo.description,
  keywords: ["Koran klasse aanlyn in Suid-Afrika", "Koran memorisering Johannesburg", "Arabiese lesse aanlyn", "Al-Hafiz Akademie Suid-Afrika", "online Quran classes South Africa"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: {
    title: southAfricaLandingConfig.seo.title,
    description: southAfricaLandingConfig.seo.description,
    url: canonical,
    locale: "ar_ZA",
    type: "website",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في جنوب أفريقيا" }],
  },
  twitter: { card: "summary_large_image", title: southAfricaLandingConfig.seo.title, description: southAfricaLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="south-africa" specializedPage={SouthAfricaLanding} />
}
