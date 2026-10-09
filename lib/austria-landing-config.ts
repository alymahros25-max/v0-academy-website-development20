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
    title: "تحفيظ القرآن بالعربية أونلاين في النمسا | حلقات فردية",
    description: "ابدأ حفظ القرآن أو مراجعته أونلاين من النمسا في حلقة فردية باللغة العربية. تعرض الصفحة الباقات باليورو، وتتيح السؤال عن المسار والمعلّم أو المعلّمة قبل ترتيب الحصة التجريبية.",
    canonical: "https://quran-elhafez.com/austria",
  },
  keywords: ['حفظ القرآن أونلاين في النمسا', 'مراجعة القرآن بالعربية في فيينا في النمسا', 'تلاوة القرآن وتجويده أونلاين في النمسا', 'حلقات تحفيظ القرآن الفردية في النمسا', 'تحفيظ القرآن للصغار والكبار في النمسا', 'تأسيس الحروف العربية والقراءة في غراتس في النمسا'],
  theme: { primary: "#4B3B67", accent: "#C49A45", background: "#FFF9F2", surface: "#F4DDE5", ink: "#2C2438" },
  quranPrices: [13, 24, 36, 48],
  arabicPrices: [17, 31, 47, 63],
  whatsappMessage: "أرغب في معرفة باقات القرآن أو العربية في النمسا",
  localCard: {
    title: "ÖSTERREICH · AL-HAFIZ ACADEMY",
    heading: "Online-Koranlernen und Arabisch-Grundlagen in Österreich",
    body: "Die Al-Hafiz Academy bietet Online-Unterricht zum Auswendiglernen des Korans und für Arabisch-Grundlagen für arabischsprachige Lernende in Österreich. Wien, Graz, Linz und Salzburg sind die geografischen Bezugspunkte dieser Seite. Der Unterricht findet ausschließlich online statt; die Kommunikation mit der Akademie erfolgt auf Arabisch. Die Akademie hat keinen Standort oder lokalen Unterrichtsort in Österreich.",
  },
  faq: [
    ["هل أستطيع الدراسة من فيينا أو مدينة نمساوية أخرى؟", "نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. المدن المذكورة نطاق جغرافي للصفحة، ولا توجد بها مقرات أو فروع أو أماكن تدريس تابعة للأكاديمية."],
    ["كيف أنظم وقت الحصة مع توقيت النمسا؟", "تستخدم الصفحة توقيت فيينا، ويُنسق الموعد باللغة العربية وفق الوقت المتاح عند التواصل."],
    ["هل الأسعار باليورو؟", "نعم، الأسعار الظاهرة في صفحة النمسا باليورو للباقات الموضحة."],
    ["هل توجد باقات مخصصة؟", "يوجد باقات مخصصة."],
    ["بأي لغة يتم التواصل مع الأكاديمية؟", "يتم التواصل مع الأكاديمية باللغة العربية."],
  ] as const,
} as const

export function getAustriaWhatsAppUrl(message = austriaLandingConfig.whatsappMessage) {
  return `https://wa.me/message/62LK42KU3LCCM1?text=${encodeURIComponent(message)}`
}
