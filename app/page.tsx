import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { AcademyBanner } from "@/components/home/academy-banner"
import { HeroSection } from "@/components/home/hero-section"
import { DeferredLandingVideoStrip } from "@/components/home/deferred-landing-video-strip"
import { localizedContent } from "@/lib/public-content"
import { getHomepageContent } from "@/lib/homepage-content-server"

export const revalidate = 3600

const homepageKeywords = [
  "تحفيظ القرآن أونلاين",
  "تعليم التجويد أونلاين",
  "تأسيس اللغة العربية أونلاين",
  "تحفيظ القرآن للأطفال والكبار",
  "حصص قرآن فردية باللغة العربية",
]

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent()
  const title = localizedContent(content.homepage_seo_title, "ar", "تحفيظ القرآن وتأسيس العربية أونلاين | الحافظ المتميز")
  const description = localizedContent(
    content.homepage_seo_description,
    "ar",
    "تحفيظ القرآن وتعليم التجويد وتأسيس القراءة والكتابة العربية أونلاين بحصص فردية للأطفال والكبار والناطقين بالعربية، مع حصة تجريبية مجانية ومواعيد مرنة.",
  )
  return {
    title,
    description,
    keywords: homepageKeywords,
    alternates: { canonical: "https://quran-elhafez.com/" },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ar_SA",
      url: "https://quran-elhafez.com/",
      siteName: "أكاديمية الحافظ المتميز",
      images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز لتحفيظ القرآن وتأسيس اللغة العربية" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["https://quran-elhafez.com/images/og-default.webp"] },
  }
}

const CTASection = dynamic(
  () => import("@/components/home/cta-section").then((module) => ({ default: module.CTASection })),
  { ssr: true, loading: () => <div aria-hidden="true" className="min-h-72 bg-muted" /> },
)

const HomeContentSections = dynamic(
  () => import("@/components/home/home-content-sections").then((module) => ({ default: module.HomeContentSections })),
  { ssr: true, loading: () => <div aria-hidden="true" className="min-h-[1000px] bg-background" /> },
)

export default async function HomePage() {
  const content = await getHomepageContent()
  return (
    <>
      <AcademyBanner />
      <HeroSection content={content} />
      <HomeContentSections />
      <DeferredLandingVideoStrip />
      <CTASection />
    </>
  )
}
