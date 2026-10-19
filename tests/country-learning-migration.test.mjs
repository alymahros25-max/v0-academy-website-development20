import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { resolveCountryEducation } from "../lib/country-education-resolution.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const read = (file) => readFileSync(path.join(root, file), "utf8")
const source = JSON.parse(read("supabase/seeds/country-page-code-source-2026-10-19.json"))
const seed = JSON.parse(read("supabase/seeds/country-learning-content-code-baseline-2026-10-20.json"))
const migration = read("supabase/migrations/051_seed_country_learning_content_from_code.sql")
const rollback = read("supabase/rollback/051_deactivate_country_learning_content.sql")
const fields = [
  "name", "localTitle", "localDescription", "quranTitle", "quranBody", "arabicTitle", "arabicBody",
  "quranArticleTitle", "quranArticleBody", "arabicArticleTitle", "arabicArticleBody", "teacherAngle",
]

function fallbackContent(prefix = "fallback") {
  return Object.fromEntries(fields.map((field) => [field, `${prefix}:${field}`]))
}

test("learning baseline covers 40 unique routes and has all 12 non-empty code fields", () => {
  assert.equal(seed.length, 40)
  assert.equal(new Set(seed.map((country) => country.slug)).size, 40)
  const sourceBySlug = new Map(source.map((country) => [country.slug, country.educationalContent]))
  for (const country of seed) {
    assert.ok(sourceBySlug.has(country.slug), `${country.slug}: not in reviewed code snapshot`)
    assert.deepEqual(country.educationalContent, sourceBySlug.get(country.slug), `${country.slug}: baseline drift`)
    for (const field of fields) {
      assert.equal(typeof country.educationalContent[field], "string", `${country.slug}.${field}: not text`)
      assert.ok(country.educationalContent[field].trim(), `${country.slug}.${field}: blank`)
    }
    assert.equal(Object.keys(country.educationalContent).length, 12, `${country.slug}: unexpected field`)
  }
})

test("migration inserts exactly 480 allow-listed learning fields and preserves conflicts", () => {
  const rows = migration.match(/\('[a-z0-9-]+', 'learning_[a-z_]+',/g) ?? []
  assert.equal(rows.length, 480)
  assert.match(migration, /Expected 40 country areas/)
  assert.match(migration, /Expected 480 active learning fields/)
  assert.match(migration, /ON CONFLICT \(area_id, content_key\) DO NOTHING/)
  assert.doesNotMatch(migration, /UPDATE public\.area_packages|DELETE FROM public\.area_packages|UPDATE public\.area_faq_items|country_seo_v2/)
  assert.doesNotMatch(rollback, /DELETE FROM/i)
  assert.match(rollback, /SET is_active = FALSE/)
})

test("DB values override per field, while empty/inactive/unknown values keep code fallback", () => {
  const fallback = fallbackContent()
  const rows = [
    { content_key: "learning_quran_title", content_ar: "عنوان من DB", is_active: true },
    { content_key: "learning_quran_body", content_ar: "   ", is_active: true },
    { content_key: "learning_arabic_title", content_ar: "غير نشط", is_active: false },
    { content_key: "learning_not_a_field", content_ar: "مفتاح مجهول", is_active: true },
  ]
  const resolved = resolveCountryEducation("italy", "italy", rows, fallback)
  assert.equal(resolved.quranTitle, "عنوان من DB")
  assert.equal(resolved.quranBody, fallback.quranBody)
  assert.equal(resolved.arabicTitle, fallback.arabicTitle)
  assert.equal(resolved.name, fallback.name)
  assert.equal(fallback.quranTitle, "fallback:quranTitle", "must not mutate fallback")
})

test("mismatched area slug cannot leak another country's education", () => {
  const fallback = fallbackContent()
  const resolved = resolveCountryEducation("italy", "france", [
    { content_key: "learning_name", content_ar: "فرنسا", is_active: true },
  ], fallback)
  assert.deepEqual(resolved, fallback)
  assert.deepEqual(resolveCountryEducation("italy", "italy", [], undefined), undefined)
})

test("central page and article routes use the same model; code still owns route/layout registries", () => {
  const model = read("lib/country-page-model.ts")
  const renderer = read("components/country-unified-landing.tsx")
  const hub = read("components/country-learning-hub.tsx")
  const article = read("app/blog/country/[slug]/[topic]/page.tsx")
  const content = read("lib/country-content.ts")
  assert.match(model, /resolveCountryEducation\(slug, areaData\.area\?\.slug, areaData\.content, countryEducationalContent\[slug\]\)/)
  assert.match(renderer, /CountryLearningHub slug=\{page\.slug\} content=\{page\.learning\}/)
  assert.match(hub, /suppliedContent \?\? countryEducationalContent\[slug\]/)
  assert.match(article, /getCountryPageModel\(slug\)/)
  assert.match(article, /Object\.keys\(countryEducationalContent\)/, "static route registry must remain code-owned")
  assert.match(content, /revalidatePath\(`\/blog\/country\/\$\{slug\}\/quran`\)/)
  assert.match(content, /revalidatePath\(`\/blog\/country\/\$\{slug\}\/arabic`\)/)
  assert.match(content, /revalidatePath\(`\/blog\/country\/\$\{slug\}\/teachers`\)/)
})

test("admin content edits are bounded and learning labels are readable", () => {
  const api = read("app/api/admin/areas/route.ts")
  const admin = read("components/admin/CountryLandingPagesTab.tsx")
  assert.match(api, /contentChangeSchema = z\.object/)
  assert.match(api, /content_ar: z\.string\(\)\.trim\(\)\.max\(4000\)/)
  assert.match(admin, /learning_quran_title: "عنوان مسار القرآن"/)
  assert.match(admin, /learning_teacher_angle: "نص مقالة المعلمين"/)
})
