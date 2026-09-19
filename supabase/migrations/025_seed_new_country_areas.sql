-- 025: Seed the nine new countries as first-class isolated landing areas.
-- Every country owns its identity, currency, packages, content, links, FAQ, cities, and timezone.

INSERT INTO public.site_areas (slug, area_type, country_code, name_ar, name_en, currency_code, currency_symbol)
VALUES
  ('qatar', 'country', 'QA', 'قطر', 'Qatar', 'QAR', 'ر.ق'),
  ('oman', 'country', 'OM', 'عُمان', 'Oman', 'OMR', 'ر.ع'),
  ('jordan', 'country', 'JO', 'الأردن', 'Jordan', 'JOD', 'د.أ'),
  ('bahrain', 'country', 'BH', 'البحرين', 'Bahrain', 'BHD', 'د.ب'),
  ('france', 'country', 'FR', 'فرنسا', 'France', 'EUR', '€'),
  ('spain', 'country', 'ES', 'إسبانيا', 'Spain', 'EUR', '€'),
  ('netherlands', 'country', 'NL', 'هولندا', 'Netherlands', 'EUR', '€'),
  ('belgium', 'country', 'BE', 'بلجيكا', 'Belgium', 'EUR', '€'),
  ('sweden', 'country', 'SE', 'السويد', 'Sweden', 'SEK', 'كرونة')
ON CONFLICT (slug) DO UPDATE SET
  country_code = EXCLUDED.country_code,
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  currency_code = EXCLUDED.currency_code,
  currency_symbol = EXCLUDED.currency_symbol,
  is_active = TRUE,
  updated_at = NOW();

WITH country_data(slug, title, description, local_lead, quran_prices, arabic_prices) AS (
  VALUES
    ('qatar', 'تحفيظ القرآن وتأسيس العربية أونلاين في قطر | الحافظ', 'حصص فردية 30 دقيقة وباقات شهرية بالريال القطري.', 'نخدم الأسر العربية أونلاين في الدوحة والريان والوكرة والخور وأم صلال، والمدن المذكورة مناطق خدمة وليست فروعًا محلية.', ARRAY[55,98,145,190]::numeric[], ARRAY[72,130,195,255]::numeric[]),
    ('oman', 'تحفيظ القرآن وتأسيس العربية أونلاين في عُمان | الحافظ', 'حصص فردية 30 دقيقة وباقات شهرية بالريال العُماني.', 'نخدم الأسر العربية أونلاين في مسقط وصلالة وصحار ونزوى وصور وفق توقيت الأسرة.', ARRAY[5.5,10.5,15.5,20]::numeric[], ARRAY[7.5,14,21,27]::numeric[]),
    ('jordan', 'تحفيظ القرآن وتأسيس العربية أونلاين في الأردن | الحافظ', 'حصص فردية 30 دقيقة وباقات شهرية بالدينار الأردني.', 'نخدم الأسر العربية أونلاين في عمّان وإربد والزرقاء والعقبة والسلط، والمدن المذكورة للسياق المحلي وليست فروعًا.', ARRAY[11,20,30,39]::numeric[], ARRAY[14,26,38,51]::numeric[]),
    ('bahrain', 'تحفيظ القرآن وتأسيس العربية أونلاين في البحرين | الحافظ', 'حصص فردية 30 دقيقة وباقات شهرية بالدينار البحريني.', 'نخدم الأسر العربية أونلاين في المنامة والمحرق والرفاع ومدينة حمد والحد وفق جدول الأسرة.', ARRAY[6,11,16,21]::numeric[], ARRAY[8,14,20,27]::numeric[]),
    ('france', 'تحفيظ القرآن وتأسيس العربية أونلاين في فرنسا | الحافظ', 'حصص فردية 30 دقيقة وباقات شهرية باليورو والتعليم باللغة العربية.', 'نخدم الأسر العربية أونلاين في باريس وليون ومرسيليا وتولوز وليل. لغة التعليم والتواصل هي العربية.', ARRAY[13,24,37,48]::numeric[], ARRAY[17,31,47,63]::numeric[]),
    ('spain', 'تحفيظ القرآن وتأسيس العربية أونلاين في إسبانيا | الحافظ', 'حصص فردية 30 دقيقة وباقات شهرية باليورو.', 'نخدم الأسر العربية أونلاين في مدريد وبرشلونة وفالنسيا وإشبيلية وملقة، دون ادعاء وجود مقر محلي.', ARRAY[13,24,37,48]::numeric[], ARRAY[17,31,47,63]::numeric[]),
    ('netherlands', 'تحفيظ القرآن وتأسيس العربية أونلاين في هولندا | الحافظ', 'حصص فردية 30 دقيقة وباقات شهرية باليورو.', 'نخدم الأسر العربية أونلاين في أمستردام وروتردام وأوتريخت ولاهاي وأيندهوفن وفق الوقت المحلي.', ARRAY[13,24,37,48]::numeric[], ARRAY[17,31,47,63]::numeric[]),
    ('belgium', 'تحفيظ القرآن وتأسيس العربية أونلاين في بلجيكا | الحافظ', 'حصص فردية 30 دقيقة وباقات شهرية باليورو والتعليم والتواصل باللغة العربية.', 'نخدم الأسر العربية أونلاين في بروكسل وأنتويرب وغنت ولييج وبروج. لغة التعليم والتواصل هي العربية.', ARRAY[13,24,37,48]::numeric[], ARRAY[17,31,47,63]::numeric[]),
    ('sweden', 'تحفيظ القرآن وتأسيس العربية أونلاين في السويد | الحافظ', 'حصص فردية 30 دقيقة وباقات شهرية بالكرونة السويدية.', 'نخدم الأسر العربية أونلاين في ستوكهولم وغوتنبرغ ومالمو وأوبسالا وأوربرو وفق التوقيت المحلي.', ARRAY[148,276,414,542]::numeric[], ARRAY[197,355,532,709]::numeric[])
)
INSERT INTO public.area_content (area_id, content_key, content_ar, content_en, content_type, section, sort_order)
SELECT area.id, item.content_key, item.content_ar, item.content_ar, 'text', item.section, item.sort_order
FROM country_data data
JOIN public.site_areas area ON area.slug = data.slug
CROSS JOIN LATERAL (VALUES
  ('seo_title', data.title, 'seo', 0),
  ('seo_description', data.description, 'seo', 1),
  ('local_lead', data.local_lead, 'local', 10),
  ('language', 'لغة التعليم والتواصل هي العربية.', 'local', 11),
  ('package_includes', 'كل حصة فردية مدتها 30 دقيقة، مع حصة تجريبية مجانية ومتابعة مستمرة وتقرير بعد كل حصة.', 'packages', 20)
) AS item(content_key, content_ar, section, sort_order)
ON CONFLICT (area_id, content_key) DO UPDATE SET
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  section = EXCLUDED.section,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = NOW();

WITH country_data(slug, quran_prices, arabic_prices) AS (
  VALUES
    ('qatar', ARRAY[55,98,145,190]::numeric[], ARRAY[72,130,195,255]::numeric[]),
    ('oman', ARRAY[5.5,10.5,15.5,20]::numeric[], ARRAY[7.5,14,21,27]::numeric[]),
    ('jordan', ARRAY[11,20,30,39]::numeric[], ARRAY[14,26,38,51]::numeric[]),
    ('bahrain', ARRAY[6,11,16,21]::numeric[], ARRAY[8,14,20,27]::numeric[]),
    ('france', ARRAY[13,24,37,48]::numeric[], ARRAY[17,31,47,63]::numeric[]),
    ('spain', ARRAY[13,24,37,48]::numeric[], ARRAY[17,31,47,63]::numeric[]),
    ('netherlands', ARRAY[13,24,37,48]::numeric[], ARRAY[17,31,47,63]::numeric[]),
    ('belgium', ARRAY[13,24,37,48]::numeric[], ARRAY[17,31,47,63]::numeric[]),
    ('sweden', ARRAY[148,276,414,542]::numeric[], ARRAY[197,355,532,709]::numeric[])
)
INSERT INTO public.area_packages (area_id, program, package_key, name_ar, name_en, description_ar, price, currency_code, billing_period, sessions_per_month, features_ar, is_popular, is_active, sort_order)
SELECT area.id, program.program, program.program || '-30-' || sessions::text,
       CASE WHEN program.program = 'quran' THEN 'تحفيظ القرآن' ELSE 'تأسيس اللغة العربية' END || ' — 30 دقيقة — ' || sessions || ' حصص شهرياً',
       CASE WHEN program.program = 'quran' THEN 'تحفيظ القرآن' ELSE 'تأسيس اللغة العربية' END || ' — 30 دقيقة — ' || sessions || ' حصص شهرياً',
       CASE WHEN program.program = 'quran' THEN 'حصة فردية للحفظ والتسميع والتجويد والمراجعة.' ELSE 'حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.' END,
       CASE WHEN program.program = 'quran' THEN data.quran_prices[idx] ELSE data.arabic_prices[idx] END,
       area.currency_code, 'month', sessions,
       CASE WHEN program.program = 'quran' THEN '["30 دقيقة","حصة تجريبية مجانية","معلمون ومعلمات","متابعة وتقرير بعد كل حصة"]'::jsonb ELSE '["30 دقيقة","حصة تجريبية مجانية","معلمون ومعلمات","متابعة وتقرير بعد كل حصة"]'::jsonb END,
       sessions = 8, TRUE, idx
FROM country_data data
JOIN public.site_areas area ON area.slug = data.slug
CROSS JOIN LATERAL generate_series(1, 4) AS g(idx)
CROSS JOIN LATERAL (VALUES (g.idx * 4, 'quran'::text), (g.idx * 4, 'arabic'::text)) AS program(sessions, program)
ON CONFLICT (area_id, package_key) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  description_ar = EXCLUDED.description_ar,
  price = EXCLUDED.price,
  currency_code = EXCLUDED.currency_code,
  billing_period = EXCLUDED.billing_period,
  sessions_per_month = EXCLUDED.sessions_per_month,
  features_ar = EXCLUDED.features_ar,
  is_popular = EXCLUDED.is_popular,
  is_active = TRUE,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO public.area_links (area_id, link_key, label_ar, label_en, href, link_type, is_external, sort_order)
SELECT id, 'whatsapp', 'واتساب الحجز', 'Booking WhatsApp', 'https://wa.me/201130127894', 'whatsapp', TRUE, 10
FROM public.site_areas WHERE slug IN ('qatar','oman','jordan','bahrain','france','spain','netherlands','belgium','sweden')
ON CONFLICT (area_id, link_key) DO UPDATE SET href = EXCLUDED.href, is_active = TRUE, updated_at = NOW();

INSERT INTO public.area_links (area_id, link_key, label_ar, label_en, href, link_type, is_external, sort_order)
SELECT id, 'country-pages', 'روابط صفحات الدول', 'Country pages', '/' || slug, 'internal', FALSE, 20
FROM public.site_areas WHERE slug IN ('qatar','oman','jordan','bahrain','france','spain','netherlands','belgium','sweden')
ON CONFLICT (area_id, link_key) DO UPDATE SET href = EXCLUDED.href, is_active = TRUE, updated_at = NOW();

WITH country_data(slug, timezone_name, label_ar, city_names) AS (
  VALUES
    ('qatar','Asia/Qatar','توقيت قطر', ARRAY['الدوحة','الريان','الوكرة','الخور','أم صلال']),
    ('oman','Asia/Muscat','توقيت عُمان', ARRAY['مسقط','صلالة','صحار','نزوى','صور']),
    ('jordan','Asia/Amman','توقيت الأردن', ARRAY['عمّان','إربد','الزرقاء','العقبة','السلط']),
    ('bahrain','Asia/Bahrain','توقيت البحرين', ARRAY['المنامة','المحرق','الرفاع','مدينة حمد','الحد']),
    ('france','Europe/Paris','توقيت فرنسا', ARRAY['باريس','ليون','مرسيليا','تولوز','ليل']),
    ('spain','Europe/Madrid','توقيت إسبانيا', ARRAY['مدريد','برشلونة','فالنسيا','إشبيلية','ملقة']),
    ('netherlands','Europe/Amsterdam','توقيت هولندا', ARRAY['أمستردام','روتردام','أوتريخت','لاهاي','أيندهوفن']),
    ('belgium','Europe/Brussels','توقيت بلجيكا', ARRAY['بروكسل','أنتويرب','غنت','لييج','بروج']),
    ('sweden','Europe/Stockholm','توقيت السويد', ARRAY['ستوكهولم','غوتنبرغ','مالمو','أوبسالا','أوربرو'])
)
INSERT INTO public.area_timezones (area_id, timezone_name, label_ar, label_en, is_primary, sort_order)
SELECT area.id, data.timezone_name, data.label_ar, data.label_ar, TRUE, 10
FROM country_data data JOIN public.site_areas area ON area.slug = data.slug
ON CONFLICT (area_id, timezone_name) DO UPDATE SET label_ar = EXCLUDED.label_ar, is_primary = TRUE, is_active = TRUE, updated_at = NOW();

WITH country_data(slug, city_names) AS (
  VALUES
    ('qatar', ARRAY['الدوحة','الريان','الوكرة','الخور','أم صلال']),
    ('oman', ARRAY['مسقط','صلالة','صحار','نزوى','صور']),
    ('jordan', ARRAY['عمّان','إربد','الزرقاء','العقبة','السلط']),
    ('bahrain', ARRAY['المنامة','المحرق','الرفاع','مدينة حمد','الحد']),
    ('france', ARRAY['باريس','ليون','مرسيليا','تولوز','ليل']),
    ('spain', ARRAY['مدريد','برشلونة','فالنسيا','إشبيلية','ملقة']),
    ('netherlands', ARRAY['أمستردام','روتردام','أوتريخت','لاهاي','أيندهوفن']),
    ('belgium', ARRAY['بروكسل','أنتويرب','غنت','لييج','بروج']),
    ('sweden', ARRAY['ستوكهولم','غوتنبرغ','مالمو','أوبسالا','أوربرو'])
)
INSERT INTO public.area_cities (area_id, city_key, name_ar, name_en, region_name, sort_order)
SELECT area.id, data.slug || '-' || g.idx, city_name, city_name, data.slug, g.idx * 10
FROM country_data data JOIN public.site_areas area ON area.slug = data.slug
CROSS JOIN LATERAL unnest(data.city_names) WITH ORDINALITY AS g(city_name, idx)
ON CONFLICT (area_id, city_key) DO UPDATE SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, is_active = TRUE, sort_order = EXCLUDED.sort_order, updated_at = NOW();

WITH country_data(slug, timezone_label) AS (
  VALUES
    ('qatar','توقيت قطر'),('oman','توقيت عُمان'),('jordan','توقيت الأردن'),('bahrain','توقيت البحرين'),
    ('france','توقيت فرنسا'),('spain','توقيت إسبانيا'),('netherlands','توقيت هولندا'),('belgium','توقيت بلجيكا'),('sweden','توقيت السويد')
)
INSERT INTO public.area_faq_items (area_id, question_key, question_ar, answer_ar, sort_order)
SELECT area.id, data.slug || '-duration', 'ما مدة الحصة؟', 'مدة كل حصة 30 دقيقة، وهي حصة فردية مباشرة للطالب.', 10 FROM country_data data JOIN public.site_areas area ON area.slug = data.slug
UNION ALL
SELECT area.id, data.slug || '-trial', 'هل توجد حصة تجريبية مجانية؟', 'نعم، توجد حصة تجريبية مجانية قبل الاشتراك في الباقة الشهرية.', 20 FROM country_data data JOIN public.site_areas area ON area.slug = data.slug
UNION ALL
SELECT area.id, data.slug || '-language', 'ما لغة التعليم والتواصل؟', 'لغة التعليم والتواصل هي العربية.', 30 FROM country_data data JOIN public.site_areas area ON area.slug = data.slug
UNION ALL
SELECT area.id, data.slug || '-timezone', 'كيف يتم تنسيق الموعد؟', 'يتم تنسيق الموعد وفق التوقيت المحلي للبلد والوقت المناسب للأسرة.', 40 FROM country_data data JOIN public.site_areas area ON area.slug = data.slug
ON CONFLICT (area_id, question_key) DO UPDATE SET question_ar = EXCLUDED.question_ar, answer_ar = EXCLUDED.answer_ar, sort_order = EXCLUDED.sort_order, is_active = TRUE, updated_at = NOW();

INSERT INTO public.area_themes (area_id, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color, quran_fact_title_ar, quran_fact_body_ar, quran_fact_reference_ar)
SELECT area.id, data.theme_name_ar, data.theme_name_ar, data.primary_color, data.secondary_color, data.accent_color, data.background_color, data.text_color, data.fact_title, data.fact_body, data.fact_reference
FROM (VALUES
 ('qatar','هوية قطر الهادئة','#0B1F33','#B9E3DC','#C9A96E','#F6F1E8','#102A43','منهج الترتيل','قال تعالى: «ورتل القرآن ترتيلاً». القراءة المتأنية الواضحة تساعد على ضبط النطق وفهم المعنى دون عجلة.','سورة المزمل، الآية 4'),
 ('oman','هوية عُمان الترابية','#24352F','#E8EFEA','#B86F45','#F5F0E8','#24352F','التعلم بالتدرج','البداية الهادئة والمراجعة المنتظمة تساعد الطالب على بناء عادة ثابتة في التعلم.','معلومة تعليمية للصفحة'),
 ('jordan','هوية الأردن الواضحة','#102A43','#E8DED0','#B8894A','#F7F3EA','#102A43','رب زدني علماً','علّم الله نبيه أن يقول: «رب زدني علماً». التعلم رحلة تبدأ بخطوة واضحة وتستمر بالمراجعة.','سورة طه، الآية 114'),
 ('bahrain','هوية البحرين البحرية','#102A43','#DCECF2','#C83E4D','#F7F3EC','#102A43','الاستمرار الهادئ','القليل المنتظم خير من الكثير المنقطع، وتنظيم الوقت يساعد على متابعة الحفظ والتعلم.','معلومة تعليمية للصفحة'),
 ('france','هوية فرنسا الدافئة','#172A46','#EAF1F8','#D97761','#FFF8EF','#172A46','القراءة باب التعلم','افتتحت الرسالة بقوله تعالى: «اقرأ باسم ربك الذي خلق». القراءة والتعلم من أبواب الهداية.','سورة العلق، الآية 1'),
 ('spain','هوية إسبانيا المشمسة','#8F2D2D','#FBE7C6','#F2B84B','#FFF8ED','#5B2020','القرآن ميسّر للذكر','قال تعالى: «ولقد يسرنا القرآن للذكر فهل من مدكر». البداية المنتظمة تصنع تقدماً ثابتاً.','سورة القمر، الآية 17'),
 ('netherlands','هوية هولندا المنظمة','#172A3A','#EAF2F7','#D95D39','#FFF9F1','#172A3A','خطة واضحة للتعلم','تنظيم الموعد والمراجعة يربط الحصة بعادة أسبوعية يمكن للأسرة المحافظة عليها.','معلومة تعليمية للصفحة'),
 ('belgium','هوية بلجيكا المتوازنة','#1F2527','#E8F0F2','#D8A928','#FFF9F0','#202426','الترتيل منهج القراءة','قال تعالى: «ورتل القرآن ترتيلاً». القراءة المتأنية الواضحة تساعد على ضبط النطق.','سورة المزمل، الآية 4'),
 ('sweden','هوية السويد الهادئة','#102A43','#D9E8F5','#F2C94C','#F8FAFC','#344054','دعاء طالب العلم','قال تعالى: «وقل رب زدني علماً». التعلم المستمر يبنى بخطوات صغيرة واضحة.','سورة طه، الآية 114')
) AS data(slug, theme_name_ar, primary_color, secondary_color, accent_color, background_color, text_color, fact_title, fact_body, fact_reference)
JOIN public.site_areas area ON area.slug = data.slug
ON CONFLICT (area_id) DO UPDATE SET theme_name_ar = EXCLUDED.theme_name_ar, theme_name_en = EXCLUDED.theme_name_en, primary_color = EXCLUDED.primary_color, secondary_color = EXCLUDED.secondary_color, accent_color = EXCLUDED.accent_color, background_color = EXCLUDED.background_color, text_color = EXCLUDED.text_color, quran_fact_title_ar = EXCLUDED.quran_fact_title_ar, quran_fact_body_ar = EXCLUDED.quran_fact_body_ar, quran_fact_reference_ar = EXCLUDED.quran_fact_reference_ar, is_active = TRUE, updated_at = NOW();

-- Page-facing copy uses the same area_content contract as the legacy country pages.
INSERT INTO public.area_content (area_id, content_key, content_ar, content_en, content_type, section, sort_order)
SELECT area_id, 'page_title', content_ar, content_en, 'text', 'hero', 0
FROM public.area_content
WHERE content_key = 'seo_title'
  AND area_id IN (SELECT id FROM public.site_areas WHERE slug IN ('qatar','oman','jordan','bahrain','france','spain','netherlands','belgium','sweden'))
ON CONFLICT (area_id, content_key) DO UPDATE SET content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, is_active = TRUE, updated_at = NOW();

INSERT INTO public.area_content (area_id, content_key, content_ar, content_en, content_type, section, sort_order)
SELECT area_id, 'page_description', content_ar, content_en, 'text', 'hero', 1
FROM public.area_content
WHERE content_key = 'seo_description'
  AND area_id IN (SELECT id FROM public.site_areas WHERE slug IN ('qatar','oman','jordan','bahrain','france','spain','netherlands','belgium','sweden'))
ON CONFLICT (area_id, content_key) DO UPDATE SET content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, is_active = TRUE, updated_at = NOW();

INSERT INTO public.area_content (area_id, content_key, content_ar, content_en, content_type, section, sort_order)
SELECT id, 'eyebrow', 'القرآن والعربية أونلاين في ' || name_ar, 'Quran and Arabic online in ' || COALESCE(name_en, name_ar), 'text', 'hero', 2
FROM public.site_areas
WHERE slug IN ('qatar','oman','jordan','bahrain','france','spain','netherlands','belgium','sweden')
ON CONFLICT (area_id, content_key) DO UPDATE SET content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, is_active = TRUE, updated_at = NOW();

-- Kuwait is included explicitly because the earlier 024 migration only seeded its area shell and two links.
INSERT INTO public.site_areas (slug, area_type, country_code, name_ar, name_en, currency_code, currency_symbol)
VALUES ('kuwait', 'country', 'KW', 'الكويت', 'Kuwait', 'KWD', 'د.ك')
ON CONFLICT (slug) DO UPDATE SET country_code = EXCLUDED.country_code, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, currency_code = EXCLUDED.currency_code, currency_symbol = EXCLUDED.currency_symbol, is_active = TRUE, updated_at = NOW();

WITH area AS (SELECT id FROM public.site_areas WHERE slug = 'kuwait')
INSERT INTO public.area_content (area_id, content_key, content_ar, content_en, content_type, section, sort_order)
SELECT area.id, data.content_key, data.content_ar, data.content_ar, 'text', data.section, data.sort_order
FROM area CROSS JOIN (VALUES
 ('seo_title','تحفيظ القرآن وتأسيس العربية أونلاين في الكويت | أكاديمية الحافظ المتميز','seo',0),
 ('seo_description','حصص فردية أونلاين لتحفيظ القرآن وتأسيس اللغة العربية للناطقين بالعربية في الكويت، مع اختيار البرنامج والباقات الشهرية بالدينار الكويتي وحصة تجريبية مجانية.','seo',1),
 ('page_title','اختر برنامجك، وابدأ طريقك مع القرآن والعربية في الكويت','hero',2),
 ('page_description','حصص فردية أونلاين للناطقين بالعربية، صممت لتساعد الطالب على التعلم بخطة واضحة ووقت يناسب الأسرة.','hero',3),
 ('eyebrow','القرآن والعربية أونلاين في الكويت','hero',4),
 ('local_lead','نخدم الأسر العربية أونلاين في مدينة الكويت وحولي والفروانية ومبارك الكبير والأحمدي، دون ادعاء وجود مقر محلي.','local',10),
 ('language','لغة التعليم والتواصل هي العربية.','local',11),
 ('package_includes','كل حصة فردية مدتها 30 دقيقة، مع حصة تجريبية مجانية ومتابعة مستمرة وتقرير بعد كل حصة.','packages',20)
) AS data(content_key, content_ar, section, sort_order)
ON CONFLICT (area_id, content_key) DO UPDATE SET content_ar = EXCLUDED.content_ar, content_en = EXCLUDED.content_en, section = EXCLUDED.section, sort_order = EXCLUDED.sort_order, is_active = TRUE, updated_at = NOW();

WITH area AS (SELECT id, currency_code FROM public.site_areas WHERE slug = 'kuwait')
INSERT INTO public.area_packages (area_id, program, package_key, name_ar, name_en, description_ar, price, currency_code, billing_period, sessions_per_month, features_ar, is_popular, is_active, sort_order)
SELECT area.id, data.program, data.program || '-30-' || data.sessions::text, data.name_ar, data.name_ar, data.description_ar, data.price, area.currency_code, 'month', data.sessions, '["30 دقيقة","حصة تجريبية مجانية","معلمون ومعلمات","متابعة وتقرير بعد كل حصة"]'::jsonb, data.sessions = 8, TRUE, data.sort_order
FROM area CROSS JOIN (VALUES
 ('quran',4,'بداية منتظمة — 30 دقيقة — 4 حصص شهرياً','خطوة أولى للحفاظ على انتظام التعلم',4.5,10),
 ('quran',8,'تقدم متوازن — 30 دقيقة — 8 حصص شهرياً','تكرار يساعد على مواصلة الحفظ والمراجعة',8.5,20),
 ('quran',12,'متابعة موسعة — 30 دقيقة — 12 حصة شهرياً','وقت تعليمي أكثر للحفظ والتسميع والمراجعة',12.5,30),
 ('quran',16,'حضور متكرر — 30 دقيقة — 16 حصة شهرياً','خيار مناسب لمن يريد انتظاماً أعلى في الأسبوع',16.5,40),
 ('arabic',4,'بداية تأسيسية — 30 دقيقة — 4 حصص شهرياً','بداية منظمة لبناء المهارات الأساسية',6,50),
 ('arabic',8,'تدريب متوازن — 30 دقيقة — 8 حصص شهرياً','تكرار يساعد على تثبيت المهارات',11,60),
 ('arabic',12,'ممارسة منتظمة — 30 دقيقة — 12 حصة شهرياً','وقت إضافي للتدريب والتطبيق',16,70),
 ('arabic',16,'تأسيس متقدم — 30 دقيقة — 16 حصة شهرياً','متابعة أكثر انتظاماً للمهارات العربية',21,80)
) AS data(program, sessions, name_ar, description_ar, price, sort_order)
ON CONFLICT (area_id, package_key) DO UPDATE SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, description_ar = EXCLUDED.description_ar, price = EXCLUDED.price, currency_code = EXCLUDED.currency_code, billing_period = EXCLUDED.billing_period, sessions_per_month = EXCLUDED.sessions_per_month, features_ar = EXCLUDED.features_ar, is_popular = EXCLUDED.is_popular, is_active = TRUE, sort_order = EXCLUDED.sort_order, updated_at = NOW();

INSERT INTO public.area_links (area_id, link_key, label_ar, label_en, href, link_type, is_external, sort_order)
SELECT id, 'whatsapp', 'واتساب الحجز', 'Booking WhatsApp', 'https://wa.me/201130127894', 'whatsapp', TRUE, 10 FROM public.site_areas WHERE slug = 'kuwait'
ON CONFLICT (area_id, link_key) DO UPDATE SET href = EXCLUDED.href, label_ar = EXCLUDED.label_ar, label_en = EXCLUDED.label_en, is_active = TRUE, updated_at = NOW();

INSERT INTO public.area_links (area_id, link_key, label_ar, label_en, href, link_type, is_external, sort_order)
SELECT id, 'country-pages', 'روابط صفحات الدول', 'Country pages', '/kuwait', 'internal', FALSE, 20 FROM public.site_areas WHERE slug = 'kuwait'
ON CONFLICT (area_id, link_key) DO UPDATE SET href = EXCLUDED.href, is_active = TRUE, updated_at = NOW();

INSERT INTO public.area_timezones (area_id, timezone_name, label_ar, label_en, is_primary, sort_order)
SELECT id, 'Asia/Kuwait', 'توقيت الكويت', 'Kuwait Time', TRUE, 10 FROM public.site_areas WHERE slug = 'kuwait'
ON CONFLICT (area_id, timezone_name) DO UPDATE SET label_ar = EXCLUDED.label_ar, label_en = EXCLUDED.label_en, is_primary = TRUE, is_active = TRUE, updated_at = NOW();

INSERT INTO public.area_cities (area_id, city_key, name_ar, name_en, region_name, sort_order)
SELECT area.id, data.city_key, data.name_ar, data.name_ar, 'الكويت', data.sort_order
FROM (SELECT id FROM public.site_areas WHERE slug = 'kuwait') area CROSS JOIN (VALUES
 ('kuwait-city','مدينة الكويت',10),('hawally','حولي',20),('farwaniya','الفروانية',30),('mubarak-al-kabeer','مبارك الكبير',40),('ahmadi','الأحمدي',50)
) AS data(city_key, name_ar, sort_order)
ON CONFLICT (area_id, city_key) DO UPDATE SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, region_name = EXCLUDED.region_name, is_active = TRUE, sort_order = EXCLUDED.sort_order, updated_at = NOW();

INSERT INTO public.area_faq_items (area_id, question_key, question_ar, answer_ar, sort_order)
SELECT area.id, data.question_key, data.question_ar, data.answer_ar, data.sort_order
FROM (SELECT id FROM public.site_areas WHERE slug = 'kuwait') area CROSS JOIN (VALUES
 ('kuwait-duration','ما مدة الحصة؟','مدة كل حصة 30 دقيقة، وهي حصة فردية مباشرة للطالب.',10),
 ('kuwait-trial','هل توجد حصة تجريبية مجانية؟','نعم، توجد حصة تجريبية مجانية قبل الاشتراك في الباقة الشهرية.',20),
 ('kuwait-language','ما لغة التعليم والتواصل؟','لغة التعليم والتواصل هي العربية.',30),
 ('kuwait-booking','كيف أحجز؟','اختر البرنامج ثم تواصل معنا لحجز الحصة التجريبية المجانية.',40)
) AS data(question_key, question_ar, answer_ar, sort_order)
ON CONFLICT (area_id, question_key) DO UPDATE SET question_ar = EXCLUDED.question_ar, answer_ar = EXCLUDED.answer_ar, sort_order = EXCLUDED.sort_order, is_active = TRUE, updated_at = NOW();

INSERT INTO public.area_themes (area_id, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color, quran_fact_title_ar, quran_fact_body_ar, quran_fact_reference_ar)
SELECT id, 'هوية الكويت الهادئة', 'Kuwait calm identity', '#173F35', '#E4E9E5', '#B9C9BE', '#F6F7F3', '#173F35', 'القراءة باب التعلم', 'افتتحت الرسالة بقوله تعالى: «اقرأ باسم ربك الذي خلق». القراءة والتعلم من أبواب الهداية.', 'سورة العلق، الآية 1' FROM public.site_areas WHERE slug = 'kuwait'
ON CONFLICT (area_id) DO UPDATE SET theme_name_ar = EXCLUDED.theme_name_ar, theme_name_en = EXCLUDED.theme_name_en, primary_color = EXCLUDED.primary_color, secondary_color = EXCLUDED.secondary_color, accent_color = EXCLUDED.accent_color, background_color = EXCLUDED.background_color, text_color = EXCLUDED.text_color, quran_fact_title_ar = EXCLUDED.quran_fact_title_ar, quran_fact_body_ar = EXCLUDED.quran_fact_body_ar, quran_fact_reference_ar = EXCLUDED.quran_fact_reference_ar, is_active = TRUE, updated_at = NOW();
