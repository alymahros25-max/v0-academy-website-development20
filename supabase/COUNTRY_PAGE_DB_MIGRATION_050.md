# Country page database source — migration 050

## Scope

This branch prepares, but does not apply, `050_seed_country_page_seo_and_faq_from_code.sql`. It seeds the currently code-owned SEO fields under versioned keys (`country_seo_v2_*`) for all 40 country pages and synchronizes the 174 FAQ rows to the approved code baseline. Existing FAQ records are soft-deactivated, never deleted. It deliberately does not change packages/prices, currency, cities, timezones, themes, links, route slugs, canonical URLs, layout profiles, or page renderers.

The prior read-only comparison verified all eight package rows per country (program, session count, price and ISO currency) match in code and DB. FAQ matched exactly in 27/40 countries; five countries had no active FAQ rows, and the total current DB snapshot had 151 rows across 35 countries. The code snapshot contains 174 FAQ entries across 40 countries. The seed makes code-authoritative FAQ content available in the database while preserving the prior rows for rollback.

## Runtime behavior

All 40 route metadata functions now use `getCountrySeoMetadataFromDatabase`. The page model reads only the explicit versioned `country_seo_v2_*` keys. Until those keys exist and all required values are present, it falls back to the existing code SEO plan. Canonicals remain code-owned. This means deploying the branch before applying migration 050 keeps the current metadata, rather than accidentally consuming older SEO content already in `area_content`.

## Inputs and reproducibility

- `supabase/seeds/country-page-code-source-2026-10-19.json` is the code baseline for all 40 countries, including FAQ and SEO values.
- `supabase/seeds/country-page-faq-before-050.json` is the read-only FAQ snapshot captured immediately before migration preparation (151 rows across 35 countries).
- `scripts/generate-country-page-db-migration.py` recreates both SQL files from these tracked inputs.
- `supabase/rollback/050_restore_country_page_faq_snapshot.sql` deactivates newly seeded FAQ/v2 SEO and restores the captured pre-migration FAQ states.

Regenerate with:

```sh
python3 scripts/generate-country-page-db-migration.py
```

## Important: do not apply yet

This branch has not changed Supabase. The remote migration-history tool returned only `isolated_0001_clean_baseline`, `isolated_0002_admin_content`, `isolated_0003_admin_editors`, `central_source_probe`, and `isolated_0004_seed_global_content`, rather than the numbered repository migration history. Therefore the repository filename `050` cannot be assumed to be the next database migration version. Before applying any SQL, reconcile the remote migration ledger and database schema with the repository, test this migration on an isolated copy, and confirm the target project/backups. Do not run `supabase db push` over the existing history on the basis of this file alone.

## Checks completed

- 40/40 code SEO records and 40/40 countries are represented in the source snapshot.
- 174 FAQ rows generated from country code; all 40 country areas are guarded by a preflight assertion in SQL.
- Migration SQL contains no package, price, currency, or area updates and no hard deletes.
- Rollback SQL carries the 151-row pre-change FAQ snapshot.
- Country data, SEO, route, and migration contract tests pass.
- TypeScript check and production build pass locally using fallback behavior where this sandbox has no Supabase credentials.
- The SQL has not been run against remote Supabase and the Vercel deployment has not been changed.
