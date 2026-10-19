import type { AreaDisplayPlan } from "@/lib/country-content"
import { getNewCountryConfig } from "@/lib/new-country-pages"
import { argentinaLandingConfig as cfg_argentina } from "@/lib/argentina-landing-config"
import { australiaLandingConfig as cfg_australia } from "@/lib/australia-landing-config"
import { austriaLandingConfig as cfg_austria } from "@/lib/austria-landing-config"
import { brazilLandingConfig as cfg_brazil } from "@/lib/brazil-landing-config"
import { canadaLandingConfig as cfg_canada } from "@/lib/canada-landing-config"
import { chinaLandingConfig as cfg_china } from "@/lib/china-landing-config"
import { colombiaLandingConfig as cfg_colombia } from "@/lib/colombia-landing-config"
import { denmarkLandingConfig as cfg_denmark } from "@/lib/denmark-landing-config"
import { finlandLandingConfig as cfg_finland } from "@/lib/finland-landing-config"
import { germanyLandingConfig as cfg_germany } from "@/lib/germany-landing-config"
import { greeceLandingConfig as cfg_greece } from "@/lib/greece-landing-config"
import { indonesiaLandingConfig as cfg_indonesia } from "@/lib/indonesia-landing-config"
import { italyLandingConfig as cfg_italy } from "@/lib/italy-landing-config"
import { kuwaitLandingConfig as cfg_kuwait } from "@/lib/kuwait-landing-config"
import { malaysiaLandingConfig as cfg_malaysia } from "@/lib/malaysia-landing-config"
import { mexicoLandingConfig as cfg_mexico } from "@/lib/mexico-landing-config"
import { newZealandLandingConfig as cfg_new_zealand } from "@/lib/new-zealand-landing-config"
import { nigeriaLandingConfig as cfg_nigeria } from "@/lib/nigeria-landing-config"
import { norwayLandingConfig as cfg_norway } from "@/lib/norway-landing-config"
import { polandLandingConfig as cfg_poland } from "@/lib/poland-landing-config"
import { portugalLandingConfig as cfg_portugal } from "@/lib/portugal-landing-config"
import { russiaLandingConfig as cfg_russia } from "@/lib/russia-landing-config"
import { saudiLandingConfig as cfg_saudi } from "@/lib/saudi-landing-config"
import { senegalLandingConfig as cfg_senegal } from "@/lib/senegal-landing-config"
import { southAfricaLandingConfig as cfg_south_africa } from "@/lib/south-africa-landing-config"
import { switzerlandLandingConfig as cfg_switzerland } from "@/lib/switzerland-landing-config"
import { turkeyLandingConfig as cfg_turkey } from "@/lib/turkey-landing-config"
import { uaeLandingConfig as cfg_uae } from "@/lib/uae-landing-config"
import { unitedKingdomLandingConfig as cfg_united_kingdom } from "@/lib/united-kingdom-landing-config"
import { unitedStatesLandingConfig as cfg_united_states } from "@/lib/united-states-landing-config"
import { venezuelaLandingConfig as cfg_venezuela } from "@/lib/venezuela-landing-config"

type RawPlan = {
  id?: string | number
  program?: string
  duration?: number
  monthlySessions?: number
  sessions?: number
  weeklySessions?: number
  price: string | number
  name?: string
  description?: string
  features?: string[]
  popular?: boolean
  visible?: boolean
}

type RawCountryConfig = {
  name?: string
  currencyCode?: string
  currencySymbol?: string
  currencyLabel?: string
  currency?: string
  cities?: string[]
  timezone?: string
  quranPrices?: Array<number | string>
  arabicPrices?: Array<number | string>
  plans?: RawPlan[]
  quranPlans?: RawPlan[]
  arabicPlans?: RawPlan[]
  faq?: ReadonlyArray<readonly [string, string]>
}

const legacyConfigs = {
  "argentina": cfg_argentina,
  "australia": cfg_australia,
  "austria": cfg_austria,
  "brazil": cfg_brazil,
  "canada": cfg_canada,
  "china": cfg_china,
  "colombia": cfg_colombia,
  "denmark": cfg_denmark,
  "finland": cfg_finland,
  "germany": cfg_germany,
  "greece": cfg_greece,
  "indonesia": cfg_indonesia,
  "italy": cfg_italy,
  "kuwait": cfg_kuwait,
  "malaysia": cfg_malaysia,
  "mexico": cfg_mexico,
  "new-zealand": cfg_new_zealand,
  "nigeria": cfg_nigeria,
  "norway": cfg_norway,
  "poland": cfg_poland,
  "portugal": cfg_portugal,
  "russia": cfg_russia,
  "saudi-arabia": cfg_saudi,
  "senegal": cfg_senegal,
  "south-africa": cfg_south_africa,
  "switzerland": cfg_switzerland,
  "turkey": cfg_turkey,
  "united-arab-emirates": cfg_uae,
  "united-kingdom": cfg_united_kingdom,
  "united-states": cfg_united_states,
  "venezuela": cfg_venezuela,
} as unknown as Record<string, RawCountryConfig>

const currencyCodes: Record<string, string> = {
  qatar: "QAR", oman: "OMR", jordan: "JOD", bahrain: "BHD", france: "EUR", spain: "EUR",
  netherlands: "EUR", belgium: "EUR", sweden: "SEK", kuwait: "KWD", germany: "EUR", austria: "EUR",
  australia: "AUD", "saudi-arabia": "SAR", "united-arab-emirates": "AED", "united-states": "USD",
  canada: "CAD", "united-kingdom": "GBP", "south-africa": "ZAR", china: "CNY", italy: "EUR",
  russia: "RUB", norway: "NOK", switzerland: "CHF", brazil: "BRL", mexico: "MXN", colombia: "COP",
  venezuela: "VES", denmark: "DKK", greece: "EUR", "new-zealand": "NZD", finland: "EUR",
  turkey: "TRY", indonesia: "IDR", malaysia: "MYR", portugal: "EUR", poland: "PLN", argentina: "ARS",
  senegal: "XOF", nigeria: "NGN",
}

const defaultFaq = (country: string): Array<[string, string]> => [
  ["هل الحصص فردية أونلاين؟", `نعم، الحصص فردية ومباشرة عبر الإنترنت للطلاب في ${country}.`],
  ["ما البرامج المتاحة؟", "يتوفر تحفيظ القرآن ومراجعته، إلى جانب تأسيس القراءة والكتابة باللغة العربية."],
  ["كيف أختار الباقة المناسبة؟", "يمكن تحديد عدد الحصص والبرنامج بعد معرفة مستوى الطالب وهدفه التعليمي."],
  ["كيف أحجز حصة تجريبية؟", "تواصل معنا عبر WhatsApp لطلب الحصة التجريبية وتنسيق الموعد المناسب."],
]

function makePlan(slug: string, program: "quran" | "arabic", plan: RawPlan, index: number): AreaDisplayPlan {
  const sessions = Number(plan.monthlySessions ?? plan.sessions ?? (index + 1) * 4) || (index + 1) * 4
  return {
    id: String(plan.id ?? `${slug}-${program}-${sessions}`),
    program,
    duration: Number(plan.duration ?? 30),
    monthlySessions: sessions,
    weeklySessions: Number(plan.weeklySessions ?? Math.max(1, Math.round(sessions / 4))),
    price: Number(plan.price) || 0,
    name: plan.name || (program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"),
    description: plan.description || "حصة فردية أونلاين باللغة العربية.",
    features: Array.isArray(plan.features) ? plan.features.filter((x): x is string => typeof x === "string") : [],
    popular: Boolean(plan.popular),
  }
}

function fallbackPlans(slug: string, raw: RawCountryConfig): AreaDisplayPlan[] {
  if (raw.plans?.length) return raw.plans.filter((plan) => plan.visible !== false).map((plan, index) => makePlan(slug, plan.program === "arabic" ? "arabic" : "quran", plan, index))
  const plans: AreaDisplayPlan[] = []
  for (const [program, values] of [["quran", raw.quranPlans], ["arabic", raw.arabicPlans]] as const) {
    if (values?.length) plans.push(...values.map((plan, index) => makePlan(slug, program, plan, index)))
  }
  if (plans.length) return plans
  for (const program of ["quran", "arabic"] as const) {
    const prices = program === "quran" ? raw.quranPrices : raw.arabicPrices
    if (prices?.length) prices.forEach((price, index) => plans.push(makePlan(slug, program, { price, monthlySessions: (index + 1) * 4 }, index)))
  }
  return plans
}

export function getCountryStaticFallback(slug: string) {
  const raw = legacyConfigs[slug] ?? getNewCountryConfig(slug) as RawCountryConfig | undefined
  if (!raw) return { plans: [] as AreaDisplayPlan[], quranPlans: [] as AreaDisplayPlan[], arabicPlans: [] as AreaDisplayPlan[], faq: defaultFaq(slug), cities: [] as string[], timezoneLabel: "التوقيت المحلي", currencyCode: currencyCodes[slug] || "", currencyLabel: "العملة المحلية" }
  const country = raw.name || slug
  const plans = fallbackPlans(slug, raw)
  return {
    plans,
    quranPlans: plans.filter((plan) => plan.program === "quran"),
    arabicPlans: plans.filter((plan) => plan.program === "arabic"),
    faq: raw.faq?.length ? raw.faq.map(([question, answer]) => [question, answer] as [string, string]) : defaultFaq(country),
    cities: Array.isArray(raw.cities) ? raw.cities : [],
    timezoneLabel: raw.timezone || `التوقيت المحلي في ${country}`,
    currencyCode: (raw.currencyCode && /^[A-Z]{3}$/.test(raw.currencyCode) ? raw.currencyCode : currencyCodes[slug]) || "",
    currencyLabel: raw.currencyLabel || raw.currencySymbol || raw.currency || raw.currencyCode || "العملة المحلية",
  }
}
