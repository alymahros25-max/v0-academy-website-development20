-- 024: Add Kuwait as a managed country landing page.
INSERT INTO public.site_areas (slug, area_type, country_code, name_ar, name_en, currency_code, currency_symbol)
VALUES ('kuwait', 'country', 'KW', 'الكويت', 'Kuwait', 'KWD', 'د.ك')
ON CONFLICT (slug) DO UPDATE SET
  country_code = EXCLUDED.country_code,
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  currency_code = EXCLUDED.currency_code,
  currency_symbol = EXCLUDED.currency_symbol,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO public.area_links (area_id, link_key, label_ar, label_en, href, link_type, is_external, sort_order)
SELECT id, 'whatsapp', 'واتساب الحجز', 'Booking WhatsApp', 'https://wa.me/201130127894', 'whatsapp', TRUE, 10
FROM public.site_areas
WHERE slug = 'kuwait'
ON CONFLICT (area_id, link_key) DO UPDATE SET
  label_ar = EXCLUDED.label_ar,
  label_en = EXCLUDED.label_en,
  href = EXCLUDED.href,
  is_external = TRUE,
  is_active = TRUE;

INSERT INTO public.area_links (area_id, link_key, label_ar, label_en, href, link_type, is_external, sort_order)
SELECT id, 'country-pages', 'روابط صفحات الدول', 'Country pages', '/kuwait', 'internal', FALSE, 20
FROM public.site_areas
WHERE slug = 'kuwait'
ON CONFLICT (area_id, link_key) DO UPDATE SET
  label_ar = EXCLUDED.label_ar,
  label_en = EXCLUDED.label_en,
  href = EXCLUDED.href,
  is_active = TRUE;

INSERT INTO public.area_content (area_id, section, content_key, content_ar, sort_order)
SELECT id, 'footer', 'country_links_title', 'روابط حسب الدولة', 10
FROM public.site_areas
WHERE slug = 'kuwait'
ON CONFLICT (area_id, section, content_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  is_active = TRUE;
