import type { Metadata } from "next"
import { CountryLandingEngine } from "@/components/country-landing-engine"
import { ItalyLanding } from "@/components/country-landings/ItalyLanding"
import { italyLandingConfig } from "@/lib/italy-landing-config"
const canonical = italyLandingConfig.seo.canonical
export const metadata: Metadata = {
  title: italyLandingConfig.seo.title,
  description: italyLandingConfig.seo.description,
  keywords: ["تحفيظ القرآن أونلاين في إيطاليا", "تحفيظ القرآن في روما أونلاين", "تحفيظ القرآن في ميلانو", "تعليم العربية أونلاين في إيطاليا", "دروس قرآن للأطفال في تورينو", "تعلم العربية في نابولي أونلاين", "باقات تحفيظ القرآن باليورو"],
  alternates: { canonical, languages: { ar: canonical, "x-default": canonical } },
  openGraph: { title: italyLandingConfig.seo.title, description: italyLandingConfig.seo.description, url: canonical, locale: "ar_IT", type: "website", images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز في إيطاليا" }] },
  twitter: { card: "summary_large_image", title: italyLandingConfig.seo.title, description: italyLandingConfig.seo.description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
}
export default function CountryRoute() {
  return <CountryLandingEngine slug="italy" specializedPage={ItalyLanding} />
}
