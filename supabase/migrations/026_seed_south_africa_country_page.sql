-- 026: Seed the isolated South Africa landing page.
-- This migration only adds/updates rows scoped to slug = south-africa.

INSERT INTO site_areas (slug, area_type, country_code, name_ar, name_en, name_fr, currency_code, currency_symbol)
VALUES ('south-africa', 'country', 'ZA', 'جنوب أفريقيا', 'South Africa', 'Afrique du Sud', 'ZAR', 'R')
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
  ('seo_title', 'تحفيظ القرآن وتأسيس العربية أونلاين في جنوب أفريقيا | أكاديمية الحافظ', 'Online Quran Memorisation and Arabic Foundations in South Africa | Al-Hafiz Academy', 'seo', 0),
  ('seo_description', 'تعلّم القرآن الكريم أو أسس اللغة العربية أونلاين من جنوب أفريقيا بحصص فردية مدتها 30 دقيقة وباقات شهرية واضحة بالراند الجنوب أفريقي. ابدأ بحصة تجريبية مجانية واسأل عن الباقة المناسبة.', 'Learn Quran memorisation or Arabic foundations online from South Africa with individual 30-minute lessons and clear monthly ZAR packages.', 'seo', 1),
  ('eyebrow', 'Quran memorisation and Arabic foundations online for families in South Africa.', 'Quran memorisation and Arabic foundations online for families in South Africa.', 'hero', 0),
  ('page_title', 'رتّب وقت القرآن داخل أسبوعك في جنوب أفريقيا', 'Build a Quran and Arabic learning routine in South Africa', 'hero', 1),
  ('page_description', 'بين الدراسة والعمل والأسرة، لا يحتاج التعلم إلى موعد مثالي بقدر ما يحتاج إلى وقت يمكن المحافظة عليه. اختر هدفك، تعرّف إلى الباقة المناسبة، ثم تحدث معنا لتحديد الخطوة التالية.', 'Choose a realistic time, understand the available path, and speak with the academy about the next step.', 'hero', 2),
  ('local_lead', 'إذا كنت في جوهانسبرغ أو كيب تاون أو ديربان أو بريتوريا، فالدراسة الأونلاين تمنحك فرصة اختيار موعد يناسب جدول الأسرة دون الحاجة إلى الانتقال إلى مركز تعليمي.', 'Families in Johannesburg, Cape Town, Durban, Pretoria, and other cities can study online with a schedule coordinated around their routine.', 'local', 0),
  ('whatsapp_number', '201130127894', '201130127894', 'contact', 0)
) AS values(content_key, content_ar, content_en, section, sort_order) ON site_areas.slug = 'south-africa'
ON CONFLICT (area_id, content_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  section = EXCLUDED.section,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO area_packages (area_id, program, package_key, name_ar, name_en, description_ar, price, currency_code, sessions_per_month, features_ar, is_popular, is_active, sort_order)
SELECT id, values.program, values.package_key, values.name_ar, values.name_ar, values.description_ar, values.price, 'ZAR', values.sessions_per_month, values.features_ar::jsonb, values.is_popular, TRUE, values.sort_order
FROM site_areas
JOIN (VALUES
  ('quran', 'quran-30-4', 'تحفيظ القرآن — 30 دقيقة — 4 حصص شهرياً', 'حصة فردية للحفظ والتسميع وتصحيح التلاوة والمراجعة.', 243, 4, '["معلمون ومعلمات","خطة حفظ ومراجعة","موعد يناسب جنوب أفريقيا"]', FALSE, 0),
  ('quran', 'quran-30-8', 'تحفيظ القرآن — 30 دقيقة — 8 حصص شهرياً', 'حصة فردية للحفظ والتسميع وتصحيح التلاوة والمراجعة.', 454, 8, '["معلمون ومعلمات","خطة حفظ ومراجعة","موعد يناسب جنوب أفريقيا"]', TRUE, 1),
  ('quran', 'quran-30-12', 'تحفيظ القرآن — 30 دقيقة — 12 حصة شهرياً', 'حصة فردية للحفظ والتسميع وتصحيح التلاوة والمراجعة.', 681, 12, '["معلمون ومعلمات","خطة حفظ ومراجعة","موعد يناسب جنوب أفريقيا"]', FALSE, 2),
  ('quran', 'quran-30-16', 'تحفيظ القرآن — 30 دقيقة — 16 حصة شهرياً', 'حصة فردية للحفظ والتسميع وتصحيح التلاوة والمراجعة.', 893, 16, '["معلمون ومعلمات","خطة حفظ ومراجعة","موعد يناسب جنوب أفريقيا"]', FALSE, 3),
  ('arabic', 'arabic-30-4', 'تأسيس اللغة العربية — 30 دقيقة — 4 حصص شهرياً', 'حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.', 324, 4, '["معلمون ومعلمات","قراءة وكتابة ونطق","متابعة تناسب المستوى"]', FALSE, 0),
  ('arabic', 'arabic-30-8', 'تأسيس اللغة العربية — 30 دقيقة — 8 حصص شهرياً', 'حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.', 584, 8, '["معلمون ومعلمات","قراءة وكتابة ونطق","متابعة تناسب المستوى"]', TRUE, 1),
  ('arabic', 'arabic-30-12', 'تأسيس اللغة العربية — 30 دقيقة — 12 حصة شهرياً', 'حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.', 876, 12, '["معلمون ومعلمات","قراءة وكتابة ونطق","متابعة تناسب المستوى"]', FALSE, 2),
  ('arabic', 'arabic-30-16', 'تأسيس اللغة العربية — 30 دقيقة — 16 حصة شهرياً', 'حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.', 1169, 16, '["معلمون ومعلمات","قراءة وكتابة ونطق","متابعة تناسب المستوى"]', FALSE, 3)
) AS values(program, package_key, name_ar, description_ar, price, sessions_per_month, features_ar, is_popular, sort_order) ON site_areas.slug = 'south-africa'
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
  ('south-africa-faq-1', 'هل أستطيع الدراسة من أي مدينة في جنوب أفريقيا؟', 'نعم، الخدمة أونلاين، ويمكنك بدء الاستفسار من جوهانسبرغ أو كيب تاون أو ديربان أو بريتوريا أو أي مدينة أخرى. يتوقف الموعد النهائي على الأوقات المتاحة عند التواصل.', 0),
  ('south-africa-faq-2', 'هل أختار الباقة قبل الحصة التجريبية؟', 'يمكنك الاطلاع على الباقات مسبقًا، لكن الحصة التجريبية تساعدك على تحديد المستوى والهدف ثم سؤال الفريق عن الاختيار الأنسب.', 1),
  ('south-africa-faq-3', 'هل الأسعار بالراند الجنوب أفريقي؟', 'نعم، الأسعار المعروضة في هذه الصفحة بالراند الجنوب أفريقي، وقد تحتاج إلى إعادة التحقق منها عند اعتماد الصفحة النهائي.', 2),
  ('south-africa-faq-4', 'هل توجد باقات مخصصة؟', 'يوجد باقات مخصصة. تواصل معنا بعد الحصة التجريبية لمعرفة التفاصيل المتاحة.', 3),
  ('south-africa-faq-5', 'هل أستطيع اختيار القرآن أو العربية؟', 'نعم، يمكنك اختيار برنامج تحفيظ القرآن أو برنامج تأسيس العربية، ثم توضيح هدفك في رسالة التواصل.', 4)
) AS values(question_key, question_ar, answer_ar, sort_order) ON site_areas.slug = 'south-africa'
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
  ('canonical', 'الصفحة الرسمية', 'https://quran-elhafez.com/south-africa', 'canonical', TRUE, 0),
  ('whatsapp', 'واتساب', 'https://bit.ly/4aJfOl6', 'external', TRUE, 1),
  ('home', 'الرئيسية', '/', 'internal', FALSE, 2),
  ('games', 'الألعاب والمسابقات', '/games', 'internal', FALSE, 3),
  ('library', 'المكتبة', '/library', 'internal', FALSE, 4)
) AS values(link_key, label_ar, href, link_type, is_external, sort_order) ON site_areas.slug = 'south-africa'
ON CONFLICT (area_id, link_key) DO UPDATE SET
  label_ar = EXCLUDED.label_ar,
  href = EXCLUDED.href,
  link_type = EXCLUDED.link_type,
  is_external = EXCLUDED.is_external,
  is_active = TRUE,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO area_themes (area_id, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color)
SELECT id, 'هوية جنوب أفريقيا الترابية', 'South African earth identity', '#12372A', '#E8D9BF', '#D8873D', '#F7F1E5', '#17251E'
FROM site_areas WHERE slug = 'south-africa'
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
  ('johannesburg', 'جوهانسبرغ', 'Johannesburg', 'Gauteng', 10),
  ('cape-town', 'كيب تاون', 'Cape Town', 'Western Cape', 20),
  ('durban', 'ديربان', 'Durban', 'KwaZulu-Natal', 30),
  ('pretoria', 'بريتوريا', 'Pretoria', 'Gauteng', 40)
) AS values(city_key, name_ar, name_en, region_name, sort_order) ON site_areas.slug = 'south-africa'
ON CONFLICT (area_id, city_key) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  region_name = EXCLUDED.region_name,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO area_timezones (area_id, timezone_name, label_ar, label_en, is_primary, sort_order)
SELECT id, 'Africa/Johannesburg', 'توقيت جنوب أفريقيا القياسي (UTC+02:00)', 'South Africa Standard Time (UTC+02:00)', TRUE, 10
FROM site_areas WHERE slug = 'south-africa'
ON CONFLICT (area_id, timezone_name) DO UPDATE SET
  label_ar = EXCLUDED.label_ar,
  label_en = EXCLUDED.label_en,
  is_primary = TRUE,
  is_active = TRUE,
  updated_at = NOW();
