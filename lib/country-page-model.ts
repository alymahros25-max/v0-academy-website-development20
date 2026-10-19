import { getAreaLandingData, toAreaDisplayPlan, type AreaDisplayPlan, type AreaLandingSnapshot } from "@/lib/country-content"
import { getCountrySeoPlan, type CompleteCountrySeoPage } from "@/lib/country-seo"
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
  const faq = areaData.faq.length ? areaData.faq.map((item) => [item.question_ar, item.answer_ar] as [string, string]) : fallback.faq
  const cities = areaData.cities.length ? areaData.cities.map((city) => city.name_ar) : fallback.cities
  const timezoneLabel = areaData.timezones.find((timezone) => timezone.is_primary)?.label_ar || areaData.timezones[0]?.label_ar || fallback.timezoneLabel

  return {
    slug,
    seo: getCountrySeoPlan(slug),
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
