-- Pin function search_path to prevent object-shadowing risks.
BEGIN;

CREATE OR REPLACE FUNCTION public.enforce_area_package_currency()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $function$
DECLARE expected_currency TEXT;
BEGIN
  SELECT currency_code INTO expected_currency FROM public.site_areas WHERE id = NEW.area_id;
  IF expected_currency IS NULL OR upper(NEW.currency_code) <> upper(expected_currency) THEN
    RAISE EXCEPTION 'Package currency must match its site area currency';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.replace_admin_content_atomic(p_content_type text, payload jsonb)
RETURNS void
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $function$
BEGIN
  IF p_content_type NOT IN ('teachers', 'reviews', 'messages', 'settings') THEN
    RAISE EXCEPTION 'Unsupported admin content type';
  END IF;
  IF payload IS NULL OR jsonb_typeof(payload) <> 'array' THEN
    RAISE EXCEPTION 'Admin content payload must be a JSON array';
  END IF;

  DELETE FROM public.admin_content WHERE content_type = p_content_type;
  INSERT INTO public.admin_content (content_type, content_id, data, updated_at)
  SELECT p_content_type, item.content_id, item.data, pg_catalog.now()
  FROM pg_catalog.jsonb_to_recordset(payload) AS item(content_id TEXT, data JSONB);
END;
$function$;

CREATE OR REPLACE FUNCTION public.replace_packages_atomic(payload jsonb)
RETURNS SETOF public.packages
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $function$
BEGIN
  IF payload IS NULL OR jsonb_typeof(payload) <> 'array' THEN
    RAISE EXCEPTION 'Package payload must be a JSON array';
  END IF;

  DELETE FROM public.packages;
  INSERT INTO public.packages (
    id, type, name_ar, name_en, name_fr, sessions, price, duration,
    features_ar, features_en, features_fr, popular, active, sort_order, updated_at
  )
  SELECT
    item.id, item.type, item.name_ar, item.name_en, item.name_fr,
    item.sessions, item.price, item.duration, item.features_ar,
    item.features_en, item.features_fr, item.popular, item.active,
    item.sort_order, pg_catalog.now()
  FROM pg_catalog.jsonb_to_recordset(payload) AS item(
    id TEXT, type TEXT, name_ar TEXT, name_en TEXT, name_fr TEXT,
    sessions INTEGER, price NUMERIC(12,2), duration INTEGER,
    features_ar TEXT, features_en TEXT, features_fr TEXT,
    popular BOOLEAN, active BOOLEAN, sort_order INTEGER
  );

  RETURN QUERY SELECT * FROM public.packages ORDER BY type, sort_order;
END;
$function$;

COMMIT;
