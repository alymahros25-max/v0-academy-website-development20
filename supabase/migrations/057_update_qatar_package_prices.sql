BEGIN;

ALTER TABLE public.area_packages
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;

DO $$
DECLARE
  qatar_area_id BIGINT;
  expected_count INTEGER;
BEGIN
  SELECT id INTO qatar_area_id
  FROM public.site_areas
  WHERE slug = 'qatar' AND area_type = 'country';

  IF qatar_area_id IS NULL THEN
    RAISE EXCEPTION 'Qatar area row was not found; no package prices were changed.';
  END IF;

  SELECT COUNT(*) INTO expected_count
  FROM (
    VALUES
      ('quran', 4), ('quran', 8), ('quran', 12), ('quran', 16),
      ('arabic', 4), ('arabic', 8), ('arabic', 12), ('arabic', 16)
  ) AS expected(program, sessions_per_month)
  WHERE EXISTS (
    SELECT 1
    FROM public.area_packages package
    WHERE package.area_id = qatar_area_id
      AND package.program = expected.program
      AND package.sessions_per_month = expected.sessions_per_month
  );

  IF expected_count <> 8 THEN
    RAISE EXCEPTION 'Expected all 8 Qatar package groups before update; found % of 8. No package prices were changed.', expected_count;
  END IF;
END;
$$;

UPDATE public.site_areas
SET currency_code = 'QAR', currency_symbol = 'ر.ق', updated_at = NOW()
WHERE slug = 'qatar' AND area_type = 'country';

WITH expected(program, sessions_per_month, price, sort_order) AS (
  VALUES
    ('quran', 4, 55::NUMERIC, 1),
    ('quran', 8, 105::NUMERIC, 2),
    ('quran', 12, 155::NUMERIC, 3),
    ('quran', 16, 205::NUMERIC, 4),
    ('arabic', 4, 75::NUMERIC, 1),
    ('arabic', 8, 135::NUMERIC, 2),
    ('arabic', 12, 200::NUMERIC, 3),
    ('arabic', 16, 270::NUMERIC, 4)
), ranked AS (
  SELECT
    package.id,
    expected.price,
    expected.sort_order,
    ROW_NUMBER() OVER (
      PARTITION BY expected.program, expected.sessions_per_month
      ORDER BY
        CASE WHEN package.package_key = expected.program || '-30-' || expected.sessions_per_month::TEXT THEN 0 ELSE 1 END,
        package.is_active DESC,
        package.sort_order ASC,
        package.id ASC
    ) AS duplicate_rank
  FROM expected
  JOIN public.site_areas area
    ON area.slug = 'qatar' AND area.area_type = 'country'
  JOIN public.area_packages package
    ON package.area_id = area.id
   AND package.program = expected.program
   AND package.sessions_per_month = expected.sessions_per_month
)
UPDATE public.area_packages AS package
SET
  price = ranked.price,
  currency_code = 'QAR',
  duration_minutes = 30,
  is_active = (ranked.duplicate_rank = 1),
  sort_order = ranked.sort_order,
  updated_at = NOW()
FROM ranked
WHERE package.id = ranked.id;

DO $$
DECLARE
  qatar_area_id BIGINT;
  active_expected_count INTEGER;
BEGIN
  SELECT id INTO qatar_area_id
  FROM public.site_areas
  WHERE slug = 'qatar' AND area_type = 'country';

  SELECT COUNT(*) INTO active_expected_count
  FROM (
    VALUES
      ('quran', 4, 55::NUMERIC), ('quran', 8, 105::NUMERIC),
      ('quran', 12, 155::NUMERIC), ('quran', 16, 205::NUMERIC),
      ('arabic', 4, 75::NUMERIC), ('arabic', 8, 135::NUMERIC),
      ('arabic', 12, 200::NUMERIC), ('arabic', 16, 270::NUMERIC)
  ) AS expected(program, sessions_per_month, price)
  WHERE EXISTS (
    SELECT 1
    FROM public.area_packages package
    WHERE package.area_id = qatar_area_id
      AND package.program = expected.program
      AND package.sessions_per_month = expected.sessions_per_month
      AND package.price = expected.price
      AND package.currency_code = 'QAR'
      AND package.duration_minutes = 30
      AND package.is_active = TRUE
  );

  IF active_expected_count <> 8 THEN
    RAISE EXCEPTION 'Qatar verification failed: expected 8 active packages at the requested QAR prices and 30-minute duration; found %.', active_expected_count;
  END IF;
END;
$$;

COMMIT;
