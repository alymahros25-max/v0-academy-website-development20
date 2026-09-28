export const mexicoLandingConfig = {
  slug: "mexico",
  name: "المكسيك",
  nameEn: "Mexico",
  flag: "🇲🇽",
  currencyCode: "MXN",
  currencyLabel: "البيزو المكسيكي",
  currencySymbol: "MX$",
  cities: ["مدينة مكسيكو", "غوادالاخارا", "مونتيري", "بويبلا"],
  timezone: "توقيت وسط المكسيك (America/Mexico_City، UTC−06:00)",
  seo: { title: "تحفيظ القرآن وتأسيس العربية أونلاين في المكسيك | أكاديمية الحافظ", description: "تعلم القرآن الكريم أو تأسيس اللغة العربية أونلاين من المكسيك بحصص فردية وباقات شهرية بالبيزو المكسيكي، مع تواصل باللغة العربية.", canonical: "https://quran-elhafez.com/mexico" },
  theme: { primary: "#C2185B", accent: "#F08A24", secondary: "#243B80", background: "#FFF7ED", ink: "#241A2A" },
  quranPrices: [265, 494, 742, 971],
  arabicPrices: [353, 636, 954, 1272],
  whatsappMessage: "أرغب في معرفة باقات القرآن أو العربية في المكسيك",
  localCard: { title: "MÉXICO · AL-HAFIZ ACADEMY", heading: "Memorización del Corán y fundamentos del árabe en línea en México", body: "Al-Hafiz Academy ofrece clases individuales en línea para la memorización del Corán y los fundamentos de la lengua árabe para estudiantes que hablan árabe en México. Ciudad de México, Guadalajara, Monterrey y Puebla son referencias geográficas de esta página. Las clases son exclusivamente en línea; la comunicación con la academia se realiza en árabe. La academia no tiene sede, sucursal ni lugar de enseñanza en México." },
  faq: [
    ["هل يمكنني الدراسة من مدينة مكسيكية مختلفة؟", "نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. المدن المذكورة سياق جغرافي للصفحة فقط، ولا توجد بها مقرات أو فروع أو أماكن تدريس تابعة للأكاديمية."],
    ["ما التوقيت المستخدم في الصفحة؟", "تستخدم الصفحة توقيت وسط المكسيك، ويُنسق الموعد باللغة العربية وفق الوقت المتاح عند التواصل."],
    ["هل الأسعار بالبيزو المكسيكي؟", "نعم، الأسعار الظاهرة في صفحة المكسيك بالبيزو المكسيكي للباقات الموضحة."],
    ["هل توجد باقات مخصصة؟", "يوجد باقات مخصصة."],
    ["بأي لغة يتم التواصل مع الأكاديمية؟", "يتم التواصل مع الأكاديمية باللغة العربية."],
  ] as const,
} as const

export function getMexicoWhatsAppUrl(message = mexicoLandingConfig.whatsappMessage) { return `https://bit.ly/4aJfOl6?text=${encodeURIComponent(message)}` }
