# Country learning content — migration 051

## Scope

Migration `051_seed_country_learning_content_from_code.sql` seeds the 12 Arabic learning-content fields already present in the reviewed code baseline for all 40 country pages (480 text rows). It uses the existing `public.area_content` table; no schema change is required.

The seed snapshot is `supabase/seeds/country-learning-content-code-baseline-2026-10-20.json`, generated from `country-page-code-source-2026-10-19.json`. The generator verifies 40 unique slugs and 12 non-empty fields per country. `ON CONFLICT ... DO NOTHING` preserves any existing editorial values. The SQL checks for all 40 country areas and all 480 active, non-empty learning fields inside one transaction. It does not update packages/prices, FAQ, SEO, country names, route paths, or visual design profiles.

## Runtime behavior

`CountryPageModel.learning` resolves each allow-listed `learning_*` key from the matching area's cached snapshot. An absent, inactive, empty, malformed, or wrong-country row falls back to that field's existing code value. The shared landing page and country article routes use the same model. The static country/topic registry remains code-owned so incomplete database data cannot remove routes or sitemap entries.

The administration tab can edit Arabic `content_ar` values for these existing records. PATCH values are bounded and text-only; `content_key` is not editable. Successful changes invalidate the country page and its three country-article paths. Layout variants and section order remain code-owned.

## Apply and rollback

This migration is **prepared but not executed**. Apply only the exact reviewed SQL after the normal database preflight and approval gate. Do not use `supabase db push` based solely on the legacy manifest; historical migration-version collisions still require a separately reviewed resolution.

Rollback is `supabase/rollback/051_deactivate_country_learning_content.sql`. It soft-deactivates the namespaced learning rows; it does not delete them. If administrators edit these rows after deployment, review that consequence before rollback.

## Verification

Before preparation, the read-only inventory found no existing `learning_*` keys, while the source snapshot had 40 unique countries and all 480 non-empty values. Automated tests cover snapshot parity, SQL scope, per-field fallback, wrong-country isolation, shared renderer/article wiring, admin labels and cache invalidation. A passing local build is not evidence that this migration was applied or deployed.
