import { promises as fs } from "node:fs"
import path from "node:path"
import { newCountryConfigs } from "@/lib/new-country-pages"
import { getCountryPageModel } from "@/lib/country-pages/repository"

type BaselinePage = {
  slug: string
  url: string
  nameAr: string
  countryCode: string
  currencyCode: string
  currencySymbol: string
  canonical: string
  seoTitle: string
  seoDescription: string
  robots: { index: boolean; follow: boolean }
  sectionKeys: string[]
  packageCount: number
  packagePrograms: string[]
  faqCount: number
  cities: string[]
  timezone?: string
  linkKeys: string[]
  schemaVersion: number
}

type Check = {
  key: string
  status: "match" | "mismatch"
  baseline: unknown
  central: unknown
}

function sameValue(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function projectModel(model: NonNullable<Awaited<ReturnType<typeof getCountryPageModel>>>) {
  return {
    slug: model.country.slug,
    url: `/${model.country.slug}`,
    nameAr: model.country.nameAr,
    countryCode: model.country.countryCode,
    currencyCode: model.country.currencyCode,
    currencySymbol: model.country.currencySymbol,
    canonical: model.seo.canonical,
    seoTitle: model.seo.title,
    seoDescription: model.seo.description,
    robots: model.seo.robots,
    sectionKeys: model.sections.filter((section) => section.isActive).sort((a, b) => a.sortOrder - b.sortOrder).map((section) => `${section.type}:${section.variant}`),
    packageCount: model.packages.length,
    packagePrograms: [...new Set(model.packages.map((pkg) => pkg.program))],
    faqCount: model.faq.length,
    cities: model.country.cities,
    timezone: model.country.timezone,
    linkKeys: model.links.map((link) => link.key),
    schemaVersion: model.schemaVersion,
  }
}

async function main() {
  const baselinePath = path.join(process.cwd(), "docs/country-pages-batch-baseline.json")
  const baseline = JSON.parse(await fs.readFile(baselinePath, "utf8")) as { pages: BaselinePage[] }
  const fields = ["slug", "url", "nameAr", "countryCode", "currencyCode", "currencySymbol", "canonical", "seoTitle", "seoDescription", "robots", "sectionKeys", "packageCount", "packagePrograms", "faqCount", "cities", "timezone", "linkKeys", "schemaVersion"] as const
  const pages = []

  for (const config of newCountryConfigs) {
    const baselinePage = baseline.pages.find((page) => page.slug === config.slug)
    if (!baselinePage) throw new Error(`Missing baseline for ${config.slug}`)
    const model = await getCountryPageModel(config.slug)
    if (!model) throw new Error(`Missing central model for ${config.slug}`)
    const central = projectModel(model)
    const checks: Check[] = fields.map((key) => ({ key, status: sameValue(baselinePage[key], central[key]) ? "match" : "mismatch", baseline: baselinePage[key], central: central[key] }))
    pages.push({ slug: config.slug, summary: { comparedFields: checks.length, matches: checks.filter((check) => check.status === "match").length, mismatches: checks.filter((check) => check.status === "mismatch").length }, checks })
    console.log(`${config.slug}: ${checks.filter((check) => check.status === "match").length}/${checks.length} fields match`)
  }

  const mismatches = pages.reduce((total, page) => total + page.summary.mismatches, 0)
  const report = {
    schemaVersion: 1,
    baselineSource: "docs/country-pages-batch-baseline.json",
    scope: "NewCountryLanding batch",
    currentRenderer: "NewCountryLanding",
    centralRenderer: "CountryPageRenderer",
    visualParity: "not-measured",
    comparedPages: pages.length,
    comparedFields: fields.length,
    totalMatches: pages.reduce((total, page) => total + page.summary.matches, 0),
    totalMismatches: mismatches,
    pages,
    limitation: "This proves contract/data/SEO parity only. DOM and screenshot parity requires a browser comparison against the protected preview route.",
  }
  const outputPath = path.join(process.cwd(), "docs/country-renderer-batch-comparison.json")
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2) + "\n", "utf8")
  console.log(`Compared ${report.comparedPages} pages / ${report.comparedFields} fields: ${report.totalMatches} match, ${report.totalMismatches} mismatch`)
  if (mismatches > 0) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
