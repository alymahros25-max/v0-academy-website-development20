#!/usr/bin/env python3
"""Generate the reviewed 40-country learning-content seed from the code baseline."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "supabase/seeds/country-page-code-source-2026-10-19.json"
SEED = ROOT / "supabase/seeds/country-learning-content-code-baseline-2026-10-20.json"
MIGRATION = ROOT / "supabase/migrations/051_seed_country_learning_content_from_code.sql"
ROLLBACK = ROOT / "supabase/rollback/051_deactivate_country_learning_content.sql"

FIELDS = [
    ("name", "learning_name"),
    ("localTitle", "learning_local_title"),
    ("localDescription", "learning_local_description"),
    ("quranTitle", "learning_quran_title"),
    ("quranBody", "learning_quran_body"),
    ("arabicTitle", "learning_arabic_title"),
    ("arabicBody", "learning_arabic_body"),
    ("quranArticleTitle", "learning_quran_article_title"),
    ("quranArticleBody", "learning_quran_article_body"),
    ("arabicArticleTitle", "learning_arabic_article_title"),
    ("arabicArticleBody", "learning_arabic_article_body"),
    ("teacherAngle", "learning_teacher_angle"),
]


def quote(value):
    return "'" + str(value).replace("'", "''") + "'"


data = json.loads(SOURCE.read_text(encoding="utf-8"))
assert len(data) == 40 and len({row["slug"] for row in data}) == 40, "Expected 40 unique country slugs"
rows = []
seed_rows = []
for country in sorted(data, key=lambda row: row["slug"]):
    education = country.get("educationalContent")
    assert isinstance(education, dict), f"{country['slug']}: educationalContent missing"
    seed_rows.append({"slug": country["slug"], "educationalContent": education})
    for sort_order, (field, content_key) in enumerate(FIELDS):
        value = education.get(field)
        assert isinstance(value, str) and value.strip(), f"{country['slug']}: {field} missing"
        rows.append((country["slug"], content_key, value.strip(), sort_order))

assert len(rows) == 480
slugs = sorted(row["slug"] for row in data)
keys = [key for _, key in FIELDS]

migration = [
    "-- 051: Seed the 12 code-authoritative learning fields for all 40 country pages.",
    "-- Plain text only; visual variants, section order, routes, and SEO remain code-owned.",
    "-- Conflicts are left untouched to preserve any reviewed/admin-edited value.",
    "BEGIN;",
    "DO $$ DECLARE n integer; BEGIN",
    f"  SELECT count(*) INTO n FROM public.site_areas WHERE area_type = 'country' AND slug IN ({', '.join(map(quote, slugs))});",
    "  IF n <> 40 THEN RAISE EXCEPTION 'Expected 40 country areas, found %; aborting seed', n; END IF;",
    "END $$;",
    "",
    "INSERT INTO public.area_content (area_id, content_key, content_ar, content_type, section, is_active, sort_order)",
    "SELECT a.id, v.content_key, v.content_ar, 'text', 'learning', TRUE, v.sort_order",
    "FROM public.site_areas a",
    "JOIN (VALUES",
    ",\n".join("  (" + ", ".join((quote(slug), quote(key), quote(value), str(order))) + ")" for slug, key, value, order in rows),
    ") AS v(slug, content_key, content_ar, sort_order) ON v.slug = a.slug",
    "WHERE a.area_type = 'country'",
    "ON CONFLICT (area_id, content_key) DO NOTHING;",
    "",
    "DO $$ DECLARE n integer; BEGIN",
    "  SELECT count(*) INTO n FROM public.area_content c",
    "  JOIN public.site_areas a ON a.id = c.area_id",
    f"  WHERE a.area_type = 'country' AND a.slug IN ({', '.join(map(quote, slugs))})",
    f"    AND c.content_key IN ({', '.join(map(quote, keys))})",
    "    AND c.section = 'learning' AND c.is_active = TRUE AND NULLIF(btrim(c.content_ar), '') IS NOT NULL;",
    "  IF n <> 480 THEN RAISE EXCEPTION 'Expected 480 active learning fields, found %; transaction rolled back', n; END IF;",
    "END $$;",
    "COMMIT;",
    "",
]

rollback = [
    "-- Roll back migration 051 by hiding its namespaced learning rows; no rows are deleted.",
    "BEGIN;",
    "UPDATE public.area_content c SET is_active = FALSE, updated_at = NOW()",
    "FROM public.site_areas a",
    "WHERE a.id = c.area_id AND a.area_type = 'country'",
    f"  AND a.slug IN ({', '.join(map(quote, slugs))})",
    f"  AND c.content_key IN ({', '.join(map(quote, keys))})",
    "  AND c.section = 'learning';",
    "COMMIT;",
    "",
]

SEED.parent.mkdir(parents=True, exist_ok=True)
SEED.write_text(json.dumps(seed_rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
MIGRATION.parent.mkdir(parents=True, exist_ok=True)
MIGRATION.write_text("\n".join(migration), encoding="utf-8")
ROLLBACK.parent.mkdir(parents=True, exist_ok=True)
ROLLBACK.write_text("\n".join(rollback), encoding="utf-8")
print(f"Generated {SEED.relative_to(ROOT)} ({len(seed_rows)} countries, {len(FIELDS)} fields each)")
print(f"Generated {MIGRATION.relative_to(ROOT)} ({len(rows)} values)")
print(f"Generated {ROLLBACK.relative_to(ROOT)} (soft-deactivate only)")
