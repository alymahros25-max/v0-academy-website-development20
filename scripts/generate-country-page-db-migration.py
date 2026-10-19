#!/usr/bin/env python3
"""Generate the reviewed, code-authoritative country SEO/FAQ seed and FAQ rollback."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "supabase/seeds/country-page-code-source-2026-10-19.json"
MIGRATION = ROOT / "supabase/migrations/050_seed_country_page_seo_and_faq_from_code.sql"
ROLLBACK_SOURCE = ROOT / "supabase/seeds/country-page-faq-before-050.json"
ROLLBACK = ROOT / "supabase/rollback/050_restore_country_page_faq_snapshot.sql"


def q(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, int):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def values(rows, render):
    return ",\n".join("  (" + ", ".join(map(q, render(row))) + ")" for row in rows)


data = json.loads(SOURCE.read_text(encoding="utf-8"))
assert len(data) == 40 and len({row["slug"] for row in data}) == 40
content_rows = []
faq_rows = []
for country in data:
    slug = country["slug"]
    seo = country["seo"]
    assert seo and seo.get("title") and seo.get("description") and seo.get("h1")
    fields = [
        ("country_seo_v2_title", seo["title"]),
        ("country_seo_v2_description", seo["description"]),
        ("country_seo_v2_h1", seo["h1"]),
        ("country_seo_v2_keyword", seo["keyword"]),
        ("country_seo_v2_supporting_keywords", json.dumps(seo["supportingKeywords"], ensure_ascii=False)),
    ]
    for sort_order, (key, value) in enumerate(fields):
        content_rows.append((slug, key, value, "seo", sort_order))
    for sort_order, item in enumerate(country["faq"]):
        faq_rows.append((slug, f"country-code-v1-{slug}-{sort_order + 1}", item["question"], item["answer"], sort_order))

slugs = sorted(row["slug"] for row in data)
migration = [
    "-- 050: Seed authoritative SEO and FAQ data from the reviewed country code baseline.",
    "-- Scope: 40 country landing pages. Prices/packages are deliberately untouched (40/40 parity verified).",
    "-- Existing FAQ rows are soft-deactivated, not deleted; see rollback/050_restore_country_page_faq_snapshot.sql.",
    "BEGIN;",
    "DO $$ DECLARE n integer; BEGIN",
    f"  SELECT count(*) INTO n FROM public.site_areas WHERE area_type = 'country' AND slug IN ({', '.join(map(q, slugs))});",
    "  IF n <> 40 THEN RAISE EXCEPTION 'Expected 40 country areas, found %; aborting seed', n; END IF;",
    "END $$;",
    "",
    "INSERT INTO public.area_content (area_id, content_key, content_ar, content_type, section, is_active, sort_order)",
    "SELECT a.id, v.content_key, v.content_ar, 'text', 'seo', TRUE, v.sort_order",
    "FROM public.site_areas a",
    "JOIN (VALUES",
    values(content_rows, lambda r: r),
    ") AS v(slug, content_key, content_ar, section_name, sort_order) ON v.slug = a.slug",
    "WHERE a.area_type = 'country'",
    "ON CONFLICT (area_id, content_key) DO UPDATE SET content_ar = EXCLUDED.content_ar, content_type = EXCLUDED.content_type, section = EXCLUDED.section, is_active = TRUE, sort_order = EXCLUDED.sort_order, updated_at = NOW();",
    "",
    f"UPDATE public.area_faq_items f SET is_active = FALSE, updated_at = NOW() FROM public.site_areas a WHERE a.id = f.area_id AND a.area_type = 'country' AND a.slug IN ({', '.join(map(q, slugs))});",
    "",
    "INSERT INTO public.area_faq_items (area_id, question_key, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, is_active, sort_order)",
    "SELECT a.id, v.question_key, v.question_ar, NULL, NULL, v.answer_ar, NULL, NULL, TRUE, v.sort_order",
    "FROM public.site_areas a",
    "JOIN (VALUES",
    values(faq_rows, lambda r: r),
    ") AS v(slug, question_key, question_ar, answer_ar, sort_order) ON v.slug = a.slug",
    "WHERE a.area_type = 'country'",
    "ON CONFLICT (area_id, question_key) DO UPDATE SET question_ar = EXCLUDED.question_ar, question_en = EXCLUDED.question_en, question_fr = EXCLUDED.question_fr, answer_ar = EXCLUDED.answer_ar, answer_en = EXCLUDED.answer_en, answer_fr = EXCLUDED.answer_fr, is_active = TRUE, sort_order = EXCLUDED.sort_order, updated_at = NOW();",
    "COMMIT;",
    "",
]
MIGRATION.parent.mkdir(parents=True, exist_ok=True)
MIGRATION.write_text("\n".join(migration), encoding="utf-8")

if not ROLLBACK_SOURCE.exists():
    raise SystemExit(f"Missing reviewed DB FAQ rollback snapshot: {ROLLBACK_SOURCE}")
old = json.loads(ROLLBACK_SOURCE.read_text(encoding="utf-8"))
rollback_rows = [
    (r["slug"], r["question_key"], r["question_ar"], r.get("question_en"), r.get("question_fr"),
     r["answer_ar"], r.get("answer_en"), r.get("answer_fr"), r["is_active"], r["sort_order"])
    for r in old
]
rollback = [
    "-- Roll back the FAQ rows touched by migration 050 using the read-only pre-change DB snapshot.",
    "-- This restores the previous FAQ state (151 rows across 35 countries) and hides the code-seeded rows.",
    "BEGIN;",
    "UPDATE public.area_content SET is_active = FALSE, updated_at = NOW() WHERE content_key LIKE 'country_seo_v2_%';",
    "UPDATE public.area_faq_items f SET is_active = FALSE, updated_at = NOW() FROM public.site_areas a WHERE a.id = f.area_id AND f.question_key LIKE 'country-code-v1-%' AND a.area_type = 'country';",
    "INSERT INTO public.area_faq_items (area_id, question_key, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, is_active, sort_order)",
    "SELECT a.id, v.question_key, v.question_ar, v.question_en, v.question_fr, v.answer_ar, v.answer_en, v.answer_fr, v.is_active, v.sort_order",
    "FROM public.site_areas a",
    "JOIN (VALUES",
    values(rollback_rows, lambda r: r),
    ") AS v(slug, question_key, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, is_active, sort_order) ON v.slug = a.slug",
    "WHERE a.area_type = 'country'",
    "ON CONFLICT (area_id, question_key) DO UPDATE SET question_ar = EXCLUDED.question_ar, question_en = EXCLUDED.question_en, question_fr = EXCLUDED.question_fr, answer_ar = EXCLUDED.answer_ar, answer_en = EXCLUDED.answer_en, answer_fr = EXCLUDED.answer_fr, is_active = EXCLUDED.is_active, sort_order = EXCLUDED.sort_order, updated_at = NOW();",
    "COMMIT;",
    "",
]
ROLLBACK.parent.mkdir(parents=True, exist_ok=True)
ROLLBACK.write_text("\n".join(rollback), encoding="utf-8")
print(f"Generated {MIGRATION.relative_to(ROOT)} ({len(content_rows)} SEO values, {len(faq_rows)} FAQs)")
print(f"Generated {ROLLBACK.relative_to(ROOT)} ({len(rollback_rows)} restored FAQ rows)")
