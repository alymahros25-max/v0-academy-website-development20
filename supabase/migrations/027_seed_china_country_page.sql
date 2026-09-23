-- 027: Seed the isolated China landing page.
-- This migration only adds/updates rows scoped to slug = china.

INSERT INTO site_areas (slug, area_type, country_code, name_ar, name_en, name_fr, currency_code, currency_symbol)
VALUES ('china', 'country', 'CN', 'الصين', 'China', 'Chine', 'CNY', '¥')
ON CONFLICT (slug) DO UPDATE SET
  area_type = EXCLUDED.area_type,
  country_code = EXCLUDED.country_code,
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  name_fr = EXCLUDED.name_fr,
  currency_code = EXCLUDED.currency_code,
  currency_symbol = EXCLUDED.currency_symbol,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO area_content (area_id, content_key, content_ar, content_en, content_fr, content_type, section, sort_order)
SELECT id, values.content_key, values.content_ar, values.content_en, NULL, 'text', values.section, values.sort_order
FROM site_areas
JOIN (VALUES
  ('seo_title', 'تحفيظ القرآن وتعلم العربية أونلاين في الصين | أكاديمية الحافظ', 'Online Quran Learning and Arabic Foundations in China | Al-Hafiz Academy', 'seo', 0),
  ('seo_description', 'ابدأ تعلم القرآن الكريم أو تأسيس اللغة العربية أونلاين من الصين بحصص فردية وباقات شهرية واضحة باليوان الصيني. تعرّف إلى البرامج ثم اطلب الحصة التجريبية المجانية.', 'Learn Quran or Arabic foundations online from China with individual lessons and clear monthly CNY packages.', 'seo', 1),
  ('eyebrow', 'دفتر الهدف · الصين', 'Goal notebook · China', 'hero', 0),
  ('page_title', 'ابدأ من هدفك، ثم اختر وقتك، ثم اسأل', 'Start with your goal, choose your time, then ask', 'hero', 1),
  ('page_description', 'من بكين إلى شنغهاي وغوانغجو وشِنْجِن، يمكنك التعرف إلى برامج القرآن والعربية أونلاين بطريقة واضحة. اختر ما تريد تعلمه، اذكر الوقت المناسب لك، وأرسل سؤالك قبل اتخاذ القرار.', 'Explore online Quran and Arabic programmes from Beijing, Shanghai, Guangzhou, Shenzhen, and other cities.', 'hero', 2),
  ('local_lead', 'الدراسة أونلاين لا تتطلب وجود مركز في مدينتك. ابدأ من المكان الذي تعيش فيه، ثم ناقش الموعد والبرنامج عبر قناة التواصل المتاحة.', 'Online study does not require a local centre in your city.', 'local', 0),
  ('local_card_zh', '在线学习《古兰经》与阿拉伯语基础，从你的学习目标开始。', 'Online Quran and Arabic foundations, starting from your learning goal. يتم التواصل مع الأكاديمية باللغة العربية.', 'local', 1),
  ('whatsapp_number', '201130127894', '201130127894', 'contact', 0)
) AS values(content_key, content_ar, content_en, section, sort_order) ON site_areas.slug = 'china'
ON CONFLICT (area_id, content_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  section = EXCLUDED.section,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO area_packages (area_id, program, package_key, name_ar, name_en, description_ar, price, currency_code, sessions_per_month, features_ar, is_popular, is_active, sort_order)
SELECT id, values.program, values.package_key, values.name_ar, values.name_ar, values.description_ar, values.price, 'CNY', values.sessions_per_month, values.features_ar::jsonb, values.is_popular, TRUE, values.sort_order
FROM site_areas
JOIN (VALUES
  ('quran', 'quran-30-4', 'تحفيظ القرآن — 30 دقيقة — 4 حصص شهرياً', 'حصة فردية للحفظ والتسميع وتصحيح التلاوة والمراجعة.', 100, 4, '["معلمون ومعلمات","خطة حفظ ومراجعة","موعد يناسب الصين"]', FALSE, 0),
  ('quran', 'quran-30-8', 'تحفيظ القرآن — 30 دقيقة — 8 حصص شهرياً', 'حصة فردية للحفظ والتسميع وتصحيح التلاوة والمراجعة.', 187, 8, '["معلمون ومعلمات","خطة حفظ ومراجعة","موعد يناسب الصين"]', TRUE, 1),
  ('quran', 'quran-30-12', 'تحفيظ القرآن — 30 دقيقة — 12 حصة شهرياً', 'حصة فردية للحفظ والتسميع وتصحيح التلاوة والمراجعة.', 281, 12, '["معلمون ومعلمات","خطة حفظ ومراجعة","موعد يناسب الصين"]', FALSE, 2),
  ('quran', 'quran-30-16', 'تحفيظ القرآن — 30 دقيقة — 16 حصة شهرياً', 'حصة فردية للحفظ والتسميع وتصحيح التلاوة والمراجعة.', 368, 16, '["معلمون ومعلمات","خطة حفظ ومراجعة","موعد يناسب الصين"]', FALSE, 3),
  ('arabic', 'arabic-30-4', 'تأسيس اللغة العربية — 30 دقيقة — 4 حصص شهرياً', 'حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.', 133, 4, '["معلمون ومعلمات","قراءة وكتابة وفهم","متابعة تناسب المستوى"]', FALSE, 0),
  ('arabic', 'arabic-30-8', 'تأسيس اللغة العربية — 30 دقيقة — 8 حصص شهرياً', 'حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.', 241, 8, '["معلمون ومعلمات","قراءة وكتابة وفهم","متابعة تناسب المستوى"]', TRUE, 1),
  ('arabic', 'arabic-30-12', 'تأسيس اللغة العربية — 30 دقيقة — 12 حصة شهرياً', 'حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.', 361, 12, '["معلمون ومعلمات","قراءة وكتابة وفهم","متابعة تناسب المستوى"]', FALSE, 2),
  ('arabic', 'arabic-30-16', 'تأسيس اللغة العربية — 30 دقيقة — 16 حصة شهرياً', 'حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.', 482, 16, '["معلمون ومعلمات","قراءة وكتابة وفهم","متابعة تناسب المستوى"]', FALSE, 3)
) AS values(program, package_key, name_ar, description_ar, price, sessions_per_month, features_ar, is_popular, sort_order) ON site_areas.slug = 'china'
ON CONFLICT (area_id, package_key) DO UPDATE SET
  program = EXCLUDED.program,
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  description_ar = EXCLUDED.description_ar,
  price = EXCLUDED.price,
  currency_code = EXCLUDED.currency_code,
  sessions_per_month = EXCLUDED.sessions_per_month,
  features_ar = EXCLUDED.features_ar,
  is_popular = EXCLUDED.is_popular,
  is_active = TRUE,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO area_faq_items (area_id, question_key, question_ar, question_en, answer_ar, answer_en, sort_order)
SELECT id, values.question_key, values.question_ar, values.question_ar, values.answer_ar, values.answer_ar, values.sort_order
FROM site_areas
JOIN (VALUES
  ('china-faq-1', 'هل يمكنني الدراسة من بكين أو شنغهاي أو مدينة أخرى؟', 'نعم، الصفحة مخصصة للتعلم أونلاين، ويمكنك ذكر مدينتك عند التواصل حتى نناقش الوقت المتاح. لا يعني ذلك وجود مركز محلي في المدينة.', 0),
  ('china-faq-2', 'هل أحتاج إلى معرفة العربية قبل البدء؟', 'يمكنك البدء من مستواك الحالي. اذكر مستواك وهدفك التعليمي عند التواصل باللغة العربية.', 1),
  ('china-faq-3', 'هل الأسعار باليوان الصيني؟', 'نعم، الأسعار المعروضة في هذه الصفحة باليوان الصيني للباقات الموضحة.', 2),
  ('china-faq-4', 'بأي لغة يتم التواصل مع الأكاديمية؟', 'يتم التواصل مع الأكاديمية باللغة العربية.', 3),
  ('china-faq-5', 'هل توجد باقات مخصصة؟', 'يوجد باقات مخصصة. اسأل عن التفاصيل بعد الحصة التجريبية.', 4)
) AS values(question_key, question_ar, answer_ar, sort_order) ON site_areas.slug = 'china'
ON CONFLICT (area_id, question_key) DO UPDATE SET
  question_ar = EXCLUDED.question_ar,
  question_en = EXCLUDED.question_en,
  answer_ar = EXCLUDED.answer_ar,
  answer_en = EXCLUDED.answer_en,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO area_links (area_id, link_key, label_ar, label_en, href, link_type, is_external, sort_order)
SELECT id, values.link_key, values.label_ar, values.label_ar, values.href, values.link_type, values.is_external, values.sort_order
FROM site_areas
JOIN (VALUES
  ('canonical', 'الصفحة الرسمية', 'https://quran-elhafez.com/china', 'canonical', TRUE, 0),
  ('whatsapp', 'واتساب', 'https://bit.ly/4aJfOl6', 'external', TRUE, 1),
  ('home', 'الرئيسية', '/', 'internal', FALSE, 2),
  ('games', 'الألعاب والمسابقات', '/games', 'internal', FALSE, 3),
  ('library', 'المكتبة', '/library', 'internal', FALSE, 4)
) AS values(link_key, label_ar, href, link_type, is_external, sort_order) ON site_areas.slug = 'china'
ON CONFLICT (area_id, link_key) DO UPDATE SET
  label_ar = EXCLUDED.label_ar,
  href = EXCLUDED.href,
  link_type = EXCLUDED.link_type,
  is_external = EXCLUDED.is_external,
  is_active = TRUE,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO area_themes (area_id, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color)
SELECT id, 'هوية الصين الورقية', 'China paper and jade identity', '#7E1F27', '#E8D7BC', '#C9953D', '#F7F0E3', '#211A18'
FROM site_areas WHERE slug = 'china'
ON CONFLICT (area_id) DO UPDATE SET
  theme_name_ar = EXCLUDED.theme_name_ar,
  theme_name_en = EXCLUDED.theme_name_en,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  background_color = EXCLUDED.background_color,
  text_color = EXCLUDED.text_color,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO area_cities (area_id, city_key, name_ar, name_en, region_name, sort_order)
SELECT id, values.city_key, values.name_ar, values.name_en, values.region_name, values.sort_order
FROM site_areas
JOIN (VALUES
  ('beijing', 'بكين', 'Beijing', 'Beijing', 10),
  ('shanghai', 'شنغهاي', 'Shanghai', 'Shanghai', 20),
  ('guangzhou', 'غوانغجو', 'Guangzhou', 'Guangdong', 30),
  ('shenzhen', 'شِنْجِن', 'Shenzhen', 'Guangdong', 40)
) AS values(city_key, name_ar, name_en, region_name, sort_order) ON site_areas.slug = 'china'
ON CONFLICT (area_id, city_key) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  region_name = EXCLUDED.region_name,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO area_timezones (area_id, timezone_name, label_ar, label_en, is_primary, sort_order)
SELECT id, 'Asia/Shanghai', 'توقيت الصين القياسي (UTC+08:00)', 'China Standard Time (UTC+08:00)', TRUE, 10
FROM site_areas WHERE slug = 'china'
ON CONFLICT (area_id, timezone_name) DO UPDATE SET
  label_ar = EXCLUDED.label_ar,
  label_en = EXCLUDED.label_en,
  is_primary = TRUE,
  is_active = TRUE,
  updated_at = NOW();
