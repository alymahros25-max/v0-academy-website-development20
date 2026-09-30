import { Metadata } from 'next'
import AboutPageClient from './client'
import { getPublicContent } from '@/lib/public-content-server'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const revalidate = 3600

export const metadata: Metadata = {
  title: "من نحن | أكاديمية الحافظ المتميز أونلاين",
  description: "تعرّف على أكاديمية الحافظ المتميز وبرامجها الفردية أونلاين لتحفيظ القرآن وتأسيس اللغة العربية للناطقين بها.",
  keywords: "أكاديمية الحافظ المتميز أونلاين، نبذة عن أكاديمية الحافظ المتميز، أكاديمية لتعليم القرآن واللغة العربية عبر الإنترنت",
  alternates: getSeoAlternates('https://quran-elhafez.com/about'),
  openGraph: {
    title: "من نحن | أكاديمية الحافظ المتميز أونلاين",
    description: "تعرّف على الأكاديمية وبرامجها الفردية أونلاين لتحفيظ القرآن وتأسيس اللغة العربية.",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }],
  },
}

export default async function AboutPage() {
  const content = await getPublicContent([
    'about_badge',
    'about_title',
    'about_description',
    'mission_title',
    'mission_description',
    'vision_title',
    'vision_description',
  ])

  return <AboutPageClient content={content} />
}
