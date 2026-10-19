import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const designs = JSON.parse(readFileSync(path.join(root, "lib/country-page-designs.json"), "utf8"))
const seoPlan = JSON.parse(readFileSync(path.join(root, "lib/country-seo-plan.json"), "utf8"))
const renderer = readFileSync(path.join(root, "components/country-unified-landing.tsx"), "utf8")
const engine = readFileSync(path.join(root, "components/country-landing-engine.tsx"), "utf8")
const expectedSections = ["local", "quranPlans", "arabicPlans", "videos", "learning", "faq"].sort()

test("all 40 country layouts have distinct identities, presentations, and section orders", () => {
  const rows = Object.entries(designs)
  assert.equal(rows.length, 40)
  assert.deepEqual(rows.map(([slug]) => slug).sort(), Object.keys(seoPlan).sort())
  assert.equal(new Set(rows.map(([, design]) => design.profileId)).size, 40, "profile identifiers must be unique")
  assert.equal(new Set(rows.map(([, design]) => `${design.hero}:${design.plans}`)).size, 40, "each country must have a unique hero + plan presentation pair")
  assert.equal(new Set(rows.map(([, design]) => design.order.join(","))).size, 40, "each country must have a unique section order")

  for (const [slug, design] of rows) {
    assert.equal(new Set(design.order).size, 6, `${slug}: a section is duplicated or omitted`)
    assert.deepEqual([...design.order].sort(), expectedSections, `${slug}: section contract changed`)
    assert.ok(design.order.indexOf("local") < design.order.indexOf("faq"), `${slug}: local context must precede FAQ`)
    assert.ok(design.order.indexOf("quranPlans") < design.order.indexOf("faq"), `${slug}: Quran plans must precede FAQ`)
    assert.ok(design.order.indexOf("arabicPlans") < design.order.indexOf("faq"), `${slug}: Arabic plans must precede FAQ`)
  }
})

test("the central renderer retains country data, conversion links, and shared shell", () => {
  for (const expression of [
    /data-country-unified-landing=\{page\.slug\}/,
    /data-country-layout=\{design\.profileId\}/,
    /page\.seo\?\.h1/,
    /page\.cities\.map/,
    /page\.timezoneLabel/,
    /page\.quranPlans/,
    /page\.arabicPlans/,
    /page\.faq\.map/,
    /getAreaWhatsAppUrl/,
    /getCountryThemeStyle/,
    /id=\{program === "quran" \? "quran-plans" : "arabic-plans"\}/,
  ]) assert.match(renderer, expression)
  assert.match(engine, /getCountryPageModel\(slug\)/)
  assert.match(engine, /CountryLocalLanguageBanner/)
  assert.match(engine, /CountrySharedFooter/)
  assert.match(engine, /CountrySharedStructuredData/)
})
