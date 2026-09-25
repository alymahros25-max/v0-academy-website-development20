export const switzerlandLandingConfig = {
  slug: "switzerland",
  name: "سويسرا",
  nameEn: "Switzerland",
  flag: "🇨🇭",
  currencyCode: "CHF",
  currencyLabel: "الفرنك السويسري",
  currencySymbol: "CHF",
  cities: ["زيورخ", "جنيف", "بازل", "برن"],
  timezone: "توقيت زيورخ (Europe/Zurich، UTC+01:00 / UTC+02:00 صيفًا)",
  seo: {
    title: "تحفيظ القرآن وتأسيس العربية أونلاين في سويسرا | أكاديمية الحافظ",
    description: "تعلم القرآن الكريم أو تأسيس اللغة العربية أونلاين من سويسرا بحصص فردية وباقات شهرية بالفرنك السويسري، مع تواصل باللغة العربية.",
    canonical: "https://quran-elhafez.com/switzerland",
  },
  theme: { primary: "#164A41", accent: "#D52B1E", background: "#FFF8EA", surface: "#E6F0EA", ink: "#17211F" },
  quranPrices: [12, 23, 34, 45],
  arabicPrices: [16, 29, 44, 59],
  whatsappMessage: "أرغب في معرفة باقات القرآن أو العربية في سويسرا",
  localCard: {
    title: "SCHWEIZ · AL-HAFIZ ACADEMY",
    heading: "Online-Koranunterricht und Arabisch-Grundlagen in der Schweiz",
    body: "Die Al-Hafiz Academy bietet Online-Unterricht zum Auswendiglernen des Korans und für Arabisch-Grundlagen für arabischsprachige Lernende in der Schweiz. Zürich, Genf, Basel und Bern sind geografische Bezugspunkte dieser Seite. Der Unterricht findet ausschließlich online statt; die Kommunikation mit der Akademie erfolgt auf Arabisch. Die Akademie hat keinen Standort, keine Filiale und keinen lokalen Unterrichtsort in der Schweiz.",
  },
  faq: [
    ["هل أستطيع الدراسة من زيورخ أو مدينة سويسرية أخرى؟", "نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. المدن المذكورة نطاق جغرافي للصفحة، ولا توجد بها مقرات أو فروع أو أماكن تدريس تابعة للأكاديمية."],
    ["كيف أنظم وقت الحصة مع توقيت سويسرا؟", "تستخدم الصفحة توقيت زيورخ، ويُنسق الموعد باللغة العربية وفق الوقت المتاح عند التواصل."],
    ["هل الأسعار بالفرنك السويسري؟", "نعم، الأسعار الظاهرة في صفحة سويسرا بالفرنك السويسري للباقات الموضحة."],
    ["هل توجد باقات مخصصة؟", "يوجد باقات مخصصة."],
    ["بأي لغة يتم التواصل مع الأكاديمية؟", "يتم التواصل مع الأكاديمية باللغة العربية."],
  ] as const,
} as const

export function getSwitzerlandWhatsAppUrl(message = switzerlandLandingConfig.whatsappMessage) {
  return `https://bit.ly/4aJfOl6?text=${encodeURIComponent(message)}`
}
