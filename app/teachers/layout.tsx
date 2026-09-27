import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'معلمو القرآن واللغة العربية أونلاين | الحافظ المتميز',
  description: 'تعرّف على فريق التعليم وتخصصات المعلمين والمعلمات في القرآن والتجويد وتأسيس العربية، واختر الملف المناسب لاحتياج الطالب.',
  alternates: getSeoAlternates('https://quran-elhafez.com/teachers'),
}

export default function TeachersLayout({ children }: { children: React.ReactNode }) {
  return children
}
