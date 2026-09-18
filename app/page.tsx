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
  title: "تحفيظ قرآن وتأسيس عربي أون لاين للناطقين بالعربية",
  description: "تحفيظ قرآن أون لاين وتأسيس اللغة العربية للأطفال والكبار، بحصص فردية مباشرة باللغة العربية وحصة تجريبية مجانية.",
  keywords: "تحفيظ قرآن أون لاين، تحفيظ قرآن للأطفال، محفظ قرآن عن بعد، تأسيس عربي للأطفال أون لاين، تعليم القراءة والكتابة بالعربية، حصة تجريبية مجانية",
  openGraph: {
    title: "تحفيظ قرآن وتأسيس عربي أون لاين للناطقين بالعربية",
    description: "حصص فردية مباشرة لتحفيظ القرآن وتأسيس العربية للأطفال والكبار، مع حصة تجريبية مجانية.",
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
