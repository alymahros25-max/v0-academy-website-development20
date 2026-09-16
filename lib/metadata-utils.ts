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
    default: 'أكاديمية الحافظ المتميز أون لاين | تحفيظ قرآن وتأسيس عربي',
    template: '%s | أكاديمية الحافظ المتميز',
  },
  description: 'أكاديمية لتحفيظ القرآن وتأسيس اللغة العربية أون لاين للناطقين بالعربية في الخليج وأوروبا وأمريكا.',
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
      title: 'تحفيظ قرآن أون لاين للأطفال والكبار | أكاديمية الحافظ المتميز',
      description: 'تحفيظ القرآن وحفظه ومراجعته وتعليم التلاوة والتجويد في حصص فردية مباشرة بالعربية للأطفال والكبار في الخليج وأوروبا وأمريكا، عبر Zoom أو Google Meet.',
      keywords: ['تحفيظ قرآن أون لاين', 'تحفيظ قرآن للأطفال', 'محفظ قرآن عن بعد', 'حفظ القرآن أون لاين', 'تعليم التجويد أون لاين', 'معلم قرآن باللغة العربية'],
      alternates: getAlternates(pageRoutes.quran),
      openGraph: pageOpenGraph('تحفيظ القرآن أونلاين بالعربية | أكاديمية الحافظ المتميز', 'دروس فردية مباشرة للحفظ والمراجعة والتلاوة والتجويد باللغة العربية.', pageRoutes.quran),
    },
    arabic: {
      title: 'تأسيس عربي للأطفال والكبار أون لاين | أكاديمية الحافظ المتميز',
      description: 'تأسيس عربي أون لاين في القراءة والكتابة والإملاء والفهم والتعبير للأطفال والشباب والبالغين الناطقين بالعربية في الخليج وأوروبا وأمريكا، بحصص فردية مباشرة.',
      keywords: ['تأسيس عربي للأطفال أون لاين', 'تأسيس اللغة العربية أون لاين', 'تعليم القراءة للأطفال', 'تعليم الكتابة والإملاء بالعربية', 'تقوية اللغة العربية', 'معلم لغة عربية أون لاين'],
      alternates: getAlternates(pageRoutes.arabic),
      openGraph: pageOpenGraph('تأسيس اللغة العربية أونلاين للأطفال والكبار | أكاديمية الحافظ المتميز', 'دروس عربية فردية مباشرة لتقوية القراءة والكتابة والإملاء والفهم والتعبير.', pageRoutes.arabic),
    },
    about: {
      title: 'من نحن | أكاديمية الحافظ المتميز',
      description: 'تعرف على أكاديمية الحافظ المتميز، أكاديمية متخصصة في تحفيظ القرآن وتأسيس اللغة العربية.',
      keywords: ['من نحن', 'عن الأكاديمية', 'رسالتنا', 'أهدافنا'],
      alternates: getAlternates(pageRoutes.about),
      openGraph: pageOpenGraph('من نحن', 'تعرف على أكاديمية الحافظ المتميز.', pageRoutes.about),
    },
    teachers: {
      title: 'معلمو القرآن واللغة العربية أونلاين | أكاديمية الحافظ المتميز',
      description: 'تعرّف على معلمي القرآن ومعلماتِه ومعلمي اللغة العربية، واختر المعلم المناسب للطالب مع حصة تجريبية مجانية وتقييمات وخبرات حقيقية.',
      keywords: ['معلم قرآن أونلاين', 'معلمة قرآن أونلاين', 'معلم لغة عربية أونلاين', 'معلمة لغة عربية أونلاين', 'معلم قرآن للأطفال', 'معلم تأسيس لغة عربية', 'مدرس قرآن باللغة العربية', 'مدرس لغة عربية أونلاين', 'معلم تحفيظ قرآن', 'معلم قراءة وكتابة عربية', 'اختيار معلم قرآن', 'حصة تجريبية مجانية قرآن', 'حصة تجريبية مجانية لغة عربية'],
      alternates: getAlternates(pageRoutes.teachers),
      openGraph: pageOpenGraph('معلمو القرآن واللغة العربية أونلاين | أكاديمية الحافظ المتميز', 'اختر المعلم أو المعلمة المناسبين لتعليم القرآن أو تأسيس اللغة العربية، وتعرّف على الخبرة والتخصص والتقييمات الحقيقية واحجز حصة تجريبية مجانية.', pageRoutes.teachers),
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
