import { getAreaLandingData, toAreaDisplayPlan, type AreaDisplayPlan, type AreaLandingSnapshot } from "@/lib/country-content"
import { resolveCountrySeoPlan, type CompleteCountrySeoPage } from "@/lib/country-seo"
import { getCountryStaticFallback } from "@/lib/country-static-fallback"

export type CountryPageModel = {
  slug: string
  seo: CompleteCountrySeoPage | undefined
  areaData: AreaLandingSnapshot
  quranPlans: AreaDisplayPlan[]
  arabicPlans: AreaDisplayPlan[]
  faq: Array<[string, string]>
  cities: string[]
  timezoneLabel: string
  currencyCode: string
  currencyLabel: string
}

const friendlyTimezoneLabels: Readonly<Record<string, string>> = {
  "saudi-arabia": "التوقيت المحلي في السعودية",
  "united-arab-emirates": "التوقيت المحلي في الإمارات العربية المتحدة",
  "united-states": "التوقيت المحلي في مدينة الطالب داخل الولايات المتحدة",
  "united-kingdom": "التوقيت المحلي في المملكة المتحدة",
  canada: "التوقيت المحلي في مدينة الطالب داخل كندا",
  brazil: "التوقيت المحلي في برازيليا",
  china: "التوقيت المحلي في الصين",
  italy: "التوقيت المحلي في روما",
  "south-africa": "التوقيت المحلي في جنوب أفريقيا",
  argentina: "التوقيت المحلي في بوينس آيرس",
}

function normalizeFaq(slug: string, faq: Array<[string, string]>): Array<[string, string]> {
  return faq.map(([question, answer]) => {
    let normalizedAnswer = answer.replace(/يوجد باقات/gu, "توجد باقات")

    if (slug === "south-africa" && question === "هل الأسعار بالراند الجنوب أفريقي؟") {
      normalizedAnswer = normalizedAnswer
        .replace(/،?\s*وقد تحتاج إلى إعادة التحقق منها عند اعتماد الصفحة النهائي[.!؟]?/u, "")
        .trim()
      if (normalizedAnswer && !/[.!؟]$/u.test(normalizedAnswer)) normalizedAnswer += "."
    }

    return [question, normalizedAnswer] as [string, string]
  })
}

/**
 * Single data contract for country renderers.
 * The repository/fallback decision happens before a visual renderer runs.
 */
export async function getCountryPageModel(slug: string): Promise<CountryPageModel> {
  const areaData = await getAreaLandingData(slug)
  const fallback = getCountryStaticFallback(slug)
  const databasePlans = areaData.packages.map(toAreaDisplayPlan)
  const quranPlans = databasePlans.filter((plan) => plan.program === "quran")
  const arabicPlans = databasePlans.filter((plan) => plan.program === "arabic")
  const rawFaq = areaData.faq.length ? areaData.faq.map((item) => [item.question_ar, item.answer_ar] as [string, string]) : fallback.faq
  const faq = normalizeFaq(slug, rawFaq)
  const cities = areaData.cities.length ? areaData.cities.map((city) => city.name_ar) : fallback.cities
  const timezoneLabel = friendlyTimezoneLabels[slug]
    || areaData.timezones.find((timezone) => timezone.is_primary)?.label_ar
    || areaData.timezones[0]?.label_ar
    || fallback.timezoneLabel

  return {
    slug,
    seo: resolveCountrySeoPlan(slug, areaData.content),
    areaData,
    quranPlans: quranPlans.length ? quranPlans : fallback.quranPlans,
    arabicPlans: arabicPlans.length ? arabicPlans : fallback.arabicPlans,
    faq,
    cities,
    timezoneLabel,
    currencyCode: areaData.area?.currency_code || fallback.currencyCode,
    currencyLabel: areaData.area?.currency_symbol || fallback.currencyLabel,
  }
}
