import { createClient } from "@supabase/supabase-js"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { newCountryConfigs, type NewCountryConfig } from "../lib/new-country-pages"
import { saudiLandingConfig } from "../lib/saudi-landing-config"
import { uaeLandingConfig } from "../lib/uae-landing-config"

/**
 * Central Preview migration.
 *
 * Safety rules:
 * - dry-run is the default; use --apply to write.
 * - refuses Vercel Production and any non-preview target.
 * - never reads the old database.
 * - only upserts rows owned by the source files in this repository.
 * - does not delete rows that are not explicitly owned by this manifest.
 *
 * Run after applying db/isolated/0001_clean_baseline.sql, 0002_admin_content.sql,
 * and 0003_admin_editors.sql to the new empty Preview database.
 */

type AnyRecord = Record<string, any>
type NormalizedCountry = {
  slug: string
  countryCode: string
  nameAr: string
  nameEn: string
  currencyCode: string
  currencySymbol: string
  timezoneName: string
  timezoneLabelAr: string
  timezoneLabelEn: string
  title: string
  description: string
  eyebrow: string
  localLead: string
  seoTitle: string
  seoDescription: string
  theme: { primary: string; secondary: string; accent: string; background: string; text: string }
  cities: string[]
  quranPrices: number[]
  arabicPrices: number[]
  faq: Array<[string, string]>
  whatsapp: string
}

const routeMeta: Record<string, { nameAr: string; nameEn: string; code: string; currency: string; symbol: string; timezone: string; timezoneLabel: string }> = {
  "saudi-arabia": { nameAr: "السعودية", nameEn: "Saudi Arabia", code: "SA", currency: "SAR", symbol: "ر.س", timezone: "Asia/Riyadh", timezoneLabel: "توقيت السعودية" },
  "united-arab-emirates": { nameAr: "الإمارات", nameEn: "United Arab Emirates", code: "AE", currency: "AED", symbol: "د.إ", timezone: "Asia/Dubai", timezoneLabel: "توقيت الإمارات" },
  "united-states": { nameAr: "الولايات المتحدة", nameEn: "United States", code: "US", currency: "USD", symbol: "$", timezone: "America/New_York", timezoneLabel: "توقيت الولايات المتحدة" },
  canada: { nameAr: "كندا", nameEn: "Canada", code: "CA", currency: "CAD", symbol: "CA$", timezone: "America/Toronto", timezoneLabel: "توقيت كندا" },
  "united-kingdom": { nameAr: "المملكة المتحدة", nameEn: "United Kingdom", code: "GB", currency: "GBP", symbol: "£", timezone: "Europe/London", timezoneLabel: "توقيت المملكة المتحدة" },
  australia: { nameAr: "أستراليا", nameEn: "Australia", code: "AU", currency: "AUD", symbol: "AU$", timezone: "Australia/Sydney", timezoneLabel: "توقيت أستراليا" },
  germany: { nameAr: "ألمانيا", nameEn: "Germany", code: "DE", currency: "EUR", symbol: "€", timezone: "Europe/Berlin", timezoneLabel: "توقيت ألمانيا" },
  austria: { nameAr: "النمسا", nameEn: "Austria", code: "AT", currency: "EUR", symbol: "€", timezone: "Europe/Vienna", timezoneLabel: "توقيت النمسا" },
  kuwait: { nameAr: "الكويت", nameEn: "Kuwait", code: "KW", currency: "KWD", symbol: "د.ك", timezone: "Asia/Kuwait", timezoneLabel: "توقيت الكويت" },
  qatar: { nameAr: "قطر", nameEn: "Qatar", code: "QA", currency: "QAR", symbol: "ر.ق", timezone: "Asia/Qatar", timezoneLabel: "توقيت قطر" },
  oman: { nameAr: "عُمان", nameEn: "Oman", code: "OM", currency: "OMR", symbol: "ر.ع", timezone: "Asia/Muscat", timezoneLabel: "توقيت عُمان" },
  jordan: { nameAr: "الأردن", nameEn: "Jordan", code: "JO", currency: "JOD", symbol: "د.أ", timezone: "Asia/Amman", timezoneLabel: "توقيت الأردن" },
  bahrain: { nameAr: "البحرين", nameEn: "Bahrain", code: "BH", currency: "BHD", symbol: "د.ب", timezone: "Asia/Bahrain", timezoneLabel: "توقيت البحرين" },
  france: { nameAr: "فرنسا", nameEn: "France", code: "FR", currency: "EUR", symbol: "€", timezone: "Europe/Paris", timezoneLabel: "توقيت فرنسا" },
  spain: { nameAr: "إسبانيا", nameEn: "Spain", code: "ES", currency: "EUR", symbol: "€", timezone: "Europe/Madrid", timezoneLabel: "توقيت إسبانيا" },
  netherlands: { nameAr: "هولندا", nameEn: "Netherlands", code: "NL", currency: "EUR", symbol: "€", timezone: "Europe/Amsterdam", timezoneLabel: "توقيت هولندا" },
  belgium: { nameAr: "بلجيكا", nameEn: "Belgium", code: "BE", currency: "EUR", symbol: "€", timezone: "Europe/Brussels", timezoneLabel: "توقيت بلجيكا" },
  sweden: { nameAr: "السويد", nameEn: "Sweden", code: "SE", currency: "SEK", symbol: "كرونة", timezone: "Europe/Stockholm", timezoneLabel: "توقيت السويد" },
  "south-africa": { nameAr: "جنوب أفريقيا", nameEn: "South Africa", code: "ZA", currency: "ZAR", symbol: "R", timezone: "Africa/Johannesburg", timezoneLabel: "توقيت جنوب أفريقيا" },
  china: { nameAr: "الصين", nameEn: "China", code: "CN", currency: "CNY", symbol: "¥", timezone: "Asia/Shanghai", timezoneLabel: "توقيت الصين" },
  italy: { nameAr: "إيطاليا", nameEn: "Italy", code: "IT", currency: "EUR", symbol: "€", timezone: "Europe/Rome", timezoneLabel: "توقيت إيطاليا" },
  russia: { nameAr: "روسيا", nameEn: "Russia", code: "RU", currency: "RUB", symbol: "₽", timezone: "Europe/Moscow", timezoneLabel: "توقيت روسيا" },
  norway: { nameAr: "النرويج", nameEn: "Norway", code: "NO", currency: "NOK", symbol: "kr", timezone: "Europe/Oslo", timezoneLabel: "توقيت النرويج" },
  switzerland: { nameAr: "سويسرا", nameEn: "Switzerland", code: "CH", currency: "CHF", symbol: "CHF", timezone: "Europe/Zurich", timezoneLabel: "توقيت سويسرا" },
  brazil: { nameAr: "البرازيل", nameEn: "Brazil", code: "BR", currency: "BRL", symbol: "R$", timezone: "America/Sao_Paulo", timezoneLabel: "توقيت البرازيل" },
  mexico: { nameAr: "المكسيك", nameEn: "Mexico", code: "MX", currency: "MXN", symbol: "MX$", timezone: "America/Mexico_City", timezoneLabel: "توقيت المكسيك" },
  colombia: { nameAr: "كولومبيا", nameEn: "Colombia", code: "CO", currency: "COP", symbol: "COL$", timezone: "America/Bogota", timezoneLabel: "توقيت كولومبيا" },
  venezuela: { nameAr: "فنزويلا", nameEn: "Venezuela", code: "VE", currency: "VES", symbol: "Bs.", timezone: "America/Caracas", timezoneLabel: "توقيت فنزويلا" },
  denmark: { nameAr: "الدنمارك", nameEn: "Denmark", code: "DK", currency: "DKK", symbol: "kr", timezone: "Europe/Copenhagen", timezoneLabel: "توقيت الدنمارك" },
  greece: { nameAr: "اليونان", nameEn: "Greece", code: "GR", currency: "EUR", symbol: "€", timezone: "Europe/Athens", timezoneLabel: "توقيت اليونان" },
  "new-zealand": { nameAr: "نيوزيلندا", nameEn: "New Zealand", code: "NZ", currency: "NZD", symbol: "NZ$", timezone: "Pacific/Auckland", timezoneLabel: "توقيت نيوزيلندا" },
  finland: { nameAr: "فنلندا", nameEn: "Finland", code: "FI", currency: "EUR", symbol: "€", timezone: "Europe/Helsinki", timezoneLabel: "توقيت فنلندا" },
  turkey: { nameAr: "تركيا", nameEn: "Turkey", code: "TR", currency: "TRY", symbol: "₺", timezone: "Europe/Istanbul", timezoneLabel: "توقيت تركيا" },
  indonesia: { nameAr: "إندونيسيا", nameEn: "Indonesia", code: "ID", currency: "IDR", symbol: "Rp", timezone: "Asia/Jakarta", timezoneLabel: "توقيت إندونيسيا" },
  malaysia: { nameAr: "ماليزيا", nameEn: "Malaysia", code: "MY", currency: "MYR", symbol: "RM", timezone: "Asia/Kuala_Lumpur", timezoneLabel: "توقيت ماليزيا" },
  portugal: { nameAr: "البرتغال", nameEn: "Portugal", code: "PT", currency: "EUR", symbol: "€", timezone: "Europe/Lisbon", timezoneLabel: "توقيت البرتغال" },
  poland: { nameAr: "بولندا", nameEn: "Poland", code: "PL", currency: "PLN", symbol: "zł", timezone: "Europe/Warsaw", timezoneLabel: "توقيت بولندا" },
  argentina: { nameAr: "الأرجنتين", nameEn: "Argentina", code: "AR", currency: "ARS", symbol: "AR$", timezone: "America/Argentina/Buenos_Aires", timezoneLabel: "توقيت الأرجنتين" },
  senegal: { nameAr: "السنغال", nameEn: "Senegal", code: "SN", currency: "XOF", symbol: "CFA", timezone: "Africa/Dakar", timezoneLabel: "توقيت السنغال" },
  nigeria: { nameAr: "نيجيريا", nameEn: "Nigeria", code: "NG", currency: "NGN", symbol: "₦", timezone: "Africa/Lagos", timezoneLabel: "توقيت نيجيريا" },
}

const countrySlugs = Object.keys(routeMeta)
const centralConfigs = new Map<string, AnyRecord>(newCountryConfigs.map((item) => [item.slug, item]))
const directConfigs: Record<string, AnyRecord> = { "saudi-arabia": saudiLandingConfig, "united-arab-emirates": uaeLandingConfig }

function firstObject(mod: AnyRecord): AnyRecord | null {
  return Object.values(mod).find((value) => value && typeof value === "object" && !Array.isArray(value) && ("seo" in value || "theme" in value || "plans" in value || "quranPrices" in value || "cities" in value)) as AnyRecord | undefined ?? null
}

async function loadCountrySource(slug: string): Promise<AnyRecord> {
  if (directConfigs[slug]) return directConfigs[slug]
  if (centralConfigs.has(slug)) return centralConfigs.get(slug)!
  const module = await import(`../lib/${slug}-landing-config.ts`)
  const config = firstObject(module)
  if (!config) throw new Error(`لا يوجد مصدر إعداد قابل للقراءة للدولة ${slug}`)
  return config
}

function prices(config: AnyRecord, program: "quran" | "arabic"): number[] {
  const direct = config[`${program}Prices`]
  if (Array.isArray(direct)) return direct.map(Number)
  const plans = Array.isArray(config.plans) ? config.plans.filter((item: AnyRecord) => item.program === program && item.visible !== false) : []
  return plans.map((item: AnyRecord) => Number(item.price))
}

function normalize(slug: string, config: AnyRecord): NormalizedCountry {
  const meta = routeMeta[slug]
  const seo = config.seo ?? {}
  const theme = config.theme ?? { primary: "#1A4D2E", accent: "#D4AF37", background: "#FFFFFF", surface: "#F4F8F3", ink: "#171717" }
  const faq = Array.isArray(config.faq) ? config.faq.map((item: any) => [String(item[0]), String(item[1])] as [string, string]) : []
  const cities = Array.isArray(config.cities) ? config.cities.map(String) : []
  const title = String(config.title ?? seo.title ?? `تحفيظ القرآن أونلاين في ${meta.nameAr}`)
  const description = String(config.description ?? seo.description ?? "")
  const quranPrices = prices(config, "quran")
  const arabicPrices = prices(config, "arabic")
  if (!cities.length || quranPrices.length !== 4 || arabicPrices.length !== 4) throw new Error(`بيانات ناقصة للدولة ${slug}: المدن=${cities.length}، أسعار القرآن=${quranPrices.length}، أسعار العربية=${arabicPrices.length}`)
  return {
    slug, countryCode: meta.code, nameAr: String(config.name ?? meta.nameAr), nameEn: String(config.nameEn ?? meta.nameEn), currencyCode: meta.currency, currencySymbol: meta.symbol,
    timezoneName: meta.timezone, timezoneLabelAr: String(config.timezone ?? meta.timezoneLabel), timezoneLabelEn: `${meta.nameEn} time`, title, description,
    eyebrow: String(config.eyebrow ?? ""), localLead: String(config.localLead ?? config.localCard?.body ?? description), seoTitle: String(config.seoTitle ?? seo.title ?? title), seoDescription: String(config.seoDescription ?? seo.description ?? description),
    theme: { primary: String(theme.primary), secondary: String(theme.surface ?? theme.secondary ?? theme.background), accent: String(theme.accent), background: String(theme.background), text: String(theme.ink ?? theme.text ?? "#171717") },
    cities, quranPrices, arabicPrices, faq, whatsapp: String(config.whatsappMessage ?? config.whatsappTemplate ?? "https://bit.ly/4aJfOl6"),
  }
}

async function loadJson<T>(file: string): Promise<T> { return JSON.parse(await readFile(path.join(process.cwd(), file), "utf8")) as T }

function areaRows(country: NormalizedCountry) {
  const content = [
    ["eyebrow", country.eyebrow, "intro"], ["page_title", country.title, "intro"], ["page_description", country.description, "intro"], ["seo_title", country.seoTitle, "seo"], ["seo_description", country.seoDescription, "seo"], ["local_lead", country.localLead, "local"], ["whatsapp_message", country.whatsapp, "contact"],
  ]
  const packages = (["quran", "arabic"] as const).flatMap((program) => (program === "quran" ? country.quranPrices : country.arabicPrices).map((price, index) => ({ program, package_key: `${program}-30-${[4, 8, 12, 16][index]}`, name_ar: `${program === "quran" ? "تحفيظ القرآن" : "تأسيس العربية"} — ${[4, 8, 12, 16][index]} حصص`, name_en: `${program === "quran" ? "Quran" : "Arabic"} — ${[4, 8, 12, 16][index]} sessions`, name_fr: null, description_ar: null, description_en: null, description_fr: null, price, currency_code: country.currencyCode, billing_period: "month", sessions_per_month: [4, 8, 12, 16][index], duration_minutes: 30, features_ar: ["حصة فردية", "متابعة مستمرة"], features_en: ["One-to-one lesson", "Continuous follow-up"], features_fr: [], is_popular: index === 1, is_active: true, sort_order: program === "quran" ? index : index + 4 })))
  return { area: { slug: country.slug, area_type: "country", country_code: country.countryCode, name_ar: country.nameAr, name_en: country.nameEn, name_fr: null, currency_code: country.currencyCode, currency_symbol: country.currencySymbol, is_active: true }, content: content.map(([key, value, section], sort_order) => ({ content_key: key, content_ar: value, content_en: null, content_fr: null, content_type: "text", section, href: null, is_active: true, sort_order })), packages, faq: country.faq.map(([question_ar, answer_ar], sort_order) => ({ question_key: `${country.slug}-${sort_order + 1}`, question_ar, question_en: null, question_fr: null, answer_ar, answer_en: null, answer_fr: null, is_active: true, sort_order })), links: [{ link_key: "whatsapp", label_ar: "واتساب", label_en: "WhatsApp", label_fr: null, href: "https://bit.ly/4aJfOl6", link_type: "external", is_external: true, is_active: true, sort_order: 0 }, { link_key: "country-page", label_ar: `صفحة ${country.nameAr}`, label_en: `${country.nameEn} page`, label_fr: null, href: `/${country.slug}`, link_type: "internal", is_external: false, is_active: true, sort_order: 1 }], theme: { theme_name_ar: `هوية صفحة ${country.nameAr}`, theme_name_en: `${country.nameEn} page identity`, primary_color: country.theme.primary, secondary_color: country.theme.secondary, accent_color: country.theme.accent, background_color: country.theme.background, text_color: country.theme.text, quran_fact_title_ar: null, quran_fact_body_ar: null, quran_fact_reference_ar: null, is_active: true, sort_order: 0 }, cities: country.cities.map((name_ar, sort_order) => ({ city_key: `${country.slug}-${sort_order + 1}`, name_ar, name_en: name_ar, region_name: null, is_active: true, sort_order })), timezones: [{ timezone_name: country.timezoneName, label_ar: country.timezoneLabelAr, label_en: country.timezoneLabelEn, is_primary: true, is_active: true, sort_order: 0 }] }
}

async function buildPayload() {
  const countries: NormalizedCountry[] = []
  for (const slug of countrySlugs) countries.push(normalize(slug, await loadCountrySource(slug)))
  const settings = await loadJson<AnyRecord>("data/settings.json")
  const packages = await loadJson<AnyRecord[]>("data/packages.json")
  const teachers = await loadJson<AnyRecord[]>("data/teachers.json")
  const reviews = await loadJson<AnyRecord[]>("data/reviews.json")
  const messages = await loadJson<AnyRecord[]>("data/messages.json")
  return { countries, settings, packages, teachers, reviews, messages }
}

async function main() {
  const apply = process.argv.includes("--apply")
  const payload = await buildPayload()
  console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", countries: payload.countries.length, countryPackages: payload.countries.length * 8, teachers: payload.teachers.length, reviews: payload.reviews.length, messages: payload.messages.length, games: "code-only" }, null, 2))
  if (!apply) { console.log("Dry-run فقط. استخدم --apply بعد مراجعة الناتج وعلى Preview فقط."); return }
  if (process.env.VERCEL_ENV !== "preview" || process.env.MIGRATION_TARGET !== "preview") throw new Error("مرفوض: يجب تشغيل الترحيل مع VERCEL_ENV=preview و MIGRATION_TARGET=preview")
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("متغيرات Supabase Preview غير موجودة")
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const fail = (label: string, error: any) => { if (error) throw new Error(`${label}: ${error.message}`) }
  const globalPackages = payload.packages.map((item, index) => ({ id: String(item.id ?? `package-${index + 1}`), type: item.type, name_ar: item.name_ar ?? item.name?.ar ?? "", name_en: item.name_en ?? item.name?.en ?? "", name_fr: item.name_fr ?? item.name?.fr ?? "", sessions: Number(item.sessions), price: Number(item.price), duration: Number(item.duration ?? 30), features_ar: item.features_ar ?? (item.features?.ar ?? []).join("، "), features_en: item.features_en ?? (item.features?.en ?? []).join(", "), features_fr: item.features_fr ?? (item.features?.fr ?? []).join(", "), popular: Boolean(item.popular), active: item.active !== false, sort_order: index }))
  const packagesResult = await db.from("packages").upsert(globalPackages, { onConflict: "id" }); fail("الباقات العامة", packagesResult.error)
  const siteSettings = Object.entries(payload.settings).flatMap(([setting_key, value]) => [{ setting_key, setting_value: typeof value === "string" ? value : JSON.stringify(value), value_type: typeof value === "string" ? "text" : "json", label: setting_key, category: "site" }])
  const settingsUpsert = await db.from("site_settings").upsert(siteSettings, { onConflict: "setting_key" }); fail("site_settings", settingsUpsert.error)
  const siteContent = ["siteName", "siteDescription", "heroTitle", "heroSubtitle", "aboutText"].filter((key) => payload.settings[key]).map((key) => ({ key, content_ar: payload.settings[key].ar ?? null, content_en: payload.settings[key].en ?? null, content_fr: payload.settings[key].fr ?? null, section: key === "aboutText" ? "about" : "home", type: "text", is_active: true }))
  const contentUpsert = await db.from("site_content").upsert(siteContent, { onConflict: "key" }); fail("site_content", contentUpsert.error)
  for (const country of payload.countries) {
    const areaResult = await db.from("site_areas").upsert(countryArea(country).area, { onConflict: "slug" }).select("id").single(); fail(`الدولة ${country.slug}`, areaResult.error)
    const areaId = areaResult.data.id
    const rows = areaRows(country)
    const write = async (table: string, rows: AnyRecord[]) => { const result = await db.from(table).upsert(rows.map((row) => ({ ...row, area_id: areaId })), { onConflict: table === "area_content" ? "area_id,content_key" : table === "area_packages" ? "area_id,package_key" : table === "area_faq_items" ? "area_id,question_key" : table === "area_links" ? "area_id,link_key" : table === "area_cities" ? "area_id,city_key" : table === "area_timezones" ? "area_id,timezone_name" : "area_id" }); fail(`${country.slug}/${table}`, result.error) }
    await write("area_content", rows.content); await write("area_packages", rows.packages); await write("area_faq_items", rows.faq); await write("area_links", rows.links); await write("area_cities", rows.cities); await write("area_timezones", rows.timezones); await write("area_themes", [rows.theme])
  }
  console.log("تم ترحيل المصدر المركزي للموقع وصفحات الدول إلى Preview فقط. لم تتم قراءة قاعدة قديمة ولم يتم تعديل Production.")
}

function countryArea(country: NormalizedCountry) { return areaRows(country) }
export { buildPayload, areaRows }
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1 })
}
