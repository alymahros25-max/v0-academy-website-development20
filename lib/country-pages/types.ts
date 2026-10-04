export type CountryPageStatus = "baseline" | "in-progress" | "migrated" | "verified"

export type CountryPageTheme = {
  primary: string
  accent: string
  background: string
  surface: string
  ink: string
}

export type CountryPageSeo = {
  title: string
  description: string
  canonical: string
  keywords: string[]
  robots: {
    index: boolean
    follow: boolean
  }
  ogImage?: string
}

export type CountryPageSection = {
  key: string
  type: string
  variant: string
  sortOrder: number
  isActive: boolean
  settings?: Record<string, unknown>
}

export type CountryPagePackage = {
  id: string
  program: "quran" | "arabic" | "other"
  name: string
  price: number
  currencyCode: string
  sessionsPerMonth: number
  features: string[]
  popular: boolean
  sortOrder: number
}

export type CountryPageFaq = {
  id: string
  question: string
  answer: string
  sortOrder: number
}

export type CountryPageStep = {
  id: string
  title: string
  text: string
  sortOrder: number
}

export type CountryPageLink = {
  key: string
  href: string
  label: string
  type: string
  external: boolean
  sortOrder: number
}

export type CountryPageTeacher = {
  id: string
  sortOrder: number
  bio?: string
}

export type CountryPageAsset = {
  key: string
  url: string
  alt: string
  width?: number
  height?: number
}

export type CountryPageModel = {
  country: {
    slug: string
    nameAr: string
    nameEn?: string
    headline: string
    lead: string
    countryCode: string
    currencyCode: string
    currencySymbol: string
    timezone?: string
    cities: string[]
  }
  seo: CountryPageSeo
  theme: CountryPageTheme
  sections: CountryPageSection[]
  packages: CountryPagePackage[]
  steps: CountryPageStep[]
  localLead: string
  faq: CountryPageFaq[]
  links: CountryPageLink[]
  teachers: CountryPageTeacher[]
  assets: CountryPageAsset[]
  status: CountryPageStatus
  schemaVersion: number
}
