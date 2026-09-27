import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'آراء وتجارب الطلاب وأولياء الأمور | الحافظ المتميز',
  description: 'اقرأ آراء وتجارب الطلاب وأولياء الأمور المنشورة عن حصص القرآن وتأسيس العربية في أكاديمية الحافظ المتميز.',
  alternates: getSeoAlternates('https://quran-elhafez.com/reviews'),
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children
}
