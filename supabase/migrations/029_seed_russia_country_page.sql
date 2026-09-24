-- 029: Seed the isolated Russia landing page.
-- This migration only adds or updates rows scoped to slug = russia.

INSERT INTO site_areas (slug, area_type, country_code, name_ar, name_en, name_fr, currency_code, currency_symbol)
VALUES ('russia', 'country', 'RU', 'روسيا', 'Russia', 'Russie', 'RUB', '₽')
ON CONFLICT (slug) DO UPDATE SET area_type = EXCLUDED.area_type, country_code = EXCLUDED.country_code, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, name_fr = EXCLUDED.name_fr, currency_code = EXCLUDED.currency_code, currency_symbol = EXCLUDED.currency_symbol, is_active = TRUE, updated_at = NOW();

INSERT INTO area_content (area_id, content_key, content_ar, content_en, content_fr, content_type, section, sort_order)
SELECT id, values.content_key, values.content_ar, values.content_en, NULL, 'text', values.section, values.sort_order
FROM site_areas
JOIN (VALUES
  ('seo_title', 'تحفيظ القرآن وتأسيس العربية أونلاين في روسيا | أكاديمية الحافظ', 'Online Quran and Arabic Foundations in Russia | Al-Hafiz Academy', 'seo', 0),
  ('seo_description', 'تعلّم القرآن الكريم أو تأسيس اللغة العربية أونلاين من روسيا بحصص فردية وباقات شهرية واضحة بالروبل الروسي. ابدأ بالحصة التجريبية وتواصل معنا باللغة العربية.', 'Learn Quran or Arabic foundations online from Russia with individual lessons and monthly RUB packages.', 'seo', 1),
  ('page_title', 'مساحة هادئة للقرآن وبداية منظمة للعربية', 'A quiet space for Quran and a clear start in Arabic', 'opening', 0),
  ('page_description', 'من موسكو وسانت بطرسبرغ إلى قازان ونوفوسيبيرسك، ابدأ بتحديد هدفك ووقتك ثم تعرّف إلى البرنامج والباقات الشهرية وتواصل معنا باللغة العربية.', 'From Moscow and Saint Petersburg to Kazan and Novosibirsk, clarify your goal and schedule before choosing a monthly plan.', 'opening', 1),
  ('local_card_ru', 'Коран онлайн и основы арабского языка в России. Академия Аль-Хафиз предлагает индивидуальные онлайн-занятия. Заучивание Корана и обучение арабскому языку для арабоязычных учащихся. Общение с академией проходит на арабском языке.', 'Quran online and Arabic foundations in Russia. Al-Hafiz Academy offers individual online lessons. For Arabic-speaking students: Quran memorization and Arabic teaching. Contact takes place in Arabic.', 'local', 0),
  ('custom_packages', 'يوجد باقات مخصصة.', 'Custom packages are available.', 'pricing', 0),
  ('whatsapp_number', '201130127894', '201130127894', 'contact', 0)
) AS values(content_key, content_ar, content_en, section, sort_order) ON site_areas.slug = 'russia'
ON CONFLICT (area_id, content_key) DO UPDATE SET content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, section = EXCLUDED.section, sort_order = EXCLUDED.sort_order, is_active = TRUE, updated_at = NOW();

INSERT INTO area_packages (area_id, program, package_key, name_ar, name_en, description_ar, price, currency_code, sessions_per_month, features_ar, is_popular, is_active, sort_order)
SELECT id, values.program, values.package_key, values.name_ar, values.name_ar, values.description_ar, values.price, 'RUB', values.sessions_per_month, values.features_ar::jsonb, values.is_popular, TRUE, values.sort_order
FROM site_areas
JOIN (VALUES
  ('quran', 'quran-30-4', 'تحفيظ القرآن — 30 دقيقة — 4 حصص شهرياً', 'حصة فردية للحفظ والتسميع والمراجعة.', 1278, 4, '["حفظ ومراجعة","روتين شهري","تواصل بالعربية"]', FALSE, 0),
  ('quran', 'quran-30-8', 'تحفيظ القرآن — 30 دقيقة — 8 حصص شهرياً', 'حصة فردية للحفظ والتسميع والمراجعة.', 2387, 8, '["حفظ ومراجعة","روتين شهري","تواصل بالعربية"]', TRUE, 1),
  ('quran', 'quran-30-12', 'تحفيظ القرآن — 30 دقيقة — 12 حصة شهرياً', 'حصة فردية للحفظ والتسميع والمراجعة.', 3580, 12, '["حفظ ومراجعة","روتين شهري","تواصل بالعربية"]', FALSE, 2),
  ('quran', 'quran-30-16', 'تحفيظ القرآن — 30 دقيقة — 16 حصة شهرياً', 'حصة فردية للحفظ والتسميع والمراجعة.', 4688, 16, '["حفظ ومراجعة","روتين شهري","تواصل بالعربية"]', FALSE, 3),
  ('arabic', 'arabic-30-4', 'تأسيس اللغة العربية — 30 دقيقة — 4 حصص شهرياً', 'حصة فردية لبناء أساس القراءة والفهم بالعربية.', 1705, 4, '["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]', FALSE, 0),
  ('arabic', 'arabic-30-8', 'تأسيس اللغة العربية — 30 دقيقة — 8 حصص شهرياً', 'حصة فردية لبناء أساس القراءة والفهم بالعربية.', 3069, 8, '["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]', TRUE, 1),
  ('arabic', 'arabic-30-12', 'تأسيس اللغة العربية — 30 دقيقة — 12 حصة شهرياً', 'حصة فردية لبناء أساس القراءة والفهم بالعربية.', 4603, 12, '["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]', FALSE, 2),
  ('arabic', 'arabic-30-16', 'تأسيس اللغة العربية — 30 دقيقة — 16 حصة شهرياً', 'حصة فردية لبناء أساس القراءة والفهم بالعربية.', 6138, 16, '["قراءة وفهم","أساس تدريجي","تواصل بالعربية"]', FALSE, 3)
) AS values(program, package_key, name_ar, description_ar, price, sessions_per_month, features_ar, is_popular, sort_order) ON site_areas.slug = 'russia'
ON CONFLICT (area_id, package_key) DO UPDATE SET program = EXCLUDED.program, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, description_ar = EXCLUDED.description_ar, price = EXCLUDED.price, currency_code = EXCLUDED.currency_code, sessions_per_month = EXCLUDED.sessions_per_month, features_ar = EXCLUDED.features_ar, is_popular = EXCLUDED.is_popular, is_active = TRUE, sort_order = EXCLUDED.sort_order, updated_at = NOW();

INSERT INTO area_faq_items (area_id, question_key, question_ar, question_en, answer_ar, answer_en, sort_order)
SELECT id, values.question_key, values.question_ar, values.question_ar, values.answer_ar, values.answer_ar, values.sort_order
FROM site_areas
JOIN (VALUES
  ('russia-faq-1', 'هل أستطيع الدراسة من موسكو أو مدينة روسية أخرى؟', 'نعم، الدراسة أونلاين، ويمكنك ذكر مدينتك عند التواصل باللغة العربية. ذكر المدينة يوضح نطاق الصفحة ولا يعني وجود فرع محلي.', 0),
  ('russia-faq-2', 'كيف أختار عدد الحصص؟', 'قارن بين الباقات الشهرية حسب الهدف والوقت المتاح، ثم تواصل معنا باللغة العربية لمعرفة المسار المناسب.', 1),
  ('russia-faq-3', 'هل الأسعار بالروبل الروسي؟', 'نعم، الأسعار الظاهرة في صفحة روسيا بالروبل الروسي للباقات الموضحة.', 2),
  ('russia-faq-4', 'هل توجد باقات مخصصة؟', 'يوجد باقات مخصصة.', 3),
  ('russia-faq-5', 'بأي لغة يتم التواصل مع الأكاديمية؟', 'يتم التواصل مع الأكاديمية باللغة العربية.', 4)
) AS values(question_key, question_ar, answer_ar, sort_order) ON site_areas.slug = 'russia'
ON CONFLICT (area_id, question_key) DO UPDATE SET question_ar = EXCLUDED.question_ar, question_en = EXCLUDED.question_en, answer_ar = EXCLUDED.answer_ar, answer_en = EXCLUDED.answer_en, sort_order = EXCLUDED.sort_order, is_active = TRUE, updated_at = NOW();

INSERT INTO area_links (area_id, link_key, label_ar, label_en, href, link_type, is_external, sort_order)
SELECT id, values.link_key, values.label_ar, values.label_ar, values.href, values.link_type, values.is_external, values.sort_order
FROM site_areas
JOIN (VALUES
  ('canonical', 'الصفحة الرسمية', 'https://quran-elhafez.com/russia', 'canonical', TRUE, 0),
  ('whatsapp', 'واتساب', 'https://bit.ly/4aJfOl6', 'external', TRUE, 1),
  ('home', 'الرئيسية', '/', 'internal', FALSE, 2),
  ('games', 'الألعاب والمسابقات', '/games', 'internal', FALSE, 3),
  ('library', 'المكتبة', '/library', 'internal', FALSE, 4)
) AS values(link_key, label_ar, href, link_type, is_external, sort_order) ON site_areas.slug = 'russia'
ON CONFLICT (area_id, link_key) DO UPDATE SET label_ar = EXCLUDED.label_ar, href = EXCLUDED.href, link_type = EXCLUDED.link_type, is_external = EXCLUDED.is_external, is_active = TRUE, sort_order = EXCLUDED.sort_order, updated_at = NOW();

INSERT INTO area_themes (area_id, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color)
SELECT id, 'الغلاف القطبي الروسي', 'Russian polar cover', '#162B45', '#C9D6DC', '#B56B45', '#EAF4F7', '#162B45'
FROM site_areas WHERE slug = 'russia'
ON CONFLICT (area_id) DO UPDATE SET theme_name_ar = EXCLUDED.theme_name_ar, theme_name_en = EXCLUDED.theme_name_en, primary_color = EXCLUDED.primary_color, secondary_color = EXCLUDED.secondary_color, accent_color = EXCLUDED.accent_color, background_color = EXCLUDED.background_color, text_color = EXCLUDED.text_color, is_active = TRUE, updated_at = NOW();

INSERT INTO area_cities (area_id, city_key, name_ar, name_en, region_name, sort_order)
SELECT id, values.city_key, values.name_ar, values.name_en, values.region_name, values.sort_order
FROM site_areas
JOIN (VALUES
  ('moscow', 'موسكو', 'Moscow', 'Moscow', 10),
  ('saint-petersburg', 'سانت بطرسبرغ', 'Saint Petersburg', 'Northwestern Federal District', 20),
  ('kazan', 'قازان', 'Kazan', 'Tatarstan', 30),
  ('novosibirsk', 'نوفوسيبيرسك', 'Novosibirsk', 'Siberian Federal District', 40)
) AS values(city_key, name_ar, name_en, region_name, sort_order) ON site_areas.slug = 'russia'
ON CONFLICT (area_id, city_key) DO UPDATE SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, region_name = EXCLUDED.region_name, sort_order = EXCLUDED.sort_order, is_active = TRUE;

INSERT INTO area_timezones (area_id, timezone_name, label_ar, label_en, is_primary, sort_order)
SELECT id, 'Europe/Moscow', 'توقيت موسكو (Europe/Moscow، UTC+03:00)', 'Moscow Time (Europe/Moscow, UTC+03:00)', TRUE, 10
FROM site_areas WHERE slug = 'russia'
ON CONFLICT (area_id, timezone_name) DO UPDATE SET label_ar = EXCLUDED.label_ar, label_en = EXCLUDED.label_en, is_primary = TRUE, is_active = TRUE, updated_at = NOW();
