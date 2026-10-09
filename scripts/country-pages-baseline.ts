import { promises as fs } from "node:fs"
import path from "node:path"
import { newCountryConfigs } from "@/lib/new-country-pages"
import { getCountryPageModel } from "@/lib/country-pages/repository"

async function main() {
  const pages = []
  for (const config of newCountryConfigs) {
    const model = await getCountryPageModel(config.slug)
    if (!model) throw new Error(`Could not build model for ${config.slug}`)
    pages.push({
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
    })
  }

  const report = {
    schemaVersion: 1,
    source: "current-area-loader-with-code-fallback",
    scope: "NewCountryLanding batch",
    pageCount: pages.length,
    pages,
  }
  const outputPath = path.join(process.cwd(), "docs/country-pages-batch-baseline.json")
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2) + "\n", "utf8")
  console.log(`Wrote ${pages.length} page baselines to ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
