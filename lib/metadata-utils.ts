import { Metadata } from 'next'
import { getSeoAlternates } from './seo-metadata'

const baseUrl = 'https://quran-elhafez.com'
const socialImage = `${baseUrl}/images/og-default.webp`

function pageOpenGraph(title: string, description: string, route: string): NonNullable<Metadata['openGraph']> {
  return {
    title,
    description,
    type: 'website',
    images: [{ url: socialImage, width: 1200, height: 630, alt: 'أكاديمية الحافظ المتميز' }],
    url: `${baseUrl}${route}`,
  }
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'أكاديمية الحافظ المتميز اون لاين | تحفيظ قرآن وتأسيس عربي',
    template: '%s | أكاديمية الحافظ المتميز',
  },
  description: 'أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين مع معلمين مجازين',
  alternates: {
    canonical: `${baseUrl}/`,
  },
}

export function generatePageMetadata(page: 'quran' | 'arabic' | 'about' | 'teachers' | 'reviews' | 'games' | 'faq' | 'contact' | 'privacy' | 'terms' | 'checkout-success'): Metadata {
  const pageRoutes: Record<string, string> = {
    quran: '/quran',
    arabic: '/arabic',
    about: '/about',
    teachers: '/teachers',
    reviews: '/reviews',
    games: '/games',
    faq: '/faq',
    contact: '/contact',
    privacy: '/privacy',
    terms: '/terms',
    'checkout-success': '/checkout-success',
  }

  const getAlternates = (route: string) => getSeoAlternates(`${baseUrl}${route}`)

  const metadataMap: Record<string, Metadata> = {
    'checkout-success': {
      title: 'تم الدفع بنجاح | أكاديمية الحافظ المتميز',
      description: 'شكرًا لإتمام عملية الدفع.',
      alternates: { canonical: `${baseUrl}/checkout-success` },
      robots: { index: false, follow: false },
    },
    quran: {
      title: 'تحفيظ القرآن الكريم اون لاين | أكاديمية الحافظ المتميز',
      description: 'تحفيظ القرآن أونلاين للطلاب الناطقين بالعربية في الخليج والأردن وأوروبا وأمريكا وكندا، مع مواعيد مرنة.',
      keywords: ['تحفيظ القرآن للناطقين بالعربية في الخليج', 'تحفيظ قرآن أونلاين في الأردن', 'تحفيظ القرآن للعرب في أوروبا وأمريكا', 'معلم قرآن عربي أونلاين', 'Quran memorization classes for Arabic speakers abroad'],
      alternates: getAlternates(pageRoutes.quran),
      openGraph: pageOpenGraph('تحفيظ القرآن الكريم اون لاين', 'حصص تحفيظ قرآن أونلاين مع متابعة مناسبة للطالب.', pageRoutes.quran),
    },
    arabic: {
      title: 'تأسيس اللغة العربية للأطفال | أكاديمية الحافظ المتميز',
      description: 'تأسيس اللغة العربية أونلاين للطلاب الناطقين بالعربية في الخليج والأردن وأوروبا وأمريكا وكندا، مع قراءة وكتابة وقواعد ومواعيد مناسبة لفروق التوقيت.',
      keywords: ['تأسيس العربية للناطقين بالعربية في الخليج', 'دروس تأسيس عربي أونلاين في الأردن', 'تعليم العربية للأطفال العرب في أوروبا وأمريكا', 'معلم لغة عربية أونلاين', 'online Arabic classes for Arabic speakers abroad'],
      alternates: getAlternates(pageRoutes.arabic),
      openGraph: pageOpenGraph('تأسيس اللغة العربية للأطفال', 'برامج تأسيس اللغة العربية بطرق واضحة ومناسبة للمستوى.', pageRoutes.arabic),
    },
    about: {
      title: 'من نحن | أكاديمية الحافظ المتميز',
      description: 'تعرف على أكاديمية الحافظ المتميز، أكاديمية متخصصة في تحفيظ القرآن وتأسيس اللغة العربية.',
      keywords: ['من نحن', 'عن الأكاديمية', 'رسالتنا', 'أهدافنا'],
      alternates: getAlternates(pageRoutes.about),
      openGraph: pageOpenGraph('من نحن', 'تعرف على أكاديمية الحافظ المتميز.', pageRoutes.about),
    },
    teachers: {
      title: 'المعلمون والمعلمات | أكاديمية الحافظ المتميز',
      description: 'تعرف على طريقة اختيار البرنامج والتنسيق مع المعلم أو المعلمة المناسبين.',
      keywords: ['معلمين', 'مدرسين قرآن', 'معلمي عربي'],
      alternates: getAlternates(pageRoutes.teachers),
      openGraph: pageOpenGraph('المعلمون والمعلمات', 'تعرف على طريقة التعلم والمتابعة في الأكاديمية.', pageRoutes.teachers),
    },
    reviews: {
      title: 'آراء الطلاب | أكاديمية الحافظ المتميز',
      description: 'اقرأ آراء وتقييمات الطلاب وأولياء الأمور عن أكاديمية الحافظ المتميز.',
      keywords: ['آراء', 'تقييمات', 'شهادات', 'تقييمات الطلاب'],
      alternates: getAlternates(pageRoutes.reviews),
      openGraph: pageOpenGraph('آراء الطلاب', 'آراء وتقييمات الطلاب وأولياء الأمور.', pageRoutes.reviews),
    },
    games: {
      title: 'الألعاب والمسابقات | أكاديمية الحافظ المتميز',
      description: 'ألعاب تعليمية وممتعة لتعليم الأطفال القرآن والعربية بطريقة ترفيهية.',
      keywords: ['ألعاب', 'مسابقات', 'ألعاب تعليمية', 'ألعاب للأطفال'],
      alternates: getAlternates(pageRoutes.games),
      openGraph: pageOpenGraph('الألعاب والمسابقات', 'ألعاب تعليمية وممتعة.', pageRoutes.games),
    },
    faq: {
      title: 'الأسئلة الشائعة | أكاديمية الحافظ المتميز',
      description: 'الأسئلة الشائعة والإجابات عن خدمات أكاديمية الحافظ المتميز.',
      keywords: ['أسئلة', 'أسئلة شائعة', 'FAQ', 'مساعدة'],
      alternates: getAlternates(pageRoutes.faq),
      openGraph: pageOpenGraph('الأسئلة الشائعة', 'الأسئلة الشائعة والإجابات.', pageRoutes.faq),
    },
    contact: {
      title: 'اتصل بنا | أكاديمية الحافظ المتميز',
      description: 'تواصل معنا عبر الاتصال المباشر أو النموذج للاستفسار عن البرامج والحصص.',
      keywords: ['اتصل بنا', 'تواصل', 'استفسارات', 'دعم'],
      alternates: getAlternates(pageRoutes.contact),
      openGraph: pageOpenGraph('اتصل بنا', 'تواصل معنا لأي استفسارات.', pageRoutes.contact),
    },
    privacy: {
      title: 'سياسة الخصوصية | أكاديمية الحافظ المتميز',
      description: 'سياسة الخصوصية والبيانات الشخصية في أكاديمية الحافظ المتميز.',
      alternates: getAlternates(pageRoutes.privacy),
      robots: { index: true, follow: true },
    },
    terms: {
      title: 'الشروط والأحكام | أكاديمية الحافظ المتميز',
      description: 'الشروط والأحكام العامة والخدمات في أكاديمية الحافظ المتميز.',
      alternates: getAlternates(pageRoutes.terms),
      robots: { index: true, follow: true },
    },
  }

  return metadataMap[page]
}
