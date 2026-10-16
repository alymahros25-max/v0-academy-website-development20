import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const plan = JSON.parse(readFileSync(path.join(root, "lib/country-seo-plan.json"), "utf8"))
const seoSource = readFileSync(path.join(root, "lib/country-seo.ts"), "utf8")
const structuredDataSource = readFileSync(path.join(root, "components/country-seo-structured-data.tsx"), "utf8")
const landingSource = readFileSync(path.join(root, "components/new-country-landing.tsx"), "utf8")
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
  assert.ok(routeSources.every((source) => source.includes("getCountrySeoMetadata")))
})

test("shared JSON-LD covers country route variants and visible FAQs", () => {
  assert.match(seoSource, /getCountryWebPageSchema\(slug\)/)
  assert.match(seoSource, /EducationalOrganization/)
  assert.match(seoSource, /Course/)
  assert.match(structuredDataSource, /getCountrySchemaGraph\(slug\)/)
  assert.match(landingSource, /FAQPage/)
  assert.match(engineSource, /CountrySeoStructuredData slug=\{slug\}/)
  assert.ok(routeSources.every((source) => source.includes("getCountrySeoMetadata")))
})
