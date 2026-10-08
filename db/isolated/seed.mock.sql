-- SYNTHETIC PREVIEW DATA ONLY. Do not apply to production or any existing database.
-- Prices are intentionally artificial (101/202/303). Links use example.test.
BEGIN;

INSERT INTO site_areas (slug, area_type, country_code, name_ar, name_en, currency_code, currency_symbol)
VALUES
  ('global', 'global', NULL, 'موقع تجريبي', 'Mock main site', 'USD', '$'),
  ('colombia', 'country', 'CO', 'اختبار كولومبيا', 'Mock Colombia', 'COP', 'COP'),
  ('austria', 'country', 'AT', 'اختبار النمسا', 'Mock Austria', 'EUR', '€'),
  ('australia', 'country', 'AU', 'اختبار أستراليا', 'Mock Australia', 'AUD', 'A$')
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  currency_code = EXCLUDED.currency_code,
  currency_symbol = EXCLUDED.currency_symbol,
  is_active = TRUE;

INSERT INTO site_content (key, content_ar, content_en, is_active)
VALUES ('hero_title', 'عنوان تجريبي للمعاينة', 'Preview-only hero title', TRUE)
ON CONFLICT (key) DO UPDATE SET content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, is_active = TRUE;

INSERT INTO area_packages (area_id, program, package_key, name_ar, price, currency_code, sessions_per_month, duration_minutes, is_active, sort_order)
SELECT id, 'quran', 'quran-30-4-99999', 'باقة اختبار — 30 دقيقة', v.price, v.currency, 4, 30, TRUE, 10
FROM (VALUES ('colombia', 101.00::numeric, 'COP'), ('austria', 202.00::numeric, 'EUR'), ('australia', 303.00::numeric, 'AUD')) AS v(slug, price, currency)
JOIN site_areas a ON a.slug = v.slug
ON CONFLICT (area_id, package_key) DO UPDATE SET
  price = EXCLUDED.price,
  currency_code = EXCLUDED.currency_code,
  is_active = TRUE;

INSERT INTO area_faq_items (area_id, question_key, question_ar, answer_ar, is_active, sort_order)
SELECT id, 'mock-faq', 'سؤال تجريبي — ' || name_ar, 'هذه إجابة اصطناعية للاختبار فقط.', TRUE, 10
FROM site_areas WHERE slug IN ('colombia', 'austria', 'australia')
ON CONFLICT (area_id, question_key) DO UPDATE SET question_ar = EXCLUDED.question_ar, answer_ar = EXCLUDED.answer_ar, is_active = TRUE;

INSERT INTO area_links (area_id, link_key, label_ar, href, link_type, is_external, is_active, sort_order)
SELECT id, 'mock-contact', 'رابط اختبار', 'https://example.test/contact/' || slug, 'external', TRUE, TRUE, 10
FROM site_areas WHERE slug IN ('colombia', 'austria', 'australia')
ON CONFLICT (area_id, link_key) DO UPDATE SET href = EXCLUDED.href, is_active = TRUE;

INSERT INTO area_themes (area_id, theme_name_ar, primary_color, secondary_color, accent_color, background_color, text_color, is_active)
SELECT id, 'ثيم اختباري', '#123456', '#234567', '#345678', '#F7F7F7', '#111111', TRUE
FROM site_areas WHERE slug = 'austria'
ON CONFLICT (area_id) DO UPDATE SET theme_name_ar = EXCLUDED.theme_name_ar, is_active = TRUE;

INSERT INTO area_cities (area_id, city_key, name_ar, name_en, region_name, is_active, sort_order)
SELECT id, 'mock-city', 'مدينة اختبار', 'Mock City', 'Mock Region', TRUE, 10
FROM site_areas WHERE slug = 'austria'
ON CONFLICT (area_id, city_key) DO UPDATE SET name_ar = EXCLUDED.name_ar, is_active = TRUE;

INSERT INTO area_timezones (area_id, timezone_name, label_ar, label_en, is_primary, is_active, sort_order)
SELECT id, 'Europe/Vienna', 'توقيت اختبار', 'Mock time', TRUE, TRUE, 10
FROM site_areas WHERE slug = 'austria'
ON CONFLICT (area_id, timezone_name) DO UPDATE SET label_ar = EXCLUDED.label_ar, is_primary = TRUE, is_active = TRUE;

-- Separate, obviously artificial Saudi/UAE preview fixtures; never use these prices in production.
INSERT INTO site_areas (slug, area_type, country_code, name_ar, name_en, currency_code, currency_symbol)
VALUES
  ('saudi-arabia', 'country', 'SA', 'اختبار السعودية', 'Mock Saudi Arabia', 'SAR', 'ر.س'),
  ('united-arab-emirates', 'country', 'AE', 'اختبار الإمارات', 'Mock United Arab Emirates', 'AED', 'د.إ')
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en,
  currency_code = EXCLUDED.currency_code, currency_symbol = EXCLUDED.currency_symbol,
  is_active = TRUE;

INSERT INTO area_packages (area_id, program, package_key, name_ar, description_ar, price, currency_code, sessions_per_month, duration_minutes, is_active, sort_order)
SELECT a.id, 'quran', 'mock-quran-30-4', 'باقة اختبار السعودية/الإمارات', 'سعر اصطناعي للاختبار فقط.', v.price, v.currency, 4, 30, TRUE, 10
FROM (VALUES ('saudi-arabia', 101.00::numeric, 'SAR'), ('united-arab-emirates', 202.00::numeric, 'AED')) AS v(slug, price, currency)
JOIN site_areas a ON a.slug = v.slug
ON CONFLICT (area_id, package_key) DO UPDATE SET price = EXCLUDED.price, currency_code = EXCLUDED.currency_code, is_active = TRUE;

INSERT INTO area_faq_items (area_id, question_key, question_ar, answer_ar, is_active, sort_order)
SELECT id, 'mock-country-faq', 'سؤال تجريبي — ' || name_ar, 'إجابة اصطناعية للاختبار المعزول فقط.', TRUE, 10
FROM site_areas WHERE slug IN ('saudi-arabia', 'united-arab-emirates')
ON CONFLICT (area_id, question_key) DO UPDATE SET question_ar = EXCLUDED.question_ar, answer_ar = EXCLUDED.answer_ar, is_active = TRUE;

INSERT INTO area_links (area_id, link_key, label_ar, href, link_type, is_external, is_active, sort_order)
SELECT id, 'whatsapp', 'تواصل تجريبي', 'https://example.test/whatsapp/' || slug, 'external', TRUE, TRUE, 10
FROM site_areas WHERE slug IN ('saudi-arabia', 'united-arab-emirates')
ON CONFLICT (area_id, link_key) DO UPDATE SET href = EXCLUDED.href, is_active = TRUE;

INSERT INTO theme_customizations (id, primary_color, accent_color, background_color, foreground_color)
VALUES (1, '#123456', '#D4AF37', '#FFFFFF', '#171717')
ON CONFLICT (id) DO UPDATE SET primary_color = EXCLUDED.primary_color, accent_color = EXCLUDED.accent_color,
  background_color = EXCLUDED.background_color, foreground_color = EXCLUDED.foreground_color;

INSERT INTO widget_configs (widget_type, config_json, is_enabled, display_order)
VALUES
  ('whatsapp_button', '{"position":"right","phone":"201000000000","size":"medium","color":"#1a4d2e","showLabel":true,"labelAr":"تواصل تجريبي","labelEn":"Preview contact","labelFr":"Contact test"}'::jsonb, TRUE, 0),
  ('navbar', '{"items":["home","about","quran","arabic","teachers","reviews","library","classroom","games","faq","blog","contact","account"]}'::jsonb, TRUE, 1)
ON CONFLICT (widget_type) DO UPDATE SET config_json = EXCLUDED.config_json, is_enabled = EXCLUDED.is_enabled, display_order = EXCLUDED.display_order;

INSERT INTO landing_page_configs (slug, config_json)
VALUES
  ('saudi-arabia', '{"seo":{"title":"معاينة تجريبية — السعودية","description":"نص اصطناعي للاختبار فقط.","canonical":"https://example.test/saudi-arabia"},"heroTitle":"معاينة السعودية","heroDescription":"هذا محتوى اصطناعي للاختبار المعزول.","closingTitle":"معاينة ختامية","closingDescription":"نص تجريبي فقط."}'::jsonb),
  ('uae', '{"seo":{"title":"معاينة تجريبية — الإمارات","description":"نص اصطناعي للاختبار فقط.","canonical":"https://example.test/united-arab-emirates"},"heroTitle":"معاينة الإمارات","heroDescription":"هذا محتوى اصطناعي للاختبار المعزول.","closingTitle":"معاينة ختامية","closingDescription":"نص تجريبي فقط."}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET config_json = EXCLUDED.config_json;

INSERT INTO digital_library_documents (slug, title_ar, title_en, description_ar, category, tags, drive_url, file_type, is_published, sort_order)
VALUES ('mock-library-document', 'وثيقة مكتبة اختبارية', 'Mock library document', 'عنصر تجريبي غير منشور.', 'mock', ARRAY['preview','synthetic'], 'https://example.test/mock-document.pdf', 'pdf', FALSE, 999)
ON CONFLICT (slug) DO UPDATE SET title_ar = EXCLUDED.title_ar, title_en = EXCLUDED.title_en,
  description_ar = EXCLUDED.description_ar, drive_url = EXCLUDED.drive_url, is_published = FALSE;

COMMIT;
