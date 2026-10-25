"use client"

type AnalyticsEventParams = Record<string, string | number | boolean | undefined>
type AnalyticsEventName =
  | "generate_lead"
  | "form_start"
  | "whatsapp_click"
  | "whatsapp_chat_start"
  | "select_content"
  | "book_trial_click"
  | "email_click"
  | "telegram_click"
  | "site_search"
  | "view_program_page"
  | "view_pricing_page"
  | "view_country_page"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export const ANALYTICS_COUNTRIES: Record<string, string> = {
  "saudi-arabia": "السعودية",
  "united-arab-emirates": "الإمارات العربية المتحدة",
  "united-states": "الولايات المتحدة",
  canada: "كندا",
  "united-kingdom": "المملكة المتحدة",
  australia: "أستراليا",
  germany: "ألمانيا",
  kuwait: "الكويت",
  qatar: "قطر",
  oman: "عُمان",
  jordan: "الأردن",
  bahrain: "البحرين",
  france: "فرنسا",
  spain: "إسبانيا",
  netherlands: "هولندا",
  belgium: "بلجيكا",
  sweden: "السويد",
  "south-africa": "جنوب أفريقيا",
  china: "الصين",
  italy: "إيطاليا",
  russia: "روسيا",
  norway: "النرويج",
  austria: "النمسا",
  switzerland: "سويسرا",
  brazil: "البرازيل",
  mexico: "المكسيك",
  colombia: "كولومبيا",
  venezuela: "فنزويلا",
  denmark: "الدنمارك",
  greece: "اليونان",
  "new-zealand": "نيوزيلندا",
  finland: "فنلندا",
  turkey: "تركيا",
  indonesia: "إندونيسيا",
  malaysia: "ماليزيا",
  portugal: "البرتغال",
  poland: "بولندا",
  argentina: "الأرجنتين",
  senegal: "السنغال",
  nigeria: "نيجيريا",
}

export function getAnalyticsCountry(pathname: string) {
  const slug = pathname.split("/").filter(Boolean)[0] ?? ""
  return ANALYTICS_COUNTRIES[slug]
}

export function createCountryWhatsAppMessage(country: string, program?: "quran" | "arabic" | "inquiry") {
  const interest = program === "quran"
    ? "أرغب في معرفة تفاصيل برنامج تحفيظ القرآن الكريم"
    : program === "arabic"
      ? "أرغب في معرفة تفاصيل برنامج تأسيس اللغة العربية"
      : "أرغب في معرفة تفاصيل برامج الأكاديمية"

  return `السلام عليكم، ${interest}.\nوصلت إليكم من صفحة ${country}.\n\nاسم الطالب:\nالعمر:`
}

export function trackGa4Event(name: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("event", name, params)
}
