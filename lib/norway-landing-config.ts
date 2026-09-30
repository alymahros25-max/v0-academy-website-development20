export const norwayLandingConfig = {
  slug: "norway",
  name: "النرويج",
  nameEn: "Norway",
  flag: "🇳🇴",
  currencyCode: "NOK",
  currencyLabel: "الكرونة النرويجية",
  currencySymbol: "kr",
  cities: ["أوسلو", "بيرغن", "تروندهايم", "ستافنجر"],
  timezone: "توقيت أوسلو (Europe/Oslo، UTC+01:00 / UTC+02:00 صيفًا)",
  seo: {
    title: "حلقات فردية لحفظ القرآن أونلاين في النرويج | بالعربية",
    description: "احجز حلقة فردية لحفظ القرآن أو مراجعته من النرويج باللغة العربية. لتنسيق الموعد، أرسل التوقيت المتاح لديك وهدفك الدراسي؛ وتعرض الصفحة الباقات بالكرونة النرويجية.",
    canonical: "https://quran-elhafez.com/norway",
  },
  keywords: ['حفظ القرآن أونلاين في النرويج', 'مراجعة القرآن بالعربية في أوسلو في النرويج', 'تلاوة القرآن وتجويده أونلاين في النرويج', 'حلقات تحفيظ القرآن الفردية في النرويج', 'تحفيظ القرآن للصغار والكبار في النرويج', 'تأسيس الحروف العربية والقراءة في بيرغن في النرويج'],
  theme: {
    primary: "#234B5A",
    accent: "#C5965A",
    background: "#F4F8F7",
    surface: "#C7D5D8",
    ink: "#234B5A",
    pine: "#58756B",
  },
  quranPrices: [142, 265, 398, 521],
  arabicPrices: [189, 341, 511, 682],
  whatsappMessage: "أرغب في معرفة باقات القرآن أو العربية في النرويج",
  localCard: {
    title: "NORGE · AL-HAFIZ ACADEMY",
    heading: "Quran på nett og grunnleggende arabisk i Norge",
    body: "Al-Hafiz Academy tilbyr individuelle nettleksjoner i koranmemorering og grunnleggende arabisk. Oslo, Bergen, Trondheim og Stavanger brukes som geografisk kontekst for siden. Koranstudium og arabiskundervisning for arabisktalende elever. Kontakt med akademiet foregår på arabisk.",
  },
  faq: [
    ["هل أستطيع الدراسة من أوسلو أو مدينة نرويجية أخرى؟", "نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. ذكر المدينة يوضح نطاق الصفحة ولا يعني وجود فرع محلي."],
    ["كيف أنظم وقت الحصة مع توقيت النرويج؟", "تستخدم الصفحة توقيت أوسلو، ويُنسق الموعد باللغة العربية وفق الوقت المتاح عند التواصل."],
    ["هل الأسعار بالكرونة النرويجية؟", "نعم، الأسعار الظاهرة في صفحة النرويج بالكرونة النرويجية للباقات الموضحة."],
    ["هل توجد باقات مخصصة؟", "يوجد باقات مخصصة."],
    ["بأي لغة يتم التواصل مع الأكاديمية؟", "يتم التواصل مع الأكاديمية باللغة العربية."],
  ] as const,
} as const

export function getNorwayWhatsAppUrl(message = norwayLandingConfig.whatsappMessage) {
  return `https://bit.ly/4aJfOl6?text=${encodeURIComponent(message)}`
}
