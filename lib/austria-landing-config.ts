export const austriaLandingConfig = {
  slug: "austria",
  name: "النمسا",
  nameEn: "Austria",
  flag: "🇦🇹",
  currencyCode: "EUR",
  currencyLabel: "اليورو",
  currencySymbol: "€",
  cities: ["فيينا", "غراتس", "لينتس", "سالزبورغ"],
  timezone: "توقيت فيينا (Europe/Vienna، UTC+01:00 / UTC+02:00 صيفًا)",
  seo: {
    title: "تحفيظ القرآن وتأسيس العربية أونلاين في النمسا | أكاديمية الحافظ",
    description: "تعلّم القرآن الكريم أو تأسيس اللغة العربية أونلاين من النمسا بحصص فردية وباقات شهرية واضحة باليورو. ابدأ بالحصة التجريبية وتواصل معنا باللغة العربية.",
    canonical: "https://quran-elhafez.com/austria",
  },
  theme: { primary: "#4B3B67", accent: "#C49A45", background: "#FFF9F2", surface: "#F4DDE5", ink: "#2C2438" },
  quranPrices: [13, 24, 36, 48],
  arabicPrices: [17, 31, 47, 63],
  whatsappMessage: "أرغب في معرفة باقات القرآن أو العربية في النمسا",
  localCard: {
    title: "ÖSTERREICH · AL-HAFIZ ACADEMY",
    heading: "Online-Koranlernen und Arabisch-Grundlagen in Österreich",
    body: "Die Al-Hafiz Academy bietet individuelle Online-Unterrichtsstunden zum Auswendiglernen des Korans und für Arabisch-Grundlagen. Wien, Graz, Linz und Salzburg bilden den geografischen Kontext dieser Seite. Koranlernen und Arabischunterricht für arabischsprachige Lernende. Die Kommunikation mit der Akademie erfolgt auf Arabisch.",
  },
  faq: [
    ["هل أستطيع الدراسة من فيينا أو مدينة نمساوية أخرى؟", "نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. ذكر المدينة يوضح نطاق الصفحة ولا يعني وجود فرع محلي."],
    ["كيف أنظم وقت الحصة مع توقيت النمسا؟", "تستخدم الصفحة توقيت فيينا، ويُنسق الموعد باللغة العربية وفق الوقت المتاح عند التواصل."],
    ["هل الأسعار باليورو؟", "نعم، الأسعار الظاهرة في صفحة النمسا باليورو للباقات الموضحة."],
    ["هل توجد باقات مخصصة؟", "يوجد باقات مخصصة."],
    ["بأي لغة يتم التواصل مع الأكاديمية؟", "يتم التواصل مع الأكاديمية باللغة العربية."],
  ] as const,
} as const

export function getAustriaWhatsAppUrl(message = austriaLandingConfig.whatsappMessage) {
  return `https://bit.ly/4aJfOl6?text=${encodeURIComponent(message)}`
}
