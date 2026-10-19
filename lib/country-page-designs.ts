import rawDesigns from "./country-page-designs.json"

export type CountryHeroVariant = "split" | "centered" | "editorial" | "offset" | "framed" | "banner" | "stacked" | "mirror"
export type CountryPlanVariant = "cards" | "table" | "rows" | "ladder" | "spotlight"
export type CountryLocalVariant = "bento" | "rail" | "band" | "split" | "clock"
export type CountryFaqVariant = "accordion" | "cards" | "columns" | "numbered" | "strip"
export type CountryLearningVariant = "cards" | "timeline" | "notebook" | "minimal"
export type CountryPageSection = "local" | "quranPlans" | "arabicPlans" | "videos" | "learning" | "faq"

export type CountryPageDesign = {
  profileId: string
  hero: CountryHeroVariant
  local: CountryLocalVariant
  plans: CountryPlanVariant
  faq: CountryFaqVariant
  learning: CountryLearningVariant
  order: CountryPageSection[]
}

const countryPageDesigns = rawDesigns as unknown as Record<string, CountryPageDesign>

export function getCountryPageDesign(slug: string): CountryPageDesign {
  const design = countryPageDesigns[slug]
  if (!design) throw new Error(`Missing country page design: ${slug}`)
  return design
}
