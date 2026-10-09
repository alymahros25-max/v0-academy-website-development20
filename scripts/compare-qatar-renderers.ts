import { promises as fs } from "node:fs"
import path from "node:path"
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
  status: string
  schemaVersion: number
}

type Check = {
  key: string
  baseline: unknown
  central: unknown
  status: "match" | "mismatch"
  note?: string
}

function sameValue(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

async function main() {
  const baselinePath = path.join(process.cwd(), "docs/country-pages-batch-baseline.json")
  const baseline = JSON.parse(await fs.readFile(baselinePath, "utf8")) as { pages: BaselinePage[] }
  const baselinePage = baseline.pages.find((page) => page.slug === "qatar")
  if (!baselinePage) throw new Error("Qatar baseline is missing")

  const model = await getCountryPageModel("qatar")
  if (!model) throw new Error("Qatar central model is missing")

  const central = {
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
    status: model.status,
    schemaVersion: model.schemaVersion,
  }

  const keys: Array<keyof typeof central> = [
    "slug", "url", "nameAr", "countryCode", "currencyCode", "currencySymbol", "canonical",
    "seoTitle", "seoDescription", "robots", "sectionKeys", "packageCount", "packagePrograms",
    "faqCount", "cities", "timezone", "linkKeys", "schemaVersion",
  ]
  const checks: Check[] = keys.map((key) => ({
    key,
    baseline: baselinePage[key],
    central: central[key],
    status: sameValue(baselinePage[key], central[key]) ? "match" : "mismatch",
  }))

  const report = {
    schemaVersion: 1,
    slug: "qatar",
    baselineSource: "docs/country-pages-batch-baseline.json",
    currentRenderer: {
      route: "app/qatar/page.tsx",
      component: "NewCountryLanding",
      note: "The existing route remains the production renderer and was not replaced.",
    },
    centralRenderer: {
      repository: "lib/country-pages/repository.ts",
      normalizer: "lib/country-pages/normalizer.ts",
      contract: "lib/country-pages/types.ts",
      visualImplementation: "not-separate-yet",
      note: "This run proves contract/data parity; a separate visual renderer has not been introduced yet.",
    },
    summary: {
      comparedFields: checks.length,
      matches: checks.filter((check) => check.status === "match").length,
      mismatches: checks.filter((check) => check.status === "mismatch").length,
      visualParity: "not-measured",
    },
    checks,
    limitations: [
      "The baseline and central model currently use the same existing area loader and code fallback.",
      "No screenshot or DOM comparison is claimed until CountryPageRenderer is implemented separately.",
      "No route, SEO, or production database change is made by this report.",
    ],
  }

  const outputPath = path.join(process.cwd(), "docs/qatar-renderer-comparison.json")
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2) + "\n", "utf8")
  console.log(`Compared ${checks.length} Qatar contract fields: ${report.summary.matches} match, ${report.summary.mismatches} mismatch`)
  console.log(`Wrote ${outputPath}`)
  if (report.summary.mismatches > 0) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
