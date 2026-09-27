import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'تواصل معنا واحجز حصة تجريبية مجانية | الحافظ المتميز',
  description: 'تواصل للاستفسار عن حصص القرآن وتأسيس العربية للناطقين بها. تُقدَّم الحصص بالعربية فقط، سواء كانت لغة الموقع عربية أو مترجمة.',
  alternates: getSeoAlternates('https://quran-elhafez.com/contact'),
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
