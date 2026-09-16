import { Metadata } from 'next'
import dynamic from "next/dynamic"
import { AcademyBanner } from "@/components/home/academy-banner"
import { HeroSection } from "@/components/home/hero-section"
import { DeferredLandingVideoStrip } from "@/components/home/deferred-landing-video-strip"
import { HomeContentSections } from "@/components/home/home-content-sections"
import { Suspense } from "react"
import { getPublicContent } from "@/lib/public-content-server"

// SSG with 1-hour revalidation (ISR)
export const revalidate = 3600

export const metadata: Metadata = {
  title: "أكاديمية الحافظ المتميز | تعليم القرآن وتأسيس العربية أونلاين",
  description: "أكاديمية متخصصة في تعليم القرآن وتأسيس اللغة العربية بحصص فردية مباشرة باللغة العربية للأطفال والكبار، مع حصة تجريبية مجانية والتواصل عبر WhatsApp.",
  keywords: "أكاديمية تعليم القرآن والعربية أونلاين، حصص فردية باللغة العربية، حصة تجريبية مجانية، تعليم القرآن وتأسيس اللغة العربية",
  openGraph: {
    title: "أكاديمية الحافظ المتميز | تعليم القرآن وتأسيس العربية أونلاين",
    description: "حصص فردية مباشرة باللغة العربية لتعليم القرآن وتأسيس اللغة العربية للأطفال والكبار، مع حصة تجريبية مجانية والتواصل عبر WhatsApp.",
    type: "website",
    locale: "ar_SA",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }],
  },
}

const CTASection = dynamic(
  () => import("@/components/home/cta-section").then((module) => ({ default: module.CTASection })),
  { ssr: true, loading: () => <div className="min-h-72 bg-muted" /> },
)

const homeContentKeys = [
  "hero_title",
  "hero_subtitle",
  "about_badge",
  "about_title",
  "about_description",
  "mission_title",
  "mission_description",
  "vision_title",
  "vision_description",
  "goals_title",
  "goals_description",
] as const

async function DynamicHeroContent() {
  const content = await getPublicContent([...homeContentKeys])
  return <HeroSection content={content} />
}

export default function HomePage() {
  return (
    <>
      <AcademyBanner />
      <Suspense fallback={<HeroSection />}>
        <DynamicHeroContent />
      </Suspense>
      <HomeContentSections />
      <DeferredLandingVideoStrip />
      <Suspense fallback={<div className="min-h-72 bg-muted" />}>
        <CTASection />
      </Suspense>
    </>
  )
}
