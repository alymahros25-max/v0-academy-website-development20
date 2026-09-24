-- 030: Seed the isolated Norway landing page.
-- This migration only adds or updates rows scoped to slug = norway.

INSERT INTO site_areas (slug, area_type, country_code, name_ar, name_en, name_fr, currency_code, currency_symbol)
VALUES ('norway', 'country', 'NO', 'النرويج', 'Norway', 'Norvège', 'NOK', 'kr')
ON CONFLICT (slug) DO UPDATE SET area_type = EXCLUDED.area_type, country_code = EXCLUDED.country_code, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, name_fr = EXCLUDED.name_fr, currency_code = EXCLUDED.currency_code, currency_symbol = EXCLUDED.currency_symbol, is_active = TRUE, updated_at = NOW();

INSERT INTO area_content (area_id, content_key, content_ar, content_en, content_fr, content_type, section, sort_order)
SELECT id, values.content_key, values.content_ar, values.content_en, NULL, 'text', values.section, values.sort_order
FROM site_areas
JOIN (VALUES
  ('seo_title', 'تحفيظ القرآن وتأسيس العربية أونلاين في النرويج | أكاديمية الحافظ', 'Online Quran and Arabic Foundations in Norway | Al-Hafiz Academy', 'seo', 0),
  ('seo_description', 'تعلّم القرآن الكريم أو تأسيس اللغة العربية أونلاين من النرويج بحصص فردية وباقات شهرية واضحة بالكرونة النرويجية. ابدأ بالحصة التجريبية وتواصل معنا باللغة العربية.', 'Learn Quran or Arabic foundations online from Norway with individual lessons and monthly NOK packages.', 'seo', 1),
  ('page_title', 'خطوة هادئة تبني عادة للقرآن والعربية', 'A quiet step toward a Quran and Arabic habit', 'opening', 0),
  ('page_description', 'من أوسلو وبيرغن إلى تروندهايم وستافنجر، ابدأ بتحديد هدفك ووقتك ثم تعرّف إلى المسار والباقات الشهرية وتواصل معنا باللغة العربية.', 'From Oslo and Bergen to Trondheim and Stavanger, clarify your goal and schedule before choosing a monthly plan.', 'opening', 1),
  ('local_card_no', 'Quran på nett og grunnleggende arabisk i Norge. Al-Hafiz Academy tilbyr individuelle nettleksjoner i koranmemorering og grunnleggende arabisk. Koranstudium og arabiskundervisning for arabisktalende elever. Kontakt med akademiet foregår på arabisk.', 'Quran online and Arabic foundations in Norway. Al-Hafiz Academy offers individual online lessons. For Arabic-speaking students: Quran study and Arabic teaching. Contact takes place in Arabic.', 'local', 0),
  ('custom_packages', 'يوجد باقات مخصصة.', 'Custom packages are available.', 'pricing', 0),
  ('whatsapp_number', '201130127894', '201130127894', 'contact', 0)
) AS values(content_key, content_ar, content_en, section, sort_order) ON site_areas.slug = 'norway'
ON CONFLICT (area_id, content_key) DO UPDATE SET content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, section = EXCLUDED.section, sort_order = EXCLUDED.sort_order, is_active = TRUE, updated_at = NOW();

INSERT INTO area_packages (area_id, program, package_key, name_ar, name_en, description_ar, price, currency_code, sessions_per_month, features_ar, is_popular, is_active, sort_order)
SELECT id, values.program, values.package_key, values.name_ar, values.name_ar, values.description_ar, values.price, 'NOK', values.sessions_per_month, values.features_ar::jsonb, values.is_popular, TRUE, values.sort_order
FROM site_areas
JOIN (VALUES
  ('quran', 'quran-30-4', 'تحفيظ القرآن — 30 دقيقة — 4 حصص شهرياً', 'حصة فردية للحفظ والتسميع والمراجعة.', 142, 4, '["حفظ ومراجعة","روتين شهري","تواصل بالعربية"]', FALSE, 0),
  ('quran', 'quran-30-8', 'تحفيظ القرآن — 30 دقيقة — 8 حصص شهرياً', 'حصة فردية للحفظ والتسميع والمراجعة.', 265, 8, '["حفظ ومراجعة","روتين شهري","تواصل بالعربية"]', TRUE, 1),
  ('quran', 'quran-30-12', 'تحفيظ القرآن — 30 دقيقة — 12 حصة شهرياً', 'حصة فردية للحفظ والتسميع والمراجعة.', 398, 12, '["حفظ ومراجعة","روتين شهري","تواصل بالعربية"]', FALSE, 2),
  ('quran', 'quran-30-16', 'تحفيظ القرآن — 30 دقيقة — 16 حصة شهرياً', 'حصة فردية للحفظ والتسميع والمراجعة.', 521, 16, '["حفظ ومراجعة","روتين شهري","تواصل بالعربية"]', FALSE, 3),
  ('arabic', 'arabic-30-4', 'تأسيس اللغة العربية — 30 دقيقة — 4 حصص شهرياً', 'حصة فردية لبناء أساس القراءة والفهم بالعربية.', 189, 4, '["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]', FALSE, 0),
  ('arabic', 'arabic-30-8', 'تأسيس اللغة العربية — 30 دقيقة — 8 حصص شهرياً', 'حصة فردية لبناء أساس القراءة والفهم بالعربية.', 341, 8, '["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]', TRUE, 1),
  ('arabic', 'arabic-30-12', 'تأسيس اللغة العربية — 30 دقيقة — 12 حصة شهرياً', 'حصة فردية لبناء أساس القراءة والفهم بالعربية.', 511, 12, '["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]', FALSE, 2),
  ('arabic', 'arabic-30-16', 'تأسيس اللغة العربية — 30 دقيقة — 16 حصة شهرياً', 'حصة فردية لبناء أساس القراءة والفهم بالعربية.', 682, 16, '["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]', FALSE, 3)
) AS values(program, package_key, name_ar, description_ar, price, sessions_per_month, features_ar, is_popular, sort_order) ON site_areas.slug = 'norway'
ON CONFLICT (area_id, package_key) DO UPDATE SET program = EXCLUDED.program, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, description_ar = EXCLUDED.description_ar, price = EXCLUDED.price, currency_code = EXCLUDED.currency_code, sessions_per_month = EXCLUDED.sessions_per_month, features_ar = EXCLUDED.features_ar, is_popular = EXCLUDED.is_popular, is_active = TRUE, sort_order = EXCLUDED.sort_order, updated_at = NOW();

INSERT INTO area_faq_items (area_id, question_key, question_ar, question_en, answer_ar, answer_en, sort_order)
SELECT id, values.question_key, values.question_ar, values.question_ar, values.answer_ar, values.answer_ar, values.sort_order
FROM site_areas
JOIN (VALUES
  ('norway-faq-1', 'هل أستطيع الدراسة من أوسلو أو مدينة نرويجية أخرى؟', 'نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. ذكر المدينة يوضح نطاق الصفحة ولا يعني وجود فرع محلي.', 0),
  ('norway-faq-2', 'كيف أنظم وقت الحصة مع توقيت النرويج؟', 'تستخدم الصفحة توقيت أوسلو، ويُنسق الموعد باللغة العربية وفق الوقت المتاح عند التواصل.', 1),
  ('norway-faq-3', 'هل الأسعار بالكرونة النرويجية؟', 'نعم، الأسعار الظاهرة في صفحة النرويج بالكرونة النرويجية للباقات الموضحة.', 2),
  ('norway-faq-4', 'هل توجد باقات مخصصة؟', 'يوجد باقات مخصصة.', 3),
  ('norway-faq-5', 'بأي لغة يتم التواصل مع الأكاديمية؟', 'يتم التواصل مع الأكاديمية باللغة العربية.', 4)
) AS values(question_key, question_ar, answer_ar, sort_order) ON site_areas.slug = 'norway'
ON CONFLICT (area_id, question_key) DO UPDATE SET question_ar = EXCLUDED.question_ar, question_en = EXCLUDED.question_en, answer_ar = EXCLUDED.answer_ar, answer_en = EXCLUDED.answer_en, sort_order = EXCLUDED.sort_order, is_active = TRUE, updated_at = NOW();

INSERT INTO area_links (area_id, link_key, label_ar, label_en, href, link_type, is_external, sort_order)
SELECT id, values.link_key, values.label_ar, values.label_ar, values.href, values.link_type, values.is_external, values.sort_order
FROM site_areas
JOIN (VALUES
  ('canonical', 'الصفحة الرسمية', 'https://quran-elhafez.com/norway', 'canonical', TRUE, 0),
  ('whatsapp', 'واتساب', 'https://bit.ly/4aJfOl6', 'external', TRUE, 1),
  ('home', 'الرئيسية', '/', 'internal', FALSE, 2),
  ('games', 'الألعاب والمسابقات', '/games', 'internal', FALSE, 3),
  ('library', 'المكتبة', '/library', 'internal', FALSE, 4)
) AS values(link_key, label_ar, href, link_type, is_external, sort_order) ON site_areas.slug = 'norway'
ON CONFLICT (area_id, link_key) DO UPDATE SET label_ar = EXCLUDED.label_ar, href = EXCLUDED.href, link_type = EXCLUDED.link_type, is_external = EXCLUDED.is_external, is_active = TRUE, sort_order = EXCLUDED.sort_order, updated_at = NOW();

INSERT INTO area_themes (area_id, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color)
SELECT id, 'دفتر يوميات النرويج', 'Norway quiet diary', '#234B5A', '#C7D5D8', '#C5965A', '#F4F8F7', '#234B5A'
FROM site_areas WHERE slug = 'norway'
ON CONFLICT (area_id) DO UPDATE SET theme_name_ar = EXCLUDED.theme_name_ar, theme_name_en = EXCLUDED.theme_name_en, primary_color = EXCLUDED.primary_color, secondary_color = EXCLUDED.secondary_color, accent_color = EXCLUDED.accent_color, background_color = EXCLUDED.background_color, text_color = EXCLUDED.text_color, is_active = TRUE, updated_at = NOW();

INSERT INTO area_cities (area_id, city_key, name_ar, name_en, region_name, sort_order)
SELECT id, values.city_key, values.name_ar, values.name_en, values.region_name, values.sort_order
FROM site_areas
JOIN (VALUES
  ('oslo', 'أوسلو', 'Oslo', 'Oslo', 10),
  ('bergen', 'بيرغن', 'Bergen', 'Vestland', 20),
  ('trondheim', 'تروندهايم', 'Trondheim', 'Trøndelag', 30),
  ('stavanger', 'ستافنجر', 'Stavanger', 'Rogaland', 40)
) AS values(city_key, name_ar, name_en, region_name, sort_order) ON site_areas.slug = 'norway'
ON CONFLICT (area_id, city_key) DO UPDATE SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, region_name = EXCLUDED.region_name, sort_order = EXCLUDED.sort_order, is_active = TRUE;

INSERT INTO area_timezones (area_id, timezone_name, label_ar, label_en, is_primary, sort_order)
SELECT id, 'Europe/Oslo', 'توقيت أوسلو (Europe/Oslo، UTC+01:00 / UTC+02:00 صيفًا)', 'Oslo Time (Europe/Oslo)', TRUE, 10
FROM site_areas WHERE slug = 'norway'
ON CONFLICT (area_id, timezone_name) DO UPDATE SET label_ar = EXCLUDED.label_ar, label_en = EXCLUDED.label_en, is_primary = TRUE, is_active = TRUE, updated_at = NOW();
