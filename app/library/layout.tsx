import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'مكتبة موارد تعليم القرآن واللغة العربية | الحافظ المتميز',
  description: 'استعرض المواد والملفات التعليمية المتاحة لمهارات القرآن واللغة العربية، مع معاينة الموارد المنشورة وروابطها.',
  alternates: getSeoAlternates('https://quran-elhafez.com/library'),
}

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children
}
