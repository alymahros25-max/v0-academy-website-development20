import { getAreaLandingData, toAreaDisplayPlan, type AreaDisplayPlan, type AreaLandingSnapshot } from "@/lib/country-content"
import { getCountrySeoPlan, type CompleteCountrySeoPage } from "@/lib/country-seo"

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
}

/**
 * Single data contract for country renderers.
 * The repository/fallback decision happens before a visual renderer runs.
 */
export async function getCountryPageModel(slug: string): Promise<CountryPageModel> {
  const areaData = await getAreaLandingData(slug)
  const quranPlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === "quran")
  const arabicPlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === "arabic")
  const faq = areaData.faq.map((item) => [item.question_ar, item.answer_ar] as [string, string])
  const cities = areaData.cities.map((city) => city.name_ar)
  const timezoneLabel = areaData.timezones.find((timezone) => timezone.is_primary)?.label_ar || areaData.timezones[0]?.label_ar || "التوقيت المحلي"

  return {
    slug,
    seo: getCountrySeoPlan(slug),
    areaData,
    quranPlans,
    arabicPlans,
    faq,
    cities,
    timezoneLabel,
    currencyCode: areaData.area?.currency_code || "",
  }
}
