import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const seed = JSON.parse(readFileSync(path.join(root, "supabase/seeds/country-page-code-source-2026-10-19.json"), "utf8"))
const migration = readFileSync(path.join(root, "supabase/migrations/050_seed_country_page_seo_and_faq_from_code.sql"), "utf8")
const rollback = readFileSync(path.join(root, "supabase/rollback/050_restore_country_page_faq_snapshot.sql"), "utf8")
const model = readFileSync(path.join(root, "lib/country-page-model.ts"), "utf8")
const resolver = readFileSync(path.join(root, "lib/country-seo.ts"), "utf8")
const loader = readFileSync(path.join(root, "lib/country-seo-data.ts"), "utf8")
const routeSlugs = Object.keys(JSON.parse(readFileSync(path.join(root, "lib/country-seo-plan.json"), "utf8")))

test("the reviewed seed snapshot contains 40 unique countries with complete SEO and FAQ", () => {
  assert.equal(seed.length, 40)
  assert.equal(new Set(seed.map((row) => row.slug)).size, 40)
  for (const row of seed) {
    assert.ok(row.seo?.title && row.seo?.description && row.seo?.h1, `${row.slug}: incomplete SEO`)
    assert.ok(row.faq.length >= 3, `${row.slug}: FAQ missing from code seed`)
  }
})

test("migration is bounded to code SEO and FAQ and does not alter package prices", () => {
  assert.match(migration, /Expected 40 country areas/)
  assert.match(migration, /country_seo_v2_title/)
  assert.match(migration, /country_seo_v2_supporting_keywords/)
  assert.match(migration, /country-code-v1-/)
  assert.match(migration, /SET is_active = FALSE/)
  assert.match(migration, /ON CONFLICT \(area_id, question_key\) DO UPDATE/)
  assert.doesNotMatch(migration, /UPDATE public\.area_packages|DELETE FROM public\.area_packages|UPDATE public\.site_areas/)
  assert.match(rollback, /151 rows across 35 countries/)
  assert.match(rollback, /country_seo_v2_%/)
  assert.match(rollback, /ON CONFLICT \(area_id, question_key\) DO UPDATE/)
})

test("SEO remains code-backed until all explicit versioned DB fields exist", () => {
  assert.match(resolver, /country_seo_v2_\$\{key\}/)
  assert.match(resolver, /if \(!title \|\| !description \|\| !h1 \|\| !keyword\) return fallback/)
  assert.match(model, /resolveCountrySeoPlan\(slug, areaData\.content\)/)
  assert.match(loader, /getAreaLandingData\(slug\)/)
  assert.equal(routeSlugs.length, 40)
  assert.ok(routeSlugs.every((slug) => {
    const route = readFileSync(path.join(root, "app", slug, "page.tsx"), "utf8")
    return route.includes("getCountrySeoMetadataFromDatabase")
  }))
})
