export type AreaPackage = {
  id: number
  area_id?: number
  program: "quran" | "arabic" | "other"
  package_key: string
  name_ar: string
  name_en: string | null
  name_fr: string | null
  description_ar: string | null
  description_en: string | null
  description_fr: string | null
  duration_minutes?: number | null
  price: number | string
  currency_code: string
  sessions_per_month: number | null
  features_ar: unknown
  features_en: unknown
  features_fr: unknown
  is_popular: boolean
  is_active?: boolean
  sort_order: number
}

export type AreaDisplayPlan = {
  id: string
  program: "quran" | "arabic"
  duration: number
  monthlySessions: number
  weeklySessions: number
  price: number
  name: string
  description: string
  features: string[]
  popular: boolean
}

export type AreaLink = {
  id: number
  area_id?: number
  link_key: string
  label_ar: string | null
  label_en: string | null
  label_fr: string | null
  href: string
  link_type: string
  is_external: boolean
  is_active?: boolean
  sort_order: number
}

export type AreaTheme = {
  id: number
  area_id?: number
  theme_name_ar: string
  theme_name_en: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  quran_fact_title_ar: string | null
  quran_fact_body_ar: string | null
  quran_fact_reference_ar: string | null
  is_active?: boolean
  sort_order: number
}

export type AreaCity = {
  id: number
  area_id?: number
  city_key: string
  name_ar: string
  name_en: string
  region_name: string | null
  is_active?: boolean
  sort_order: number
}

export type AreaTimezone = {
  id: number
  area_id?: number
  timezone_name: string
  label_ar: string
  label_en: string
  is_primary: boolean
  is_active?: boolean
  sort_order: number
}

export type SiteArea = {
  id: number
  slug: string
  area_type: "global" | "country"
  country_code: string | null
  name_ar: string
  name_en: string | null
  name_fr: string | null
  currency_code: string | null
  currency_symbol: string | null
  is_active?: boolean
}

export type AreaFaqItem = {
  id: number
  area_id?: number
  question_key: string
  question_ar: string
  question_en: string | null
  question_fr: string | null
  answer_ar: string
  answer_en: string | null
  answer_fr: string | null
  is_active?: boolean
  sort_order: number
}

export type AreaContentItem = {
  id?: number
  area_id?: number
  content_key: string
  content_ar: string | null
  content_en: string | null
  content_fr: string | null
  content_type: string
  section: string | null
  href: string | null
  is_active?: boolean
  sort_order: number
}

export type AreaLandingSnapshot = {
  area: SiteArea | null
  packages: AreaPackage[]
  faq: AreaFaqItem[]
  content: AreaContentItem[]
  links: AreaLink[]
  theme: AreaTheme | null
  cities: AreaCity[]
  timezones: AreaTimezone[]
}

export type AreaResource = "content" | "packages" | "faq" | "links" | "themes" | "cities" | "timezones"

export type AreaAdminSnapshot = {
  areas: SiteArea[]
  content: Array<AreaContentItem & { area_id: number }>
  packages: Array<AreaPackage & { area_id: number }>
  faq: Array<AreaFaqItem & { area_id: number }>
  links: Array<AreaLink & { area_id: number }>
  themes: Array<AreaTheme & { area_id: number }>
  cities: Array<AreaCity & { area_id: number }>
  timezones: Array<AreaTimezone & { area_id: number }>
}
