export const brazilLandingConfig = {
  slug: "brazil",
  name: "البرازيل",
  nameEn: "Brazil",
  flag: "🇧🇷",
  currencyCode: "BRL",
  currencyLabel: "الريال البرازيلي",
  currencySymbol: "R$",
  cities: ["ساو باولو", "ريو دي جانيرو", "برازيليا", "سالڤادور"],
  timezone: "توقيت برازيليا (America/Sao_Paulo، UTC−03:00)",
  seo: { title: "تحفيظ القرآن وتأسيس العربية أونلاين في البرازيل | أكاديمية الحافظ", description: "تعلم القرآن الكريم أو تأسيس اللغة العربية أونلاين من البرازيل بحصص فردية وباقات شهرية بالريال البرازيلي، مع تواصل باللغة العربية.", canonical: "https://quran-elhafez.com/brazil" },
  theme: { primary: "#087F5B", accent: "#F6C945", secondary: "#1756A1", background: "#FFF9E8", ink: "#14251F" },
  quranPrices: [77, 144, 216, 284],
  arabicPrices: [103, 185, 278, 371],
  whatsappMessage: "أرغب في معرفة باقات القرآن أو العربية في البرازيل",
  localCard: { title: "BRASIL · AL-HAFIZ ACADEMY", heading: "Aulas online de memorização do Alcorão e fundamentos do árabe no Brasil", body: "A Al-Hafiz Academy oferece aulas individuais online de memorização do Alcorão e fundamentos da língua árabe para estudantes falantes de árabe no Brasil. São Paulo, Rio de Janeiro, Brasília e Salvador são referências geográficas desta página. As aulas acontecem exclusivamente online; o contato com a academia é feito em árabe. A academia não possui sede, filial ou local de ensino no Brasil." },
  faq: [
    ["هل أستطيع الدراسة من ساو باولو أو مدينة برازيلية أخرى؟", "نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. المدن المذكورة نطاق جغرافي للصفحة، ولا توجد بها مقرات أو فروع أو أماكن تدريس تابعة للأكاديمية."],
    ["كيف أنظم وقت الحصة مع توقيت البرازيل؟", "تستخدم الصفحة توقيت برازيليا، ويُنسق الموعد باللغة العربية وفق الوقت المتاح عند التواصل."],
    ["هل الأسعار بالريال البرازيلي؟", "نعم، الأسعار الظاهرة في صفحة البرازيل بالريال البرازيلي للباقات الموضحة."],
    ["هل توجد باقات مخصصة؟", "يوجد باقات مخصصة."],
    ["بأي لغة يتم التواصل مع الأكاديمية؟", "يتم التواصل مع الأكاديمية باللغة العربية."],
  ] as const,
} as const

export function getBrazilWhatsAppUrl(message = brazilLandingConfig.whatsappMessage) { return `https://bit.ly/4aJfOl6?text=${encodeURIComponent(message)}` }
