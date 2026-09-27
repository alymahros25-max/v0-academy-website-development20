import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'تواصل معنا واحجز حصة تجريبية مجانية | الحافظ المتميز',
  description: 'تواصل مع أكاديمية الحافظ المتميز للاستفسار عن برنامج القرآن أو تأسيس العربية، وأرسل عمر الطالب ومستواه وموعدك المناسب عبر WhatsApp.',
  alternates: getSeoAlternates('https://quran-elhafez.com/contact'),
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
