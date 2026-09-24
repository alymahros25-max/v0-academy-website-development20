export const italyLandingConfig = {
  slug: "italy",
  name: "إيطاليا",
  nameEn: "Italy",
  flag: "🇮🇹",
  currencyCode: "EUR",
  currencyLabel: "euro",
  currencySymbol: "€",
  cities: ["روما", "ميلانو", "تورينو", "نابولي"],
  timezone: "توقيت روما (Europe/Rome)",
  seo: {
    title: "تحفيظ القرآن وتأسيس العربية أونلاين في إيطاليا | أكاديمية الحافظ",
    description: "تعلّم القرآن الكريم أو تأسيس اللغة العربية أونلاين من إيطاليا بحصص فردية وباقات شهرية باليورو. تعرّف إلى البرنامج المناسب وتواصل معنا باللغة العربية للحصة التجريبية.",
    canonical: "https://quran-elhafez.com/italy",
  },
  theme: {
    primary: "#7A3E35",
    accent: "#D3A13B",
    background: "#F7F0E6",
    surface: "#66704A",
    ink: "#20364A",
  },
  quranPrices: [13, 24, 36, 47],
  arabicPrices: [17, 31, 47, 62],
  localCard: {
    title: "ITALIA · AL-HAFIZ ACADEMY",
    heading: "Corano e basi dell'arabo online in Italia",
    body: "Al-Hafiz Academy offre lezioni online individuali per la memorizzazione del Corano e per le basi della lingua araba. Roma, Milano, Torino e Napoli fanno parte del contesto della pagina. Il contatto con l'accademia avviene in arabo. Memorizzazione del Corano e insegnamento dell'arabo per studenti arabofoni.",
  },
  faq: [
    ["هل أستطيع الدراسة من روما أو ميلانو أو تورينو أو نابولي؟", "نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. ذكر المدينة سياق الصفحة ولا يتضمن وجود فرع محلي."],
    ["كيف أختار عدد الحصص؟", "اختر الإيقاع الشهري الذي يناسب هدفك والوقت المتاح لك، ثم ناقش الباقة في رسالة التواصل أو بعد الحصة التجريبية."],
    ["هل الأسعار باليورو؟", "نعم، الأسعار المعروضة في صفحة إيطاليا باليورو للباقات الموضحة."],
    ["ما المنطقة الزمنية لإيطاليا؟", "تستخدم إيطاليا توقيت Europe/Rome، وتُنسق المواعيد باللغة العربية وفق الوقت المناسب عند التواصل."],
    ["هل توجد باقات مخصصة؟", "يوجد باقات مخصصة."],
    ["بأي لغة يتم التواصل مع الأكاديمية؟", "يتم التواصل مع الأكاديمية باللغة العربية."],
  ] as const,
} as const

export function getItalyWhatsAppUrl(message = "السلام عليكم، أرغب في الاستفسار عن باقات القرآن أو العربية في إيطاليا.") {
  return `https://bit.ly/4aJfOl6?text=${encodeURIComponent(message)}`
}
