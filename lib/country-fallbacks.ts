import { getNewCountryConfig, type NewCountryConfig } from "@/lib/new-country-pages"
import type { AreaCity, AreaLink, AreaPackage, AreaTheme, AreaTimezone, SiteArea } from "@/lib/country-content"

type FallbackFaq = {
  id: number
  question_key: string
  question_ar: string
  question_en: string | null
  question_fr: string | null
  answer_ar: string
  answer_en: string | null
  answer_fr: string | null
  sort_order: number
}

export type CountryFallback = {
  area: SiteArea
  packages: AreaPackage[]
  faq: FallbackFaq[]
  content: Array<{ content_key: string; content_ar: string; content_en: string | null; content_fr: string | null; content_type: string; section: string | null; href: string | null; sort_order: number }>
  links: AreaLink[]
  theme: AreaTheme
  cities: AreaCity[]
  timezones: AreaTimezone[]
}

const countryCodes: Record<string, string> = {
  qatar: "QA",
  oman: "OM",
  jordan: "JO",
  bahrain: "BH",
  france: "FR",
  spain: "ES",
  netherlands: "NL",
  belgium: "BE",
  sweden: "SE",
  kuwait: "KW",
}

const timezoneNames: Record<string, string> = {
  qatar: "Asia/Qatar",
  oman: "Asia/Muscat",
  jordan: "Asia/Amman",
  bahrain: "Asia/Bahrain",
  france: "Europe/Paris",
  spain: "Europe/Madrid",
  netherlands: "Europe/Amsterdam",
  belgium: "Europe/Brussels",
  sweden: "Europe/Stockholm",
  kuwait: "Asia/Kuwait",
}

const englishNames: Record<string, string> = {
  qatar: "Qatar",
  oman: "Oman",
  jordan: "Jordan",
  bahrain: "Bahrain",
  france: "France",
  spain: "Spain",
  netherlands: "Netherlands",
  belgium: "Belgium",
  sweden: "Sweden",
  kuwait: "Kuwait",
}

const programNames = {
  quran: ["بداية منتظمة", "تقدم متوازن", "متابعة موسعة", "حضور متكرر"],
  arabic: ["بداية تأسيسية", "تدريب متوازن", "ممارسة منتظمة", "تأسيس متقدم"],
} as const

const quranDescriptions = [
  "خطوة أولى للحفاظ على انتظام التعلم",
  "تكرار يساعد على مواصلة الحفظ والمراجعة",
  "وقت تعليمي أكثر للحفظ والتسميع والمراجعة",
  "خيار مناسب لمن يريد انتظامًا أعلى في الأسبوع",
]

const arabicDescriptions = [
  "بداية منظمة لبناء المهارات الأساسية",
  "تكرار يساعد على تثبيت المهارات",
  "وقت إضافي للتدريب والتطبيق",
  "متابعة أكثر انتظامًا للمهارات العربية",
]

function fallbackPackages(config: NewCountryConfig, areaId: number): AreaPackage[] {
  return (["quran", "arabic"] as const).flatMap((program) => {
    const prices = program === "quran" ? config.quranPrices : config.arabicPrices
    const descriptions = program === "quran" ? quranDescriptions : arabicDescriptions
    return prices.map((price, index) => ({
      id: areaId * 100 + (program === "quran" ? 1 : 5) + index,
      program: program as "quran" | "arabic",
      package_key: `${program}-30-${[4, 8, 12, 16][index]}`,
      name_ar: programNames[program][index],
      name_en: `${program === "quran" ? "Quran" : "Arabic"} ${[4, 8, 12, 16][index]} sessions`,
      name_fr: null,
      description_ar: descriptions[index],
      description_en: null,
      description_fr: null,
      price,
      currency_code: config.currencyCode,
      sessions_per_month: [4, 8, 12, 16][index],
      features_ar: ["حصة فردية", "مدة الحصة 30 دقيقة", "متابعة مستمرة", "تقرير بعد كل حصة"],
      features_en: null,
      features_fr: null,
      is_popular: index === 1,
      sort_order: program === "quran" ? index : index + 4,
    }))
  })
}

function fallbackFaq(config: NewCountryConfig, areaId: number): FallbackFaq[] {
  return config.faq.map(([question, answer], index) => ({
    id: areaId * 100 + index + 1,
    question_key: `fallback-${config.slug}-${index + 1}`,
    question_ar: question,
    question_en: null,
    question_fr: null,
    answer_ar: answer,
    answer_en: null,
    answer_fr: null,
    sort_order: index,
  }))
}

function fallbackCities(config: NewCountryConfig, areaId: number): AreaCity[] {
  return config.cities.map((name_ar, index) => ({
    id: areaId * 100 + index + 1,
    city_key: `${config.slug}-${index + 1}`,
    name_ar,
    name_en: name_ar,
    region_name: null,
    sort_order: index,
  }))
}

function fallbackTheme(config: NewCountryConfig, areaId: number): AreaTheme {
  return {
    id: areaId,
    theme_name_ar: `هوية صفحة ${config.name}`,
    theme_name_en: `${config.name} country landing identity`,
    primary_color: config.theme.primary,
    secondary_color: config.theme.surface,
    accent_color: config.theme.accent,
    background_color: config.theme.background,
    text_color: config.theme.ink,
    quran_fact_title_ar: null,
    quran_fact_body_ar: null,
    quran_fact_reference_ar: null,
    sort_order: 0,
  }
}

function fallbackLinks(config: NewCountryConfig, areaId: number): AreaLink[] {
  return [
    {
      id: areaId * 10 + 1,
      link_key: "whatsapp",
      label_ar: "واتساب",
      label_en: "WhatsApp",
      label_fr: null,
      href: "https://bit.ly/4aJfOl6",
      link_type: "external",
      is_external: true,
      sort_order: 0,
    },
    {
      id: areaId * 10 + 2,
      link_key: "country-page",
      label_ar: `صفحة ${config.name}`,
      label_en: `${config.name} page`,
      label_fr: null,
      href: `/${config.slug}`,
      link_type: "internal",
      is_external: false,
      sort_order: 1,
    },
  ]
}

function fallbackTimezone(config: NewCountryConfig, areaId: number): AreaTimezone[] {
  return [{
    id: areaId,
    timezone_name: timezoneNames[config.slug],
    label_ar: config.timezone,
    label_en: englishNames[config.slug] + " time",
    is_primary: true,
    sort_order: 0,
  }]
}

function fallbackContent(config: NewCountryConfig) {
  return [
    { content_key: "eyebrow", content_ar: config.eyebrow, content_en: null, content_fr: null, content_type: "text", section: "intro", href: null, sort_order: 0 },
    { content_key: "page_title", content_ar: config.title, content_en: null, content_fr: null, content_type: "text", section: "intro", href: null, sort_order: 1 },
    { content_key: "page_description", content_ar: config.description, content_en: null, content_fr: null, content_type: "text", section: "intro", href: null, sort_order: 2 },
    { content_key: "local_lead", content_ar: config.localLead, content_en: null, content_fr: null, content_type: "text", section: "local", href: null, sort_order: 3 },
  ]
}

function makeFallback(config: NewCountryConfig, areaId: number): CountryFallback {
  const area: SiteArea = {
    id: areaId,
    slug: config.slug,
    area_type: "country",
    country_code: countryCodes[config.slug],
    name_ar: config.name,
    name_en: englishNames[config.slug],
    name_fr: null,
    currency_code: config.currencyCode,
    currency_symbol: config.currencyCode,
  }
  return {
    area,
    packages: fallbackPackages(config, areaId),
    faq: fallbackFaq(config, areaId),
    content: fallbackContent(config),
    links: fallbackLinks(config, areaId),
    theme: fallbackTheme(config, areaId),
    cities: fallbackCities(config, areaId),
    timezones: fallbackTimezone(config, areaId),
  }
}

const fallbackConfigs = [
  ["qatar", 9],
  ["oman", 10],
  ["jordan", 11],
  ["bahrain", 12],
  ["france", 13],
  ["spain", 14],
  ["netherlands", 15],
  ["belgium", 16],
  ["sweden", 17],
] as const

const newCountryFallbacks = Object.fromEntries(
  fallbackConfigs.map(([slug, areaId]) => [slug, makeFallback(getNewCountryConfig(slug)!, areaId)]),
) as Record<string, CountryFallback>

const kuwaitAreaId = 18
const kuwaitConfig = getNewCountryConfig("kuwait")!

export const countryFallbacks: Record<string, CountryFallback> = {
  ...newCountryFallbacks,
  kuwait: makeFallback(kuwaitConfig, kuwaitAreaId),
}

export function getCountryFallback(slug: string): CountryFallback | null {
  return countryFallbacks[slug] ?? null
}

export const countryFallbackSlugs = Object.keys(countryFallbacks)
