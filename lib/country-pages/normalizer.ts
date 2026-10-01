import type { NewCountryConfig } from "@/lib/new-country-pages"
import type { AreaLink, AreaPackage, getAreaLandingData } from "@/lib/country-content"
import { validateCountryPageModel } from "@/lib/country-pages/validation"
import type { CountryPageModel } from "@/lib/country-pages/types"

export type CountryLandingData = Awaited<ReturnType<typeof getAreaLandingData>>

function normalizeProgram(program: AreaPackage["program"]): "quran" | "arabic" | "other" {
  return program === "quran" || program === "arabic" ? program : "other"
}

function normalizeFeatures(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : []
}

function normalizeHref(value: string | null | undefined): string {
  return typeof value === "string" && value.trim() ? value.trim() : "#"
}

function normalizeLinks(links: Array<Partial<AreaLink>>): CountryPageModel["links"] {
  return links
    .filter((link) => typeof link.link_key === "string" && typeof link.href === "string")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((link, index) => ({
      key: link.link_key!,
      href: normalizeHref(link.href),
      label: link.label_ar?.trim() || link.link_key!,
      type: link.link_type?.trim() || "navigation",
      external: Boolean(link.is_external),
      sortOrder: link.sort_order ?? index,
    }))
}

function normalizeSections(config: NewCountryConfig): CountryPageModel["sections"] {
  return [
    { key: "hero", type: "hero", variant: config.variant, sortOrder: 0, isActive: true },
    { key: "steps", type: "steps", variant: config.variant, sortOrder: 1, isActive: true },
    { key: "pricing", type: "pricing", variant: config.variant, sortOrder: 2, isActive: true },
    { key: "local", type: "local", variant: "default", sortOrder: 3, isActive: true },
    { key: "faq", type: "faq", variant: "default", sortOrder: 4, isActive: true },
    { key: "closing", type: "closing", variant: "default", sortOrder: 5, isActive: true },
  ]
}

export function normalizeCountryPageModel(slug: string, config: NewCountryConfig, data: CountryLandingData): CountryPageModel {
  const packages = data.packages
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((pkg, index) => ({
      id: String(pkg.id),
      program: normalizeProgram(pkg.program),
      name: pkg.name_ar?.trim() || pkg.package_key,
      price: Number(pkg.price),
      currencyCode: pkg.currency_code?.trim() || config.currencyCode,
      sessionsPerMonth: pkg.sessions_per_month ?? 0,
      features: normalizeFeatures(pkg.features_ar),
      popular: Boolean(pkg.is_popular),
      sortOrder: pkg.sort_order ?? index,
    }))

  const faq = data.faq
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item, index) => ({
      id: String(item.id),
      question: item.question_ar?.trim() || item.question_key,
      answer: item.answer_ar?.trim() || "",
      sortOrder: item.sort_order ?? index,
    }))
    .filter((item) => item.question.length > 0 && item.answer.length > 0)

  const area = data.area
  const theme = data.theme
    ? {
        primary: data.theme.primary_color,
        accent: data.theme.accent_color,
        background: data.theme.background_color,
        surface: data.theme.secondary_color,
        ink: data.theme.text_color,
      }
    : config.theme

  return validateCountryPageModel({
    country: {
      slug,
      nameAr: area?.name_ar || config.name,
      nameEn: area?.name_en || undefined,
      headline: config.title,
      lead: config.description,
      countryCode: area?.country_code || "XX",
      currencyCode: area?.currency_code || config.currencyCode,
      currencySymbol: area?.currency_symbol || config.currencyCode,
      timezone: data.timezones.find((timezone) => timezone.is_primary)?.label_ar || data.timezones[0]?.label_ar || config.timezone,
      cities: data.cities.map((city) => city.name_ar).filter(Boolean),
    },
    seo: {
      title: config.seoTitle,
      description: config.seoDescription,
      canonical: `https://quran-elhafez.com/${slug}`,
      keywords: config.keywords,
      robots: { index: true, follow: true },
    },
    theme,
    sections: normalizeSections(config),
    packages,
    steps: config.steps.map((step, index) => ({
      id: `${slug}-step-${index + 1}`,
      title: step.title,
      text: step.text,
      sortOrder: index,
    })),
    localLead: config.localLead,
    faq,
    links: normalizeLinks(data.links),
    teachers: [],
    assets: [],
    status: "in-progress",
    schemaVersion: 1,
  })
}
