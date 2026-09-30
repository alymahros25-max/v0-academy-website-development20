import { Metadata } from "next"
import { getSeoAlternates } from "@/lib/seo-metadata"

export const metadata: Metadata = {
  title: "ألعاب تعليمية تفاعلية للقرآن والعربية للأطفال | الحافظ المتميز",
  description: "استكشف ألعابًا وأنشطة تفاعلية في الحروف العربية والقرآن والتجويد والسيرة، تساعد على المراجعة والتدرب بطريقة مشوقة.",
  alternates: getSeoAlternates('https://quran-elhafez.com/games'),
  keywords: ["ألعاب تعليمية", "قرآن", "تجويد", "حروف عربية", "تعليم الأطفال", "ألعاب إسلامية"],
  openGraph: {
    title: "ألعاب تعليمية تفاعلية للقرآن والعربية للأطفال",
    description: "ألعاب وأنشطة تفاعلية في الحروف العربية والقرآن والتجويد والسيرة.",
    type: "website",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }],
  },
}

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return children
}
