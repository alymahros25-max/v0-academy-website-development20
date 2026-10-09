import { writeFile } from "node:fs/promises"
import { buildPayload, areaRows } from "./migrate-central-preview"

const q = (value: unknown) => value === null || value === undefined ? "NULL" : typeof value === "boolean" ? String(value) : typeof value === "number" ? String(value) : `'${String(value).replaceAll("'", "''")}'`
const jq = (value: unknown) => `${q(JSON.stringify(value))}::jsonb`
const cols = {
  area: ["slug","area_type","country_code","name_ar","name_en","name_fr","currency_code","currency_symbol","is_active"],
  content: ["area_id","content_key","content_ar","content_en","content_fr","content_type","section","href","is_active","sort_order"],
  packages: ["area_id","program","package_key","name_ar","name_en","name_fr","description_ar","description_en","description_fr","price","currency_code","billing_period","sessions_per_month","duration_minutes","features_ar","features_en","features_fr","is_popular","is_active","sort_order"],
  faq: ["area_id","question_key","question_ar","question_en","question_fr","answer_ar","answer_en","answer_fr","is_active","sort_order"],
  links: ["area_id","link_key","label_ar","label_en","label_fr","href","link_type","is_external","is_active","sort_order"],
  cities: ["area_id","city_key","name_ar","name_en","region_name","is_active","sort_order"],
  timezones: ["area_id","timezone_name","label_ar","label_en","is_primary","is_active","sort_order"],
  themes: ["area_id","theme_name_ar","theme_name_en","primary_color","secondary_color","accent_color","background_color","text_color","quran_fact_title_ar","quran_fact_body_ar","quran_fact_reference_ar","is_active","sort_order"],
}
const table: Record<string,string> = { content:"area_content",packages:"area_packages",faq:"area_faq_items",links:"area_links",cities:"area_cities",timezones:"area_timezones",themes:"area_themes" }
const values = (kind: string, rows: any[]) => rows.map((row) => `(${cols[kind].map((c) => c === "area_id" ? "a.id" : c === "features_ar" || c === "features_en" || c === "features_fr" ? jq(row[c]) : q(row[c])).join(",")})`).join(",\n")

async function main() {
const payload = await buildPayload()
const sql: string[] = ["BEGIN;", "-- Generated from the current branch. Preview only."]
for (const country of payload.countries) {
  const rows = areaRows(country)
  const area = rows.area
  sql.push(`INSERT INTO site_areas (${cols.area.join(",")}) VALUES (${cols.area.map((c) => q(area[c])).join(",")}) ON CONFLICT (slug) DO UPDATE SET area_type=EXCLUDED.area_type,country_code=EXCLUDED.country_code,name_ar=EXCLUDED.name_ar,name_en=EXCLUDED.name_en,currency_code=EXCLUDED.currency_code,currency_symbol=EXCLUDED.currency_symbol,is_active=EXCLUDED.is_active,updated_at=NOW();`)
  sql.push(`DO $$ BEGIN DELETE FROM area_content WHERE area_id=(SELECT id FROM site_areas WHERE slug=${q(country.slug)}); DELETE FROM area_packages WHERE area_id=(SELECT id FROM site_areas WHERE slug=${q(country.slug)}); DELETE FROM area_faq_items WHERE area_id=(SELECT id FROM site_areas WHERE slug=${q(country.slug)}); DELETE FROM area_links WHERE area_id=(SELECT id FROM site_areas WHERE slug=${q(country.slug)}); DELETE FROM area_cities WHERE area_id=(SELECT id FROM site_areas WHERE slug=${q(country.slug)}); DELETE FROM area_timezones WHERE area_id=(SELECT id FROM site_areas WHERE slug=${q(country.slug)}); DELETE FROM area_themes WHERE area_id=(SELECT id FROM site_areas WHERE slug=${q(country.slug)}); END $$;`)
  for (const kind of ["content","packages","faq","links","cities","timezones","themes"] as const) {
    const data = kind === "themes" ? [rows.theme] : rows[kind]
    if (!data.length) continue
    sql.push(`WITH a AS (SELECT id FROM site_areas WHERE slug=${q(country.slug)}) INSERT INTO ${table[kind]} (${cols[kind].join(",")}) SELECT v.* FROM a CROSS JOIN LATERAL (VALUES ${values(kind, data)}) AS v(${cols[kind].join(",")});`)
  }
}
sql.push("COMMIT;")
await writeFile("/tmp/countries-preview.sql", sql.join("\n\n"))
console.log(JSON.stringify({ countries: payload.countries.length, bytes: Buffer.byteLength(sql.join("\n\n")), file: "/tmp/countries-preview.sql" }, null, 2))
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
