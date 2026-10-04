import { getNewCountryConfig, newCountryConfigs } from "@/lib/new-country-pages"
import { getCountryPageModel } from "@/lib/country-pages/repository"
import { safeValidateCountryPageModel } from "@/lib/country-pages/validation"

async function main() {
const startedAt = Date.now()
const results: Array<{ slug: string; status: "pass" | "fail"; packages: number; faq: number; cities: number; error?: string }> = []

for (const config of newCountryConfigs) {
  const slug = config.slug
  try {
    const model = await getCountryPageModel(slug)
    if (!model) throw new Error("missing config or repository model")
    const validation = safeValidateCountryPageModel(model)
    if (!validation.success) throw new Error(validation.error.issues.map((issue) => issue.path.join(".") + ": " + issue.message).join("; "))
    if (model.country.slug !== slug) throw new Error(`slug mismatch: ${model.country.slug}`)
    if (model.seo.canonical !== `https://quran-elhafez.com/${slug}`) throw new Error("canonical mismatch")

    results.push({ slug, status: "pass", packages: model.packages.length, faq: model.faq.length, cities: model.country.cities.length })
    console.log(`PASS ${slug}: packages=${model.packages.length} faq=${model.faq.length} cities=${model.country.cities.length}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    results.push({ slug, status: "fail", packages: 0, faq: 0, cities: 0, error: message })
    console.error(`FAIL ${slug}: ${message}`)
  }
}

const elapsedMs = Date.now() - startedAt
const failures = results.filter((result) => result.status === "fail")
console.log(JSON.stringify({ checked: results.length, passed: results.length - failures.length, failed: failures.length, elapsedMs, results }, null, 2))

if (failures.length > 0 || results.length !== newCountryConfigs.length || !getNewCountryConfig("qatar")) {
  process.exitCode = 1
}
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
