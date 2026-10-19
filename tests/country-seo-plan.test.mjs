import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const plan = JSON.parse(readFileSync(path.join(root, "lib/country-seo-plan.json"), "utf8"))
const seoSource = readFileSync(path.join(root, "lib/country-seo.ts"), "utf8")
const structuredDataSource = readFileSync(path.join(root, "components/country-page-shared.tsx"), "utf8")
const landingSource = readFileSync(path.join(root, "components/country-unified-landing.tsx"), "utf8")
const engineSource = readFileSync(path.join(root, "components/country-landing-engine.tsx"), "utf8")
const routeSources = Object.keys(plan).map((slug) => readFileSync(path.join(root, "app", slug, "page.tsx"), "utf8"))

test("the SEO plan has exactly 40 country records with four literal supporting keywords each", () => {
  assert.equal(Object.keys(plan).length, 40)
  for (const [slug, details] of Object.entries(plan)) {
    assert.equal(details.supportingKeywords.length, 4, `${slug}: expected four supporting keywords`)
    assert.equal(new Set(details.supportingKeywords).size, 4, `${slug}: duplicate supporting keyword`)
    assert.ok(details.contentAngle.length > 0, `${slug}: missing content angle`)
    assert.ok(details.contextualCities.length > 0, `${slug}: missing contextual cities`)
    assert.deepEqual(details.recommendedInternalLinks, ["/contact", "/library", "/games"])
    assert.ok(details.recommendedInternalLinks.every((href) => !["/quran", "/arabic"].includes(href)))
    assert.ok(["حفظ القرآن ومراجعته", "التلاوة وتأسيس العربية"].includes(details.localArticleTopic))
    assert.deepEqual(details.schemaTypes, ["WebPage", "EducationalOrganization", "Course: Quran", "Course: Arabic", "FAQPage (visible questions only)"])
  }
})

test("all country routes use centralized plan metadata and supporting keywords", () => {
  assert.equal(routeSources.length, 40)
  assert.match(seoSource, /keywords:\s*\[page\.keyword,\s*\.\.\.page\.supportingKeywords\]/)
  assert.match(seoSource, /siteName: "أكاديمية الحافظ المتميز"/)
  assert.ok(routeSources.every((source) => source.includes("getCountrySeoMetadata")))
  assert.ok(routeSources.every((source) => !source.includes("config.seo.canonical")), "country canonicals must come from the code-owned SEO plan")
})

test("each country's metadata title and description fit the site's SEO length checks", () => {
  const rows = [...seoSource.matchAll(/^\s+\{"slug": "([^"]+)", "country": "([^"]+)", "keyword": "([^"]+)", "title": "([^"]+)", "description": "([^"]+)", "h1": "([^"]+)"\},?$/gm)]
  assert.equal(rows.length, 40, "expected 40 complete country SEO metadata records")
  assert.equal(new Set(rows.map(([, slug]) => slug)).size, 40, "country SEO slugs must be unique")
  for (const [, slug, country, keyword, title, description, h1] of rows) {
    assert.ok(country && keyword && h1, `${slug}: missing SEO fields`)
    assert.ok(title.length >= 30 && title.length <= 60, `${slug}: title is ${title.length} chars`)
    assert.ok(description.length >= 50 && description.length <= 160, `${slug}: description is ${description.length} chars`)
    assert.ok(h1.length <= 80, `${slug}: H1 is ${h1.length} chars`)
  }
})

test("shared JSON-LD covers country route variants and visible FAQs", () => {
  assert.match(structuredDataSource, /"@type": "WebPage"/)
  assert.match(structuredDataSource, /"@type": "Course"/)
  assert.match(structuredDataSource, /"@type": "FAQPage"/)
  assert.match(structuredDataSource, /page\.faq\.map/)
  assert.match(landingSource, /page\.seo\?\.h1/)
  assert.match(engineSource, /CountrySharedStructuredData page=\{page\}/)
  assert.ok(routeSources.every((source) => source.includes("getCountrySeoMetadata")))
})
